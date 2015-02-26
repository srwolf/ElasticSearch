var ES, Fiber, elasticsearch;

Fiber = Npm.require('fibers');

elasticsearch = Npm.require('elasticsearch');

ES = new elasticsearch.Client(Meteor.settings.elasticsearch);

if (Meteor.settings && Meteor.settings.elasticsearch && Meteor.settings.elasticsearch.meteorLogger === "enabled") {
  Logger.enableLog("elasticsearch");
}

ES.river = {

  /*
    Create River
    @collection - name of the collection to river
    @options - optional object - all the same ones from the mongodb river docs .. and added:
      @mapping: optionally specify a mapping configuration
      @index: optionally specify an index name
   */
  create: function(collection, options, callback) {
    var credentials, filter, gridfs, index, mongodbOptions, putRiver, servers;
    index = options && options.index || Meteor.settings.app_name.replace(/\s+/g, '-').toLowerCase() || "meteor-river";
    mongodbOptions = options && options.options;
    servers = null;
    credentials = null;
    gridfs = null;
    filter = null;
    putRiver = function(cb) {
      var db, settings;
      db = process.env.MONGO_URL.split('/');
      db = db[db.length - 1];
      if (db.indexOf('?') !== -1) {
        db = db.substring(0, db.indexOf('?'));
      }
      settings = {
        type: "mongodb",
        mongodb: {
          db: db,
          collection: collection,
          options: mongodbOptions
        },
        index: {
          name: index,
          type: collection
        }
      };
      if (servers) {
        settings.mongodb.servers = servers;
      }
      if (credentials) {
        settings.mongodb.credentials = credentials;
      }
      if (gridfs) {
        settings.mongodb.gridfs = gridfs;
      }
      if (filter) {
        settings.mongodb.filter = filter;
      }
      return HTTP.put("http://" + Meteor.settings.elasticsearch.host + "/_river/" + collection + "/_meta", {
        data: settings
      }, function(err, res) {
        if (err) {
          return Logger.log("elasticsearch", "Error creating river for " + collection + " collection.");
        } else {
          Logger.log("elasticsearch", "Created river for " + collection + " collection.");
          return cb(res.content);
        }
      });
    };
    if (options) {
      if (options.index) {
        delete options.index;
      }
      if (options.gridfs) {
        gridfs = options.gridfs;
        delete options.gridfs;
      }
      if (options.credentials) {
        credentials = options.credentials;
        delete options.credentials;
      }
      if (options.filter) {
        filter = options.filter;
        delete options.filter;
      }
      if (options.servers) {
        servers = options.servers;
        delete options.servers;
      }
      if (options.mapping) {
        return ES.indices.putMapping({
          index: index,
          type: collection,
          body: options.mapping
        }, Meteor.bindEnvironment(function(err, result) {
          Logger.log("elasticsearch", "Put " + collection + " mapping.");
          delete options.mapping;
          return putRiver(function(res) {
            if (callback) {
              return callback(null, res);
            }
          });
        }), function(err) {
          return console.log(err);
        });
      } else {
        return putRiver(function(res) {
          if (callback) {
            return callback(null, res);
          }
        });
      }
    } else {
      return putRiver(function(res) {
        if (callback) {
          return callback(null, res);
        }
      });
    }
  },

  /*
    Destroy River
    @collection - name of the collection of the river to destroy
   */
  destroy: function(collection, callback) {
    return HTTP.del("http://" + Meteor.settings.elasticsearch.host + "/_river/" + collection, function(err, res) {
      Logger.log("elasticsearch", "Destroyed river for " + collection + " collection.");
      if (callback) {
        return callback(err, res);
      }
    });
  },

  /*
    Delete Type
    @collection - name of the collection of the river to destroy
   */
  "delete": function(index, collection, callback) {
    return HTTP.del("http://" + Meteor.settings.elasticsearch.host + "/" + index + "/" + collection, function(err, res) {
      Logger.log("elasticsearch", "Deleted river data for " + collection + " collection.");
      if (callback) {
        return callback(err, res);
      }
    });
  },

  /*
    Reriver
    @collection - name of the collection to river
    @options - optional object
      @fields = array of fields to river into ES
   */
  reriver: function(collection, options, callback) {
    var index;
    index = options && options.index || Meteor.settings.app_name.replace(/\s+/g, '-').toLowerCase() || "meteor-river";
    return this.destroy(collection, (function(_this) {
      return function(err, res) {
        return _this["delete"](index, collection, function(err, res) {
          return _this.create(collection, options, function(err, res) {
            if (callback) {
              return callback(err, res);
            }
          });
        });
      };
    })(this));
  }
};

this.ES = ES;
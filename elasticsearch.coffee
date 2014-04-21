Fiber = Npm.require 'fibers'
elasticsearch = Npm.require 'elasticsearch'
ES = new elasticsearch.Client Meteor.settings.elasticsearch

if Meteor.settings && Meteor.settings.elasticsearch && Meteor.settings.elasticsearch.meteorLogger is "enabled"
  Logger.enableLog "elasticsearch"

ES.river =

  ###
    Create River
    @collection - name of the collection to river
    @options - optional object - all the same ones from the mongodb river docs .. and added:
      @mapping: optionally specify a mapping configuration
      @index: optionally specify an index name
  ###
  create: (collection, options, callback) ->

    index = options && options.index || Meteor.settings.app_name.replace(/\s+/g, '-').toLowerCase() || "meteor-river"
    servers = null
    credentials = null
    gridfs = null
    filter = null

    putRiver = (cb) ->

      db = process.env.MONGO_URL.split('/')
      db = db[db.length-1]

      settings =
        type: "mongodb"
        mongodb:
          db: db
          collection: collection
        index:
          name: index
          type: collection

      #if options then settings.mongodb.options = options
      if servers then settings.mongodb.servers = servers
      if credentials then settings.mongodb.credentials = credentials
      if gridfs then settings.mongodb.gridfs = gridfs
      if filter then settings.mongodb.filter = filter

      HTTP.put "http://#{Meteor.settings.elasticsearch.host}/_river/#{collection}/_meta", {data: settings}, (err, res) ->
        if err
          Logger.log "elasticsearch", "Error creating river for #{collection} collection."
        else
          Logger.log "elasticsearch", "Created river for #{collection} collection."
          cb res.content

    if options

      if options.index
        delete options.index

      if options.gridfs
        gridfs = options.gridfs
        delete options.gridfs

      if options.credentials
        credentials = options.credentials
        delete options.credentials

      if options.filter
        filter = options.filter
        delete options.filter

      if options.servers
        servers = options.servers
        delete options.servers


      if options.mapping
        # ES.indices.create
        #   index: index
        # ->
        #   Logger.log "elasticsearch", "Created #{index} index."

        ES.indices.putMapping
          index: index
          type: collection
          body: options.mapping
        , Meteor.bindEnvironment((err, result) ->
          Logger.log "elasticsearch", "Put #{collection} mapping."

          delete options.mapping

          putRiver (res) ->
            if callback
              callback null, res
        ), (err) ->
          console.log err

      else
        putRiver (res) ->
          if callback
            callback null, res

    else
      putRiver (res) ->
        if callback
          callback null, res


  ###
    Destroy River
    @collection - name of the collection of the river to destroy
  ###
  destroy: (collection, callback) ->

    HTTP.del "http://#{Meteor.settings.elasticsearch.host}/_river/#{collection}", (err, res) ->
      Logger.log "elasticsearch", "Destroyed river for #{collection} collection."
      if callback
        callback err, res

  ###
    Delete Type
    @collection - name of the collection of the river to destroy
  ###
  delete: (index, collection, callback) ->

    HTTP.del "http://#{Meteor.settings.elasticsearch.host}/#{index}/#{collection}", (err, res) ->
      Logger.log "elasticsearch", "Deleted river data for #{collection} collection."
      if callback
        callback err, res


  ###
    Reriver
    @collection - name of the collection to river
    @options - optional object
      @fields = array of fields to river into ES
  ###
  reriver: (collection, options, callback) ->

    index = options && options.index || Meteor.settings.app_name.replace(/\s+/g, '-').toLowerCase() || "meteor-river"

    @destroy collection, (err, res) =>
      @delete index, collection, (err, res) =>
        @create collection, options, (err, res) ->
          if callback
            callback err, res

@ES = ES


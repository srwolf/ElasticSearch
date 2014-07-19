Meteor Elasticsearch
===================
Elasticsearch client for meteor server side. Added methods to easily manage rivering mongo collections and a meteor method to search from the client side.

*Includes the official low-level Elasticsearch client for Node.js and the browser pack*

### Installation
```bash
mrt add elasticsearch
```

### Configuration
Meteor Elasticsearch automatically creates the client instance from the configuration you put in your settings file. Here is an example settings.json file.
```json
{
  "app_name": "The Dopest Search",
  "elasticsearch": {
    "host": "localhost:9201",
    "meteorLogger": true
  }
}

```

*If you are not sure how to use a settings file*
```bash
mrt --settings settings.json
```

## Meteor Mongo Rivering

#### ES Requirements
*This package takes advantage of the MongoDB River for ES and is required to use the river methods:*

This plugin uses MongoDB as datasource to store data in ElasticSearch. Filtering and transformation are also possible.
See the [wiki](https://github.com/richardwilly98/elasticsearch-river-mongodb/wiki) for more details.

In order to install the plugin, simply run: ```bin/plugin --install com.github.richardwilly98.elasticsearch/elasticsearch-river-mongodb/2.0.0```

#### MongoDB Requirements
*The river plugin also requires that your MongoDB is set up as a replica set, read this for more information:*

[MongoDB Replica Set for Development Guide](http://docs.mongodb.org/manual/tutorial/deploy-replica-set-for-testing/)

#### Simple River
```javascript
ES.river.create("tweets", {});
```

#### With Mapping
*(all the options found in the es river wiki can be used in the second parameter)*
```javascript
ES.river.create("tweets", {
  mapping: {
    blocks: {
      properties: {
        content: {
          type: "string",
          index: "analyzed"
        },
        name: {
          type: "string",
          index: "analyzed"
        }
      }
    }
  }
}, function(err, res) {
  console.log(res);
});
```

#### With River Options
```javascript
ES.river.create("tweets", {
  options: {
    "secondary_read_preference" : true,
    "drop_collection": ${mongo.drop.collection},
    "exclude_fields": ${mongo.exclude.fields},
    "include_fields": ${mongo.include.fields},
    "include_collection": ${mongo.include.collection},
    "import_all_collections": ${mongo.import.all.collections},
    "initial_timestamp": {
      "script_type": ${mongo.initial.timestamp.script.type},
      "script": ${mongo.initial.timestamp.script}
    },
    "skip_initial_import" : ${mongo.skip.initial.import},
    "store_statistics" : ${mongo.store.statistics}
  }
}, function(err, res) {
  console.log(res);
});
```

## Meteor Search
```javascript
var search = {
  tweets: function(query) {
    return Meteor.call("search", query, {
      collection: "tweets",
      fields: ["name", "content"],
      size: 5
    }, function(err, res) {
      var results;
      if (err) {
        return console.log(err);
      } else {
        return res;
      }
    });
  }
};
```

## Features

 - One-to-one mapping with REST API and the other official clients
 - Generalized, pluggable architecture. See [Extending Core Components](http://www.elasticsearch.org/guide/en/elasticsearch/client/javascript-api/current/extending_core_components.html)
 - Configurable, automatic discovery of cluster nodes
 - Persistent, Keep-Alive connections
 - Load balancing (with pluggable selection strategy) across all available nodes.


## Supported Elasticsearch Versions

[Jenkins](https://build.elasticsearch.org/job/es-js_nightly/)

Elasticsearch.js provides support for, and is regularly tested against, Elasticsearch releases **0.90.5 and greater**. We also test against the latest changes in the 0.90 and master branches of the Elasticsearch repository. To tell the client which version of Elastisearch you are using, and therefore the API it should provide, set the `apiVersion` config param. [More info](http://www.elasticsearch.org/guide/en/elasticsearch/client/javascript-api/current/configuration.html#_config_options)

## Examples

Send a HEAD request to `/?hello=elasticsearch` and allow up to 1 second for it to complete.
```js
ES.ping({
  // ping usually has a 100ms timeout
  requestTimeout: 1000,

  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});
```

Skip the callback to get a promise back
```js
ES.search({
  q: 'pants'
}).then(function (body) {
  var hits = body.hits.hits;
}, function (error) {
  console.trace(error.message);
});
```

Find tweets that have "elasticsearch" in their body field
```js
ES.search({
  index: 'twitter',
  type: 'tweets',
  body: {
    query: {
      match: {
        body: 'elasticsearch'
      }
    }
  }
}).then(function (resp) {
    var hits = resp.hits.hits;
}, function (err) {
    console.trace(err.message);
});
```

More examples and detailed information about each method are available [here](http://www.elasticsearch.org/guide/en/elasticsearch/client/javascript-api/current/index.html)

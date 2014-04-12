Meteor Elasticsearch
===================
Elasticsearch client for meteor server side. Havent fentured into giving the client any privilages yet. Also working on methods to easily river meteor collections into ES.

*Includes the official low-level Elasticsearch client for Node.js and the browser pack*

[![Build Status](https://travis-ci.org/elasticsearch/elasticsearch-js.png?branch=2.1)](https://travis-ci.org/elasticsearch/elasticsearch-js?branch=2.1) [![Coverage Status](https://coveralls.io/repos/elasticsearch/elasticsearch-js/badge.png?branch=2.1)](https://coveralls.io/r/elasticsearch/elasticsearch-js?branch=2.1) [![Dependencies up to date](https://david-dm.org/elasticsearch/elasticsearch-js.png)](https://david-dm.org/elasticsearch/elasticsearch-js)


### Installation
```bash
mrt add elasticsearch
```

### Configuration
Meteor Elasticsearch automatically creates the client instance from the configuration you put in your settings file. Here is an example settings.json file.
```json
{
  "elasticsearch": {
    "host": "localhost:9201",
    "log: 'trace"
  }
}

```

*If you are not sure how to use a settings file*
```bash
mrt --settings settings.json
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

## License

This software is licensed under the Apache 2 license, quoted below.

    Copyright (c) 2014 Elasticsearch <http://www.elasticsearch.org>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

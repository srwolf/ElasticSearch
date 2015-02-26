Package.describe({
  name: "bigdata:elasticsearch",
  summary: "Meteor interface for ES, provides easy methods to river meteor collections aswell. ES: Open Source, Distributed, RESTful Search Engine",
  version: "1.0.0",
  githubUrl: "https://github.com/meteorbigdata/elasticsearch.git"
});

Npm.depends({
  "elasticsearch": "2.1.2"
});

Package.onUse(function (api, where) {
  api.versionsFrom("METEOR@1.0");

  api.use([
    'coffeescript',
    'http',
    'bigdata:logs'
  ], ['server']);

  api.addFiles([
    'elasticsearch.js',
    'methods.js'
  ], ['server']);

  api.export('ES');
});
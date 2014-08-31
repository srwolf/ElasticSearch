Package.describe({
  summary: "Meteor interface for ES, provides easy methods to river meteor collections aswell. ES: Open Source, Distributed, RESTful Search Engine",
  version: "0.0.6",
  githubUrl: "https://github.com/andrewreedy/meteor-elasticsearch.git"
});

Npm.depends({
  "elasticsearch": "2.1.2"
});

Package.onUse(function (api, where) {
  api.versionsFrom("METEOR@0.9.0");

  api.use([
    'coffeescript',
    'http',
    'mrt:log'
  ], ['server']);

  api.addFiles([
    'elasticsearch.coffee',
    'methods.coffee'
  ], ['server']);

  api.export('ES');
});
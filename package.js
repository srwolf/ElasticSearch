Package.describe({
  summary: "Meteor interface for ES, provides easy methods to river meteor collections aswell. ES: Open Source, Distributed, RESTful Search Engine"
});

Npm.depends({
  "elasticsearch": "2.1.2"
});

Package.on_use(function (api, where) {
  api.use([
    'coffeescript',
    'http',
    'log'
  ], ['server']);

  api.add_files([
    'elasticsearch.coffee',
    'methods.coffee'
  ], ['server']);


  api.export('ES');
});
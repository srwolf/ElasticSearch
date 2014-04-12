Package.describe({
  summary: "Meteor interface for ES, provides easy methods to river meteor collections aswell. ES: Open Source, Distributed, RESTful Search Engine"
});

Npm.depends({
  "elasticsearch": "2.1.2"
});

Package.on_use(function (api, where) {
  api.export('ES');
  api.add_files('elasticsearch.js', ['server']);
});
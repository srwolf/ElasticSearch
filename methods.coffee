Future = Npm.require 'fibers/future'

Meteor.methods

  ###
    Search
    @query: string value to search for
    @options: optional object with optional params
      @collection: name of the collection to search
      @fileds: array of field names to search
      @size: number of results to return
  ###
  search: (searchQuery, options)->

    index = options && options.index || Meteor.settings.app_name.replace(/\s+/g, '-').toLowerCase() || "meteor-river"

    # Default query
    query =
      index: index
      body:
        query:
          match:
            name: searchQuery

    if options

      # Search a specific collection
      if options.collection
        query.type = options.collection

      # If fields specified generate ES Bool Query else search all fields
      if options.fields
        query.body.query =
          bool:
            should: []
        for field in options.fields
          f =
            match: {}
          f.match[field] = searchQuery
          query.body.query.bool.should.push f

      # Number of results to return
      if options.size
        query.body.size = options.size

    console.log query

    future = new Future()

    ES.search query
    .then (resp) ->
      hits = resp.hits.hits
      console.log hits
      Logger.log "elasticsearch", 'Search results for "' + searchQuery + '" returned', hits
      future.return hits
    , (err) ->
      console.trace err.message

    future.wait()
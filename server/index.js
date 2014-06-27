// Express REST API base
// =====================
//
// Glad to see you here. Let me present you a simple effective way to manage
// your future RESTful API.

// It uses `express` for HTTP request handling ...
var express = require('express'),
    app = express(),
    // ... `require-all` for requiring all modules of a folder ...
    requireAll = function() {
        try {
            return require('require-all').apply(this, arguments);
        } catch(e) {
            if(e.code != 'ENOENT')
                throw e;
        }
    },
    // .. and `mongoose` for the database.
    mongoose = require('mongoose'),
    // `lodash` is quite useful sometimes.
    _ = (global._ = require('lodash'));

require('coffee-script/register'); // Yeah, I like CoffeeScript.

// Let's load the configuration of our server.
// We first put all the configuration in the `config` global

global.config = 
    requireAll({
        dirname: __dirname + '/config',
        filter: /(.+)\.(?:js|json|coffee|litcoffee)?$/
    });

// Let's make `mongoose` global ...

global.mongoose = mongoose;
mongoose.validate = require('mongoose-validator');

// And then, we connect to your database.

global.db = mongoose.connect(
    config.database.uri
);

// Then, we configures express' middlewares by calling `config.server.middlewares`
// function. See `server.js` file for further details.

((config.server || {}).middlewares || function() {})(app);

// Loading helpers ...

global.helpers = requireAll({
    dirname: __dirname + '/helpers',
    filter: /(.+)\.(?:js|coffee|litcoffee)?$/
});

// Now, we're going to setup `app.VERB()` globals, and the namespace definition
// of routes.

(function() {
    // This variable contains the current namespace, here, `app`.
    var lastNamespace = app;

    // I know that all HTTP methods and express' ones aren't here, but feel free to add them !
    [
        'get',
        'post',
        'put',
        'patch',
        'delete',
        'head',
        'all',
        'param',
        'use',
        'route'
    ].forEach(function(method) {
        // For each method, `global[method]` will call the method of the `lastNamespace`
        // created.
        global[method] = function() {
            lastNamespace[method].apply(lastNamespace, arguments);
        };
    });

    // The `namespace` function. When you create a new namespace, you simply create
    // a new router.

    global.namespace = function(basePath, fn) {
        // Here.
        if(!config.router.caseSensitive)
            basePath = basePath.toLowerCase();
        if(config.router.strict && basePath.match(/\/$/))
            basePath = basePath.slice(0,-1);

        var router = express.Router(config.router);

        var oldNamespace = lastNamespace;
        lastNamespace = router;

        // Then, we call the function defining all our routes in that namespace
        fn(router);

        // And we restore the oldNamespace, and bind the new namespace to the older.
        (lastNamespace = oldNamespace).use(basePath, router);
    }
})();


// Then, our models.
// We load them ...

var models = 
    requireAll({
        dirname: __dirname + '/models',
        filter: /(.+)\.(?:js|coffee|litcoffee)?$/
    });
global.Models = {};

for (name in models) {
    if (models.hasOwnProperty(name)) {
        var model = mongoose.model(name, models[name]);
        // .. and put them in the `Models[name]` global.
        global.Models[name] = model;
        // And in the `name` global, if available
        if (!global.hasOwnProperty(name)) {
            global[name] = global.Models[name];
        }
    }
}

//(((config.database || {}).associations) || function(){})();

// Finally, we loads our controllers.

// In the `/api` namespace, if you want.
namespace('/api', function() {
    requireAll({
        dirname: __dirname + '/controllers',
        filter: /(.+)\.(?:js|coffee|litcoffee)?$/
    });
});


// Global error handling

app.use(
    (helpers.errors || {}).express || function(){arguments[3]();}
);

// Listen to your clients, you're ready !
app.listen(config.server.port);
console.log("Express server ready : listening on port "+config.server.port);

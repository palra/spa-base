# Configuration files : server.js
# ===================
# 
# As the file is named `server.js`, the `module.exports` will be the future
# `config.server̀  global.
# This file defines all `express` modules settings.

module.exports =
    
    # The port parameter
    port: 3000
    
    # Middlewares
    middlewares: (app) ->
        
        # The `res.respond` method.
        app.use (req, res, next) ->
            res.respond = (data, error, status) ->
                meta = {}
                status = 200  unless status?
                error = false  unless error?
                data = []  if _.isEmpty(data)
                data = new Array(data)  unless _.isArray(data)
                if not _.isEmpty(res.db) and not error
                    meta.order = res.db.order
                    meta.total = res.db.count
                    meta.page = res.db.page
                    meta.byPage = res.db.byPage
                    meta.nbPages = res.db.nbPages
                meta.error = error.toString()
                meta.count = data.length
                res.json status,
                    _meta: meta
                    data: data


            next()
            return

        app.use require("express").static(__dirname + "/../../client/build")
        app.use require("method-override")("X-HTTP-Method-Override")
        app.use require("body-parser")()
        app.use require("cookie-parser")()
        app.use require("cookie-session")(secret: "RandomSecretStringChangeIt!")
        #app.use(require('csurf')());
        return

# What to say more, nothing. Bye.
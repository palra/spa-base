UsersAttributes = ['_id', 'email', 'createdAt', 'updatedAt']

namespace '/users', UserNamespace = (router) ->
	param 'message_id', UserParam = (req, res, next, id) ->
		User.findById id, UsersAttributes.join(' '), (err, message) ->
			if err
				next err
			else
				req.message = message
				if req.message isnt null
					next()
				else
					res.respond "User ##{id} not found.", true, 404
					next new Error "User ##{id} not found."

	get '/', ListUsers = (req, res) ->
		User.count {}, (err, count) ->
			helpers.pagination req, res, count
			User.find()
				.select UsersAttributes.join(' ')
				.skip res.db.offset 
				.limit res.db.limit 
				.sort res.db.order = '-createdAt' 
				.exec (err, result) ->
					if err
						next err
					else
						res.respond result


	get '/:message_id', FindUser = (req, res) ->
		res.respond req.message

MessagesAttributes = ['_id', 'message', 'title', 'createdAt', 'updatedAt']

namespace '/messages', MessageNamespace = (router) ->
	param 'message_id', (req, res, next, id) ->
		Message.findById id, MessagesAttributes.join(' '), (err, message) ->
			if err
				next err
			else
				req.message = message
				if req.message isnt null
					next()
				else
					res.respond "Message ##{id} not found.", true, 404
					next new Error "Message ##{id} not found."

	get '/', ListMessages = (req, res, next) ->
		Message.count {}, (err, count) ->
			helpers.pagination req, res, count
			Message.find()
				.select MessagesAttributes.join(' ')
				.skip res.db.offset 
				.limit res.db.limit 
				.sort res.db.order = '-createdAt' 
				.exec (err, result) ->
					if err
						next err
					else
						res.respond result

	get '/:message_id', FindMessage = (req, res) ->
		res.respond req.message

	post '/', CreateMessage = (req, res, next) ->
		Message.create
			message: req.body.message
			title: req.body.title
		, (err, message) ->
			if err
				next err
			else
				res.respond message, false, 201

	put '/:message_id', UpdateMessage = (req, res, next) ->
		req.message.message = req.body.message
		req.message.title = req.body.title

		req.message.save (err) ->
			if err
				next err
			else
				res.respond req.message

	router.delete '/:message_id', DeleteMessage = (req, res, next) ->
		req.message.remove (err, message) ->
			if err
				next err
			else
				res.respond message
		

	router.delete '/', DeleteAllMessages = (req, res, next) ->
		Message.remove (err) ->
			if err
				next err
			else
				res.respond()
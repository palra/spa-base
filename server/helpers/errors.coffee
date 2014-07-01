mongoose.Error.NotFound = (id) ->
	@name = 'NotFound'
	@message = "Document ##{id} not found"
	@stack = (new mongoose.Error()).stack
mongoose.Error.NotFound:: = new mongoose.Error

module.exports = 
	db: (err, req, res, next) ->
		if err instanceof mongoose.Error.CastError
			res.respond 
				message: 'Invalid ID'
				code: 'DB010'
			, true, 400
		else if err instanceof mongoose.Error.NotFound
			res.respond _.merge(err,
				code: 'DB011'
			), true, 404
		else if err instanceof mongoose.Error.ValidationError
			res.respond _.merge(err,
				code: 'DB020'
			), true, 400
		else
			console.log "\x1B[4m\x1B[31m\x1B[1m #{err.message} \x1B[24m\x1B[39m\x1B[22m"
			console.log err.stack
			res.respond 
				message: 'Database error'
				code: 'DB000'
			, true, 500

	express: (err, req, res, next) ->
		if err instanceof mongoose.Error
			module.exports.db.apply this, arguments
		else
			console.log "\x1B[4m\x1B[31m\x1B[1m #{err.message} \x1B[24m\x1B[39m\x1B[22m"
			console.log err.stack
			res.respond
				message: 'Server error'
				code: 'SV000'
			, true, 500
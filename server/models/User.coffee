bcrypt = require 'bcryptjs'
SALT_WORK_FACTOR = 10

User = module.exports = new mongoose.Schema(
  email:
    type: String
    required: true
    validate: [
      mongoose.validate
        validator: 'isEmail'
        message: "The email field should be a valid email."
    ]

  password:
    type: String
    required: true
    validate: [
      mongoose.validate
        validator: 'isLength'
        message: "The password field should be between 10 and 254 characters long."
        arguments: [6, 254]
    ]
)

User.plugin require("mongoose-timestamp")

User.methods.comparePasswords = (candidate, cb) ->
	bcrypt.compare candidate, @.password, (err, match) ->
		if err
			return cb err
		cb null, match

User.pre 'init', (next) ->
	user = @

	if not user.isModified 'password'
		return next()
	else
		bcrypt.genSalt SALT_WORK_FACTOR, (err, salt) ->
			if err
				return next err
			bcrypt.hash attrs.password, salt, (err, hash) ->
				if err
					return next err
				user.password = hash
				next()
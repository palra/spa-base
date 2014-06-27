# Models
# ======
# 
# In the `models` folder, you can define your models.
# What to say more, just enjoy.

Message = module.exports = new mongoose.Schema(
  message:
    type: String
    required: true
    validate: [
      mongoose.validate
        validator: 'isLength'
        message: "The message field should be at least 50 characters long."
        arguments: [50]
    ]

  title:
    type: String
    required: true
    validate: [
      mongoose.validate
        validator: 'isLength'
        message: "The title field should be between 10 and 254 characters long."
        arguments: [10, 254]
    ]
)

Message.plugin require("mongoose-timestamp")
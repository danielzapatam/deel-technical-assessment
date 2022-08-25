const Joi = require('joi')

const schema = Joi.object({
  id: Joi.number().required().min(1),
})

module.exports = schema

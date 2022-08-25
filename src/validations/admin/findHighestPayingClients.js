const Joi = require('joi')

const schema = Joi.object({
  start: Joi.date().required(),
  end: Joi.date().required().min(Joi.ref('start')),
})

module.exports = schema

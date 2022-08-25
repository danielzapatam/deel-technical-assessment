const Joi = require('joi')

const schema = Joi.object({
  start: Joi.date().required(),
  end: Joi.date().required().min(Joi.ref('start')),
  limit: Joi.number().default(2).min(1),
})

module.exports = schema

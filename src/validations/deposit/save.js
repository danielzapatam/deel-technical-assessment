const Joi = require('joi')

const paramsSchema = Joi.object({
  userId: Joi.number().required().min(1),
})

const bodySchema = Joi.object({
  value: Joi.number().required().min(1),
})

module.exports = {
  paramsSchema,
  bodySchema,
}

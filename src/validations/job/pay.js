const Joi = require('joi')

const schema = Joi.object({
  job_id: Joi.number().required().min(1),
})

module.exports = schema

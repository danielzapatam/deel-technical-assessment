const express = require('express')
const router = express.Router()
const { getProfile } = require('../middlewares/getProfile')
const validator = require('express-joi-validation').createValidator({})
const { paramsSchema, bodySchema } = require('../validations/deposit/save')

const deposit = require('../controllers/deposit')

router.post(
  '/deposit/:userId',
  getProfile('client'),
  validator.params(paramsSchema),
  validator.body(bodySchema),
  deposit.save
)

module.exports = router

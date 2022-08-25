const express = require('express')
const router = express.Router()
const { getProfile } = require('../middlewares/getProfile')
const pay = require('../validations/job/pay')
const validator = require('express-joi-validation').createValidator({})

const jobs = require('../controllers/job')

router.get('/unpaid', getProfile(), jobs.findUnpaid)
router.post(
  '/:job_id/pay',
  getProfile('client'),
  validator.params(pay),
  jobs.pay
)

module.exports = router

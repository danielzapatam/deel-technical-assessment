const express = require('express')
const router = express.Router()
const { getProfile } = require('../middlewares/getProfile')
const findHighestPaidProfessionSchema = require('../validations/admin/findHighestPaidProfession')
const findHighestPayingClients = require('../validations/admin/findHighestPayingClients')
const validator = require('express-joi-validation').createValidator({})

const admin = require('../controllers/admin')

router.get(
  '/best-profession',
  getProfile('admin'),
  validator.query(findHighestPaidProfessionSchema),
  admin.findHighestPaidProfession
)
router.get(
  '/best-clients',
  getProfile('admin'),
  validator.query(findHighestPayingClients),
  admin.findHighestPayingClients
)

module.exports = router

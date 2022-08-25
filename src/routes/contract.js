const express = require('express')
const router = express.Router()
const { getProfile } = require('../middlewares/getProfile')
const findById = require('../validations/contract/findById')
const validator = require('express-joi-validation').createValidator({})

const contracts = require('../controllers/contract')

router.get('/:id', getProfile(), validator.params(findById), contracts.findById)
router.get('/', getProfile(), contracts.findAll)

module.exports = router

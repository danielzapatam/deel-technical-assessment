const Deposit = require('../models/deposit')

async function save(deposit, transaction) {
  await Deposit.create(deposit, { transaction })
}

module.exports = { save }

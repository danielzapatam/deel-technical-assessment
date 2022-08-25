const Profile = require('../models/profile')
const { Op, literal } = require('sequelize')
const DeelError = require('../exceptions/deelError')

async function findById(id) {
  return await Profile.findByPk(id)
}

async function substractToBalanceById(id, value, transaction) {
  const result = (
    await Profile.update(
      {
        balance: literal(`balance - ${value}`),
      },
      {
        where: {
          id,
          balance: {
            [Op.gte]: value, // This is the key to avoid strange results when there's concurrency in the same record.
            // I need to validate here, in the db, so that the db makes the operation without latency
          },
        },
        transaction,
      }
    )
  ).shift()
  // The above method returns 0 or 1. 0 means: nothing updated. 1 means: something updated
  // If it is 0 is an error because it must update something

  if (!result) {
    throw new DeelError(
      `Substract operation to balance for the client with id: ${id} was unsuccessful. It can be due to:
        1. Client with id: ${id} doesn't exist
        2. Client doesn't have enough balance to make a transaction for the value: ${value}`,
      400
    )
  }
}

async function sumToBalanceById(id, value, transaction) {
  await Profile.update(
    {
      balance: literal(`balance + ${value}`),
    },
    {
      where: {
        id,
      },
      transaction,
    }
  )
}

module.exports = { findById, substractToBalanceById, sumToBalanceById }

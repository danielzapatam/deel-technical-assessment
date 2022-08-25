const { save: create } = require('../database/deposit')
const { getSumOfUnpaidByClientId } = require('../database/job')
const { findById } = require('../database/profile')
const {
  substractToBalanceById,
  sumToBalanceById,
} = require('../database/profile')
const { deposit } = require('../utilities/constants')
const { sequelize } = require('../database/connection')
const DeelError = require('../exceptions/deelError')

/**
 * Saves a deposit into the table Deposit, making validations about
 * availability of money for the sender client and others. Finally, substracts
 * from sender client balance such value, and adds this value to the receiver
 * client balance. Those three operations are concurrent. If one of them fails,
 * a ROLLBACK will be applied.
 * This process is for clients only (not contractors)
 * @param  {userId} req: Requester client id. Required
 * @return {res}: Returns either a good response or an error
 */
async function save(req, res) {
  const { profile } = req
  const { userId: receiverClient } = req.params
  if (profile.id === receiverClient) {
    throw new DeelError("A user can't receive a deposit from himself", 400)
  }

  const [_, unpaidJobs] = await Promise.all([
    validateReceiverClient(receiverClient),
    findUnpaidJobs(profile.id),
  ]) // These validations can take advantage from asynchronism

  const { value: valueToDeposit } = req.body
  const maxDeposit = unpaidJobs * (deposit.MAX_PERCENTAGE / 100)
  if (valueToDeposit > maxDeposit) {
    throw new DeelError(
      `Value to deposit (${valueToDeposit}) is greater than the maximum deposit (${maxDeposit})`,
      400
    )
  }

  const newDeposit = {
    value: valueToDeposit,
    SenderId: profile.id,
    ReceiverId: receiverClient,
  }
  await sequelize.transaction(async (t) => {
    await Promise.all([
      create(newDeposit, t),
      substractToBalanceById(profile.id, valueToDeposit, t),
      sumToBalanceById(receiverClient, valueToDeposit, t),
    ])
  }) // Makes three process concurrently. If some fails, a ROLLBACK will be applied

  res.status(200).end()
}

async function validateReceiverClient(receiverId) {
  const receiverClient = await findById(receiverId)
  if (receiverClient.type === 'contractor')
    throw new DeelError(
      `Receiver profile with id: ${receiverId} is not client. He is contractor`,
      401
    )
}

async function findUnpaidJobs(senderId) {
  const unpaidJobs = await getSumOfUnpaidByClientId(senderId)
  if (!unpaidJobs) {
    throw new DeelError(
      "Client can't deposit, because he doesn't have jobs to pay",
      400
    )
  }
  return unpaidJobs
}

module.exports = { save }

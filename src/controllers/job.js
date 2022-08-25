const { sequelize } = require('../database/connection')
const {
  findUnpaid: findUnpaidJobs,
  findIncludingProfiles,
  payById,
} = require('../database/job')
const {
  substractToBalanceById,
  sumToBalanceById,
} = require('../database/profile')
const DeelError = require('../exceptions/deelError')

/**
 * Finds unpaid jobs, whose status is "in_progress".
 * This process also filters by either ClientId or
 * ContractorId in the contract, based on the user profile type.
 * @return {unpaidJobs}: Returns unpaid jobs for the user. Can be empty
 */
async function findUnpaid(req, res) {
  const { profile } = req
  const unpaidJobs = await findUnpaidJobs(profile)
  res.json(unpaidJobs)
}

/**
 * Pays a specific job, where a client pays to a contractor,
 * changing the column 'paid' in 1, and assigning a payment date to
 * column 'paymentDate'.
 * The client must have balance to pay to the contractor.
 * Having balance the price of the job will be discounted
 * from the client, and the contractor will receive that money.
 * Those three operations are concurrent. If one of them fails,
 * a ROLLBACK will be applied.
 * A client can not pay for a job where he is not related.
 * A job already paid can not be paid again.
 * @param  {job_id} req: Job id to be paid. Required
 * @return {res}: Returns either a good response or an error
 */
async function pay(req, res) {
  const { profile } = req

  const { job_id: jobId } = req.params

  const jobWithProfiles = await findIncludingProfiles(jobId, profile.id)
  validateBeforePaying(jobWithProfiles, profile.id, jobId)

  const jobPrice = jobWithProfiles.price
  const contractor = jobWithProfiles.Contract.Contractor
  await sequelize.transaction(async (t) => {
    await Promise.all([
      payById(jobId, t),
      substractToBalanceById(profile.id, jobPrice, t),
      sumToBalanceById(contractor.id, jobPrice, t),
    ])
  }) // Makes three process concurrently. If some fails, a ROLLBACK will be applied

  res.status(200).end()
}

function validateBeforePaying(jobWithProfiles, clientId, jobId) {
  if (!jobWithProfiles) {
    throw new DeelError(`There's no exist a job with the id: ${jobId}`, 400)
  }

  if (!jobWithProfiles.Contract) {
    throw new DeelError(
      `Client with id: ${clientId} can't pay this job. It doesn't belong to him`,
      400
    )
  }

  if (jobWithProfiles.paid !== null) {
    throw new DeelError(
      `Job with id: ${jobWithProfiles.id} is already paid`,
      400
    )
  }
}

module.exports = { findUnpaid, pay }

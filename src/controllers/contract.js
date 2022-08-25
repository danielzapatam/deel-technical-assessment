const { findByIdAndProfile, findByProfile } = require('../database/contract')

/**
 * Finds contract by id. This process also filters by either ClientId or
 * ContractorId in the contract, based on the user profile type.
 * @param  {id} req: Contract id. Required
 * @return {contract}: Returns the contract. It can be null, because a user
 *      id may differ from a contract id
 */
async function findById(req, res) {
  const { profile } = req
  const { id } = req.params
  const contract = await findByIdAndProfile(id, profile)
  if (!contract) return res.status(404).end()
  res.json(contract)
}

/**
 * Finds all contracts with a status different to terminated.
 * This process also filters by either ClientId or
 * ContractorId in the contract, based on the user profile type.
 * @return {contracts}: Returns an array of contracts. Can be empty
 */
async function findAll(req, res) {
  const { profile } = req
  const contracts = await findByProfile(profile)
  res.json(contracts)
}

module.exports = { findById, findAll }

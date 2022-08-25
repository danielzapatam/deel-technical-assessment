const {
  findHighestPaidProfession: findHighestPaidProfessionInDB,
  findHighestPayingClients: findHighestPayingClientsInDB,
} = require('../database/job')

/**
 * Finds the highest paid profession in a range of dates
 * In case of a tie, the name of the profession will be the second element to order.
 * It just finds for contractors.
 * @param  {start} req: Start date. Required
 * @param  {end} req: End date. Required. Greater or equal than start
 * @return {highestPaidProfession}: Returns just the highest. It there's no results,
 *      {} will be the response
 */
async function findHighestPaidProfession(req, res) {
  const { start, end } = req.query
  const highestPaidProfession = await findHighestPaidProfessionInDB(start, end)
  res.json(highestPaidProfession || {})
}

/**
 * Finds the highest paying clients in a range of dates, with
 * the posibility of returning n results based on limit attribute.
 * In case of a tie, the name of the profession will be the second element to order.
 * It just finds for clients.
 * @param  {start} req: Start date. Required.
 * @param  {end} req: End date. Required. Greater or equal than start
 * @param  {limit} req: N results to return. Optional. Min 1. Default 2.
 * @return {highestPaidProfession}: Returns an array with the highest based on limit parameter.
 *      Can be empty
 */
async function findHighestPayingClients(req, res) {
  const { start, end, limit } = req.query
  const bestClients = await findHighestPayingClientsInDB(start, end, limit)
  res.json(bestClients)
}

module.exports = { findHighestPaidProfession, findHighestPayingClients }

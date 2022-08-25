const Contract = require('../models/contract')
const { Op } = require('sequelize')
const { getProfileQuery } = require('../utilities/commons')

async function findByIdAndProfile(id, profile) {
  return await Contract.findOne({
    where: {
      id,
      ...getProfileQuery(profile),
    },
  })
}

async function findByProfile(profile) {
  return await Contract.findAll({
    where: {
      ...getProfileQuery(profile),
      status: {
        [Op.ne]: 'terminated', // != 'terminated'
      },
    },
  })
}

module.exports = { findByIdAndProfile, findByProfile }

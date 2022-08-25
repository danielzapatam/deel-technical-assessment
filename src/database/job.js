const Job = require('../models/job')
const Contract = require('../models/contract')
const Profile = require('../models/profile')
const { getProfileQuery } = require('../utilities/commons')
const { fn, Op, col, literal } = require('sequelize')
const DeelError = require('../exceptions/deelError')

async function findUnpaid(profile) {
  return await Job.findAll({
    where: {
      paid: null,
    },
    include: [
      {
        model: Contract,
        attributes: [],
        where: {
          ...getProfileQuery(profile),
          status: 'in_progress',
        },
      },
    ],
  })
}

async function findIncludingProfiles(id, clientId) {
  return await Job.findOne({
    attributes: ['id', 'price', 'paid', 'paymentDate'],
    where: {
      id,
    },
    include: [
      {
        model: Contract,
        attributes: ['id'],
        where: {
          ClientId: clientId,
        },
        required: false, // false means: LEFT OUTER JOIN. It is necessary a LEFT JOIN to make validations about the Contract in the controller
        include: [
          {
            model: Profile,
            as: 'Client',
            attributes: ['id', 'balance'],
          },
          {
            model: Profile,
            as: 'Contractor',
            attributes: ['id', 'balance'],
          },
        ],
      },
    ],
  })
}

async function payById(id, transaction) {
  const result = (
    await Job.update(
      {
        paid: 1,
        paymentDate: new Date(),
      },
      {
        where: {
          id,
          paid: null,
        },
        transaction,
      }
    )
  ).shift()
  // The above method returns 0 or 1. 0 means: nothing updated. 1 means: something updated
  // If it is 0 is an error because it must update something

  if (!result) {
    throw new DeelError(
      `The pay for the job with id: ${id} was unsuccessful. It can be due to:
      1. Job with id: ${id} doesn't exist
      2. Job is already payed`,
      400
    )
  }
}

async function getSumOfUnpaidByClientId(clientId) {
  return (
    await Job.findOne({
      attributes: [[fn('SUM', col('price')), 'unpaid']], // SUM(price) AS unpaid
      where: {
        paid: null,
      },
      include: [
        {
          attributes: [],
          model: Contract,
          where: {
            ClientId: clientId,
          },
        },
      ],
      raw: true,
    })
  ).unpaid
}

async function findHighestPaidProfession(start, end) {
  return await Job.findOne({
    attributes: [
      [col('profession'), 'profession'],
      [fn('SUM', col('price')), 'paid'], // SUM(price) AS paid
    ],
    where: {
      paymentDate: {
        [Op.between]: [start, end],
      },
    },
    include: [
      {
        model: Contract,
        attributes: [],
        include: [
          {
            model: Profile,
            as: 'Contractor',
          },
        ],
      },
    ],
    group: 'profession',
    order: [['paid', 'DESC'], 'profession'],
  })
}

async function findHighestPayingClients(start, end, limit) {
  return await Job.findAll({
    attributes: [
      [col('Contract.Client.id'), 'id'],
      [literal("firstName || ' ' || lastName"), 'fullName'],
      [fn('SUM', col('price')), 'paid'], // SUM(price) AS paid
    ],
    where: {
      paymentDate: {
        [Op.between]: [start, end],
      },
    },
    include: [
      {
        model: Contract,
        attributes: [],
        include: [
          {
            model: Profile,
            as: 'Client',
          },
        ],
      },
    ],
    group: 'Contract->Client.id',
    order: [['paid', 'DESC'], 'fullName'],
    limit,
  })
}

module.exports = {
  findUnpaid,
  findIncludingProfiles,
  getSumOfUnpaidByClientId,
  payById,
  findHighestPaidProfession,
  findHighestPayingClients,
}

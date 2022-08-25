const Sequelize = require('sequelize')
const { sequelize } = require('../database/connection')
const Job = require('./job')

class Contract extends Sequelize.Model {}
Contract.init(
  {
    terms: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('new', 'in_progress', 'terminated'),
    },
  },
  {
    sequelize,
    modelName: 'Contract',
    indexes: [
      {
        fields: ['ClientId', 'status'],
      },
      {
        fields: ['ContractorId', 'status'],
      },
    ],
  }
)

Contract.hasMany(Job)
Job.belongsTo(Contract)

module.exports = Contract

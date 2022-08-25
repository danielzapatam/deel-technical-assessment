const Sequelize = require('sequelize')
const { sequelize } = require('../database/connection')

class Deposit extends Sequelize.Model {}
Deposit.init(
  {
    value: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Deposit',
  }
)

module.exports = Deposit

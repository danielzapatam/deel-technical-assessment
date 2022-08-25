const Sequelize = require('sequelize')
const { sequelize } = require('../database/connection')
const Contract = require('./contract')
const Deposit = require('./deposit')

class Profile extends Sequelize.Model {}
Profile.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profession: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    balance: {
      type: Sequelize.DECIMAL(12, 2),
    },
    type: {
      type: Sequelize.ENUM('client', 'contractor', 'admin'),
    },
  },
  {
    sequelize,
    modelName: 'Profile',
  }
)

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' })
Contract.belongsTo(Profile, { as: 'Contractor' })
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' })
Contract.belongsTo(Profile, { as: 'Client' })

Profile.hasMany(Deposit, { as: 'Sender', foreignKey: 'SenderId' })
Deposit.belongsTo(Profile, { as: 'Sender' })
Profile.hasMany(Deposit, { as: 'Receiver', foreignKey: 'ReceiverId' })
Deposit.belongsTo(Profile, { as: 'Receiver' })

module.exports = Profile

const { seed: initDatabase } = require('./mocks/database/seedDb')

module.exports = async () => {
  process.env.TZ = 'UTC'
  await initDatabase()
}

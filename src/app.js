require('express-async-errors')
const express = require('express')
const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin')
const contractRoutes = require('./routes/contract')
const jobRoutes = require('./routes/job')
const balanceRoutes = require('./routes/balance')
const errorsHandlerMiddleware = require('./middlewares/errorsHandler')

const app = express()

// Middlewares before processing
app.use(bodyParser.json())

// Routes
app.use('/admin', adminRoutes)
app.use('/contracts', contractRoutes)
app.use('/jobs', jobRoutes)
app.use('/balance', balanceRoutes)
app.use('/*', (req, res) => {
  res
    .status(404)
    .json({ message: 'Mmmmmmm. Are you lost? This road leads nowhere!' })
})

// Middlewares after processing
app.use(errorsHandlerMiddleware)

init()
async function init() {
  try {
    process.env.TZ = 'UTC' // Setting timezone to UTC-0

    app.listen(3001, () => {
      console.log('Express App Listening on Port 3001')
    })
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`)
    process.exit(1)
  }
}

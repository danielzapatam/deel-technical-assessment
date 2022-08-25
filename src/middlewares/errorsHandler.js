const errorsHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Something went wrong. Try again later'

  res.status(statusCode).json({ message })
}

module.exports = errorsHandlerMiddleware

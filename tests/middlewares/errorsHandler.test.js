const errorsHandler = require('../../src/middlewares/errorsHandler')
const { createRequest, createResponse } = require('node-mocks-http')

describe('Middleware errorsHandler tests', () => {
  test('Having statusCode and message', () => {
    const req = createRequest()
    const res = createResponse()
    const error = {
      statusCode: 100,
      message: 'invented',
    }

    errorsHandler(error, req, res)
    const resultantMessage = JSON.parse(res._getData())

    expect(res.statusCode).toEqual(100)
    expect(resultantMessage).toEqual({ message: 'invented' })
  })

  test('Without undefined statusCode and message', () => {
    const req = createRequest()
    const res = createResponse()

    errorsHandler({}, req, res)
    const resultantMessage = JSON.parse(res._getData())

    expect(res.statusCode).toEqual(500)
    expect(resultantMessage).toEqual({
      message: 'Something went wrong. Try again later',
    })
  })
})

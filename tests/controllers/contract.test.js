const contract = require('../../src/controllers/contract')
const { createRequest, createResponse } = require('node-mocks-http')

describe('findById tests', () => {
  test('Unexistent contract id', async () => {
    const req = createRequest({
      profile: {
        id: 1,
      },
      params: {
        id: -1,
      },
    })
    const res = createResponse()

    await contract.findById(req, res)

    expect(res.statusCode).toEqual(404)
    expect(res._getData()).toEqual('')
  })

  test('Existent contract id for the profile id', async () => {
    const req = createRequest({
      profile: {
        id: 1,
        type: 'client',
      },
      params: {
        id: 1,
      },
    })
    const res = createResponse()

    await contract.findById(req, res)
    const expectedResult = {
      id: 1,
      status: 'terminated',
    }
    const { id, status } = JSON.parse(res._getData())
    const responseResult = {
      id,
      status,
    }

    expect(res.statusCode).toEqual(200)
    expect(responseResult).toEqual(expectedResult)
  })

  test('Existent contract id, but unexistent for profile id', async () => {
    const req = createRequest({
      profile: {
        id: 2,
        type: 'client',
      },
      params: {
        id: 1,
      },
    })
    const res = createResponse()

    await contract.findById(req, res)
    const expectedResult = {
      id: 1,
      status: 'terminated',
    }

    expect(res.statusCode).toEqual(404)
    expect(res._getData()).toEqual('')
  })
})

describe('findAll tests', () => {
  test('Array with contracts -> Test 1', async () => {
    const req = createRequest({
      profile: {
        id: 1,
        type: 'client',
      },
    })
    const res = createResponse()

    await contract.findAll(req, res)
    const contractsLength = JSON.parse(res._getData()).length

    expect(res.statusCode).toEqual(200)
    expect(contractsLength).toEqual(1)
  })

  test('Array with contracts -> Test 2', async () => {
    const req = createRequest({
      profile: {
        id: 4,
        type: 'client',
      },
    })
    const res = createResponse()

    await contract.findAll(req, res)
    const contractsLength = JSON.parse(res._getData()).length

    expect(res.statusCode).toEqual(200)
    expect(contractsLength).toEqual(3)
  })

  test('Array empty due to unexistent contracts', async () => {
    const req = createRequest({
      profile: {
        id: 10,
        type: 'client',
      },
    })
    const res = createResponse()

    await contract.findAll(req, res)
    const contractsLength = JSON.parse(res._getData()).length

    expect(res.statusCode).toEqual(200)
    expect(contractsLength).toEqual(0)
  })
})

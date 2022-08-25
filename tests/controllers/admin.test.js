const admin = require('../../src/controllers/admin')
const { createRequest, createResponse } = require('node-mocks-http')

describe('findHighestPaidProfession tests', () => {
  test('Sucessful operation -> Test 1', async () => {
    const req = createRequest({
      query: {
        start: '2000-01-01',
        end: '2030-12-31',
      },
    })
    const res = createResponse()

    await admin.findHighestPaidProfession(req, res)
    const results = JSON.parse(res._getData())

    expect(res.statusCode).toEqual(200)
    expect(results).toEqual({
      profession: 'Programmer',
      paid: 2683,
    })
  })

  test('Sucessful operation -> Test 2', async () => {
    const req = createRequest({
      query: {
        start: '2020-08-10T19:11:26.737',
        end: '2020-08-13T19:11:26.736',
      },
    })
    const res = createResponse()

    await admin.findHighestPaidProfession(req, res)
    const results = JSON.parse(res._getData())

    expect(res.statusCode).toEqual(200)
    expect(results).toEqual({
      profession: 'Musician',
      paid: 21,
    })
  })

  test('Sucessful operation: in case of a tie', async () => {
    const req = createRequest({
      query: {
        start: '2020-08-16T19:11:26.737',
        end: '2020-08-18T19:11:26.736',
      },
    })
    const res = createResponse()

    await admin.findHighestPaidProfession(req, res)
    const results = JSON.parse(res._getData())

    expect(res.statusCode).toEqual(200)
    expect(results).toEqual({
      profession: 'Fighter',
      paid: 200,
    })
  })

  test('Sucessful operation: no results', async () => {
    const req = createRequest({
      query: {
        start: '2025-08-16T19:11:26.737',
        end: '2030-08-18T19:11:26.736',
      },
    })
    const res = createResponse()

    await admin.findHighestPaidProfession(req, res)
    const results = JSON.parse(res._getData())

    expect(res.statusCode).toEqual(200)
    expect(results).toEqual({})
  })
})

describe('findHighestPayingClients tests', () => {
  test('Sucessful operation -> Test 1', async () => {
    const req = createRequest({
      query: {
        start: '2000-01-01',
        end: '2020-12-31',
        limit: 4,
      },
    })
    const res = createResponse()

    await admin.findHighestPayingClients(req, res)
    const results = JSON.parse(res._getData())

    expect(res.statusCode).toEqual(200)
    expect(results).toEqual([
      {
        id: 4,
        fullName: 'Ash Kethcum',
        paid: 2020,
      },
      {
        id: 1,
        fullName: 'Harry Potter',
        paid: 442,
      },
      {
        id: 2,
        fullName: 'Mr Robot',
        paid: 442,
      },
      {
        id: 3,
        fullName: 'John Snow',
        paid: 200,
      },
    ])
  })

  test('Sucessful operation -> Test 2', async () => {
    const req = createRequest({
      query: {
        start: '2020-08-17',
        end: '2020-08-17 23:59:59',
        limit: 1,
      },
    })
    const res = createResponse()

    await admin.findHighestPayingClients(req, res)
    const results = JSON.parse(res._getData())

    expect(res.statusCode).toEqual(200)
    expect(results).toEqual([
      {
        id: 1,
        fullName: 'Harry Potter',
        paid: 200,
      },
    ])
  })

  test('Sucessful operation: in a case of tie', async () => {
    const req = createRequest({
      query: {
        start: '2020-08-16T19:11:26.737',
        end: '2020-08-17T19:11:26.737',
        limit: 4,
      },
    })
    const res = createResponse()

    await admin.findHighestPayingClients(req, res)
    const results = JSON.parse(res._getData())

    expect(res.statusCode).toEqual(200)
    expect(results).toEqual([
      {
        id: 1,
        fullName: 'Harry Potter',
        paid: 200,
      },
      {
        id: 3,
        fullName: 'John Snow',
        paid: 200,
      },
      {
        id: 2,
        fullName: 'Mr Robot',
        paid: 200,
      },
    ])
  })

  test('Sucessful operation: no results', async () => {
    const req = createRequest({
      query: {
        start: '2030-08-17',
        end: '2040-08-17 23:59:59',
        limit: 1,
      },
    })
    const res = createResponse()

    await admin.findHighestPayingClients(req, res)
    const results = JSON.parse(res._getData())

    expect(res.statusCode).toEqual(200)
    expect(results).toEqual([])
  })
})

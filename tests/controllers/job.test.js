const Profile = require('../../src/models/profile')
const Job = require('../../src/models/job')
const job = require('../../src/controllers/job')
const { createRequest, createResponse } = require('node-mocks-http')

describe('findUnpaid tests', () => {
  test('Array with data -> Test 1', async () => {
    const req = createRequest({
      profile: {
        id: 1,
        type: 'client',
      },
    })
    const res = createResponse()

    await job.findUnpaid(req, res)
    const resultsLength = JSON.parse(res._getData()).length

    expect(res.statusCode).toEqual(200)
    expect(resultsLength).toEqual(1)
  })

  test('Array with data -> Test 2', async () => {
    const req = createRequest({
      profile: {
        id: 2,
        type: 'client',
      },
    })
    const res = createResponse()

    await job.findUnpaid(req, res)
    const resultsLength = JSON.parse(res._getData()).length

    expect(res.statusCode).toEqual(200)
    expect(resultsLength).toEqual(2)
  })

  test('Empty array', async () => {
    const req = createRequest({
      profile: {
        id: 3,
        type: 'client',
      },
    })
    const res = createResponse()

    await job.findUnpaid(req, res)
    const resultsLength = JSON.parse(res._getData()).length

    expect(res.statusCode).toEqual(200)
    expect(resultsLength).toEqual(0)
  })
})

describe('validateBeforePaying tests', () => {
  test('Null jobAndProfiles', async () => {
    const validateBeforePaying = job.__get__('validateBeforePaying')

    expect(() => validateBeforePaying(null, null, 1)).toThrow(
      new Error("There's no exist a job with the id: 1")
    )
  })

  test('Unexistent contract object in jobAndProfiles', async () => {
    const validateBeforePaying = job.__get__('validateBeforePaying')

    const jobWithProfiles = {}
    expect(() => validateBeforePaying(jobWithProfiles, 2)).toThrow(
      new Error(
        "Client with id: 2 can't pay this job. It doesn't belong to him"
      )
    )
  })

  test('Paid attribute different to null in jobAndProfiles', async () => {
    const validateBeforePaying = job.__get__('validateBeforePaying')

    const jobWithProfiles = {
      id: 3,
      Contract: {},
      paid: 'NotNull',
    }
    expect(() => validateBeforePaying(jobWithProfiles, 2)).toThrow(
      new Error('Job with id: 3 is already paid')
    )
  })
})

describe('pay tests', () => {
  test('Successful pay', async () => {
    const req = createRequest({
      profile: {
        id: 1,
        type: 'client',
      },
      params: {
        job_id: 1,
      },
    })
    const res = createResponse()

    await job.pay(req, res)

    expect(res.statusCode).toEqual(200)

    const payResult = await Job.findOne({
      where: {
        id: req.params.job_id,
      },
    })
    expect(payResult.paid).not.toEqual(null)

    const clientProfileResult = await Profile.findOne({
      where: {
        id: 1,
      },
    })
    expect(clientProfileResult.balance).toEqual(950)

    const contractorProfileResult = await Profile.findOne({
      where: {
        id: 5,
      },
    })
    expect(contractorProfileResult.balance).toEqual(264)
  })

  test("Client doesn't have balance to pay to contractor", async () => {
    const req = createRequest({
      profile: {
        id: 4,
        type: 'client',
      },
      params: {
        job_id: 5,
      },
    })
    const res = createResponse()

    try {
      await job.pay(req, res)
    } catch (error) {}

    const payResult = await Job.findOne({
      where: {
        id: req.params.job_id,
      },
    })
    expect(payResult.paid).toEqual(null)

    const clientProfileResult = await Profile.findOne({
      where: {
        id: 4,
      },
    })
    expect(clientProfileResult.balance).toEqual(1.3)

    const contractorProfileResult = await Profile.findOne({
      where: {
        id: 7,
      },
    })
    expect(contractorProfileResult.balance).toEqual(22)
  })
})

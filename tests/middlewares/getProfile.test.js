const { getProfile } = require('../../src/middlewares/getProfile')
const Profile = require('../../src/models/profile')
const { createRequest, createResponse } = require('node-mocks-http')

describe('Middleware getProfile tests', () => {
  test("profile_id wasn't sent in headers", async () => {
    const req = createRequest()
    const res = createResponse()

    await getProfile()(req, res)

    expect(res.statusCode).toEqual(401)
    expect(req.profile).toEqual(undefined)
  })

  test('Unexistent profile_id in Profile', async () => {
    const req = createRequest({
      headers: {
        profile_id: -1,
      },
    })
    const res = createResponse()

    await getProfile()(req, res)

    expect(res.statusCode).toEqual(401)
    expect(req.profile).toEqual(undefined)
  })

  test('Existent profile_id in Profile', async () => {
    const profileId = 1
    const req = createRequest({
      headers: {
        profile_id: profileId,
      },
    })
    const res = createResponse()
    const next = jest.fn()

    await getProfile()(req, res, next)
    const expectedProfile = await Profile.findOne({
      where: {
        id: profileId,
      },
    })

    expect(res.statusCode).toEqual(200)
    expect(req.profile).toEqual(expectedProfile)
  })

  test('Unsuccessful profile type validation', async () => {
    const profileId = 1
    const req = createRequest({
      headers: {
        profile_id: profileId,
      },
    })
    const res = createResponse()
    const next = jest.fn()

    await getProfile('contractor')(req, res, next)

    expect(res.statusCode).toEqual(401)
    expect(req.profile).toEqual(undefined)
  })

  test('Successful profile type validation', async () => {
    const profileId = 1
    const req = createRequest({
      headers: {
        profile_id: profileId,
      },
    })
    const res = createResponse()
    const next = jest.fn()

    await getProfile('client')(req, res, next)
    const expectedProfile = await Profile.findOne({
      where: {
        id: profileId,
      },
    })

    expect(res.statusCode).toEqual(200)
    expect(req.profile).toEqual(expectedProfile)
  })
})

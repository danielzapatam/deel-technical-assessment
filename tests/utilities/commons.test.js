const { getProfileQuery } = require('../../src/utilities/commons')

describe('Commons tests', () => {
  test('getProfileQuery returning query for client', () => {
    const profile = { id: 1, type: 'client' }
    const query = getProfileQuery(profile)
    expect(query).toEqual({ ClientId: 1 })
  })

  test('getProfileQuery returning query for contractor', () => {
    const profile = { id: 1, type: 'contractor' }
    const query = getProfileQuery(profile)
    expect(query).toEqual({ ContractorId: 1 })
  })
})

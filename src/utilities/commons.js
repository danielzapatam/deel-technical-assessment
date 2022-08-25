const getProfileQuery = ({ id, type }) =>
  type === 'client' ? { ClientId: id } : { ContractorId: id }

module.exports = { getProfileQuery }

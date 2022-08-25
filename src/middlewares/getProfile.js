const { findById } = require('../database/profile')

const getProfile = (validateAs) => async (req, res, next) => {
  const profileId = req.get('profile_id')
  if (!profileId) return res.status(401).end()

  const profile = await findById(profileId)
  if (!profile || (validateAs && profile.type !== validateAs)) {
    return res.status(401).end()
  }

  req.profile = profile
  next()
}

module.exports = { getProfile }

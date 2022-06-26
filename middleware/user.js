const User = require('../models/user')

module.exports = async function (req, res, next) {
  if (!req.session.user) {
    return next()
  }
    const user = await User.findById(req.session.user)
    req.user = user
    next()
}


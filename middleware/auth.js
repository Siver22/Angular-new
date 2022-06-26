const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = process.env;

module.exports = async (req, res, next) => {
  try {
    const token = await req.headers.authorization;
    const decoded = jwt.verify(token, config.SECRET_TOKEN)
    const user = await User.findById(decoded.user)
    req.user = user;
    next();
  }
  catch (error) {
    console.log('auth failed: ' + error.message)
    return res.status(401).json({
      message: "Auth failed, token not valid",
    });
  }
};
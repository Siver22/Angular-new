const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = process.env;

module.exports = async (req, res, next) => {
  console.log("token auth", req.headers.authorization)
  try {
    const token = await req.headers.authorization;
    console.log('auth token',token)
    const decoded = jwt.verify(token, config.SECRET_TOKEN)
    console.log('decoded token', decoded);
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
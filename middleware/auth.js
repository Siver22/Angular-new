const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const token = await req.headers.authorization;
    console.log("auth token", token);
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const user = await User.findById(decoded.user);
    req.user = user;
    next();
  }
  catch (error) {
    console.log('auth failed: ' + error.message);
    return res.status(401).json({
      message: "Auth failed, token not valid",
    });
  }
};
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const token = await req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN)
    const user = await User.findById(decoded.user)
    if(user.Role === 'Admin'){
      req.user = user;
    } else {
      console.log('Role Not Found')
      req.user = undefined;
    }
    next();
  }
  catch (error) {
    console.log('Access Denied: ' + error.message)
    return res.status(401).json({
      message: "Not Admin User" 
    });
  }
};
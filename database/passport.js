const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const token = require('../middleware/auth')

//user module
const User = require('../models/user')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      //Match user
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, console.log('That email is not register'), { message: 'That email is not register' })
          }
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              //Token
              const newtoken = jwt.sign({
                usernameField: user.email,
                role: user.Role
              },token.secret,{expiresIn: '1h'})
              const user = {
                user: user,
                token: newtoken
              }
              return done(null, user)
            } else {
              done(null, false, console.log('Password incorrect'), { message: 'Password incorrect' })
            }
          })
          console.log(user)
        })
    })
  )
  // Serialize and deserialize
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
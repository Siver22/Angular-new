const { Router } = require('express')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = Router()


router.get('/logout', passport.authenticate('local'), async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie()
    res.redirect('/')
  })
})

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body
    const candidate = await User.findOne({ email: email })
    if (!candidate) {
      return (new Error('Email does not exist'));
    }
    const areSame = await bcrypt.compare(password, candidate.password)
    if (!areSame) {
      return (new Error('Password is not correct'));
    } else {
      req.session.user = candidate
      req.session.isAuthenticated = true
      req.session.save(err => {
        if (err) {
          console.error("session err" + err)
        } else {
          const accessToken = jwt.sign(
            {user: candidate._id, Role: candidate.Role },
            process.env.SECRET_TOKEN,
            { expiresIn: '2h' })
          passport.authenticate('local', {
            successRedirect: '/profile',
            failureRedirect: '/',
            failureFlash: true
          }),
          res.cookie('token', accessToken,{ httpOnly: true , secure:true})
          res.json({ candidate, accessToken })
        }
      })
    }
  } catch (e) {
    console.log("Login ERROR" + e)
  }

})



module.exports = router;
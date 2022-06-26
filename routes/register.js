const { Router } = require('express')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = Router()


router.post('/', async (req, res) => {
  try {
    const { Role, IdNumber, address, addressOption, fname, lname, email, password, phoneNumber, img } = req.body
    const candidate = await User.findOne({ email })

    if (candidate) {
      return res.status(409).send('User Already Exist. Please Login')
    } else {
      const hashPass = await bcrypt.hash(password, 6)
      const user = await new User({
        Role,
        IdNumber,
        address,
        addressOption,
        fname,
        lname,
        email: email.toLowerCase(),
        password: hashPass,
        repassword: req.body.repassword, hashPass,
        phoneNumber,
        img,
        cart: { items: [] }
      })
      const token = jwt.sign(
        { user: user._id, Role: user.Role }, process.env.SECRET_TOKEN, { expiresIn: '2h' })
      user.token = token
      await user.save()
      req.session.user = candidate
      req.session.isAuthenticated = true
      req.session.save(err => {
        if (err) {
          throw err
        } else {
          res.status(200).json({
            user, token
          })
        }
      })
      res.cookie('token', token, { httpOnly: true })
    }
  } catch (err) {
    console.log(err)
  }
})


module.exports = router;
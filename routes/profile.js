const { Router } = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, async (req, res) => {
  const user = await User.find(req.user)
  res.json(user)
  // res.render('profile', { title: 'Profile', user })
})

router.post('/edit', auth, async (req, res) => {
  console.log(req.body.IdNumber)
  User.updateOne({
    'email': req.body.email,
  },
    {
      'IdNumber': req.body.IdNumber,
      'fname': req.body.fname,
      'lname': req.body.lname,
      'email': req.body.email,
      'phoneNumber': req.body.phoneNumber,
      'address': req.body.address,
      'addressOption': req.body.addressOption,
      'img': req.body.img
    },
    (err,usr)=>{
      if (err) {console.log(err)}
      else {console.log(usr)}
    })
  // res.json({ success: true })
})

router.get('/remove/:id', auth, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id)
    req.session.destroy()
    res.clearCookie()
    res.json({ success: true })
  } catch (err) {
    console.log("error delete" + err)
  }
})

module.exports = router;
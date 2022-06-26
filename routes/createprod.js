const { Router } = require('express')
const Product = require('../models/createprod')
const admin = require('../middleware/admin')
const router = Router()

router.get('/',admin, async (req, res) => {
  const prod = await Product.find()
  res.json(prod)
})

router.post('/',admin, async (req, res) => {
  const user = req.user
  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    units: req.body.units,
    img: req.body.img,
    userId: user._id
  })
  try {
    await product.save()
    res.redirect('/products')
  } catch (err) {
    console.log('ERROR saving product' + err)
  }
})

module.exports = router
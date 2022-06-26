const { Router } = require('express')
const Product = require('../models/createprod')
const admin = require('../middleware/admin')
const router = Router()

router.get('/', async  (req, res) => {
  const product = await Product.find()
  res.json(product)
  // JSON.stringify(product)
  // res.render('products', {
  //   title: 'Menu',
  //   product
  // })
})

router.post('/edit',admin, async (req, res) => {
  console.log(req.body.title)
  Product.updateOne({
    'title': req.body.title,
  },
    {
      'title': req.body.title,
      'description': req.body.description,
      'price': req.body.price,
      'units': req.body.units,
      'img': req.body.img
    },
    (err,usr)=>{
      if (err) {console.log(err)}
      else {console.log(usr)}
    })
})

router.delete('/remove/:id',admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  res.json(product)
  // res.render('Product', { layout: 'empty', product })
})


module.exports = router
const { Router } = require('express')
const Order = require('../models/order')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id })
      .populate('user.userId')
    res.json(orders.map(o => {
        return {
          ...o._doc,
          price: o.products.reduce((total, p) => {
            return total += p.count * p.product.price
          }, 0)
        }
      })
    )
  } catch (err) {
    console.log('Order' + err)
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.itemId')
    const products = user.cart.items.map(i => ({
      count: i.count,
      product: { ...i.itemId._doc }
    }))
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      products: products
    })
    await order.save()
    await req.user.clearCart()
    res.redirect('/orders')
  } catch (err) {
    console.log('order post' + err)
  }
})


module.exports = router
const { Schema, model, SchemaTypes } = require('mongoose')

const Users = new Schema({
  Role: {
    type: String,
    default: 'Customer',
    enum: ['Customer', 'Admin']
  },
  IdNumber: {
    type: Number,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  addressOption: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  repassword: {
    type: String,
    required: true

  },
  img: {
    type: String,
  },
  token: {
    type: String
  },
  cart: {
    items: [{
      count: {
        type: Number,
        required: true,
        default: 1
      },
      itemId: {
        type: SchemaTypes.ObjectId,
        ref: 'Product'
      }
    }]
  }
})

Users.methods.addToCart = function (product) {
  const items = [...this.cart.items]
  const idx = items.findIndex(p => {
    return p.itemId === product._id
  })
  if (idx >= 0) {
    items[idx].count = items[idx].count + 1
  } else {
    items.push({
      itemId: product._id,
      count: 1
    })
  }
  this.cart = { items }
  return this.save()
}

Users.methods.removeFromCart = function (id) {
  let items = [...this.cart.items]
  const idx = items.findIndex(p => p.itemId.toString() === id.toString())
  if (items[idx].count === 1) {
    items = items.filter(p => p.itemId.toString() !== id.toString())
  } else {
    items[idx].count--
  }
  this.cart = { items }
  return this.save()
}

Users.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}

module.exports = model('Users', Users)

const { Schema, model } = require('mongoose')

const Product = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  units: {
    type: Number,
    required: true
  },
  img: {
    type: String
  },
  userId: {
    type: String,
  }
})

Product.method('toClient', function () {
  const product = this.toObject();
  product.id = product._id
  console.log("to client"+product.id)
  delete product._id
  return product
})

module.exports = model('Product', Product)
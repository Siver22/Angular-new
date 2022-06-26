const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
  products: [{
    product: { type: Object },
    count: { type: Number }
  }],
  user: {
    name: String,
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true }
  },
  date: { type: Date, default: Date.now }
})

module.exports = model('Order', orderSchema)
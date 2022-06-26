require('../models/user')
const express = require('express')
const mongo = express()
const mongoose = require('mongoose')
// const { MONGO_URI } = process.env

MONGO_URI='mongodb://127.0.0.1:27017/Aquafish'

async function startData() {
  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Mongodb Connected Successfully')
  } catch (err) {
    console.log('Error in Db connection' + err)
  }
}
startData()


module.exports = mongo;

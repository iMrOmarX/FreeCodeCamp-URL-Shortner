const mongoose = require("mongoose")
const validator = require("validator")

const urlSchema = new mongoose.Schema({
  original_url : {
    type: String,
    validate(value) {
      if(!validator.isURL(value)) {
        throw new Error("invalid url")
      }
    },
    required : true
  }, 
  short_url : {
    type: Number,
    unique: true
  }
})

const url = mongoose.model('Url' , urlSchema)

module.exports = url
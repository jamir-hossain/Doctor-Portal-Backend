const mongoose = require('mongoose');

const prescription = new mongoose.Schema({
   medicine: {
      type: String,
      required: [true, "Medicine Name is required"],
   },
   rules: {
      type: String,
      required: [true, "Medicine Rules Phone is required"]
   },
   days: {
      type: Number,
      required: [true, "Day is required"],
   },
   id: {
      type:String
   }
}, {timestamps:true})

const Prescription = mongoose.model("Prescription", prescription)
module.exports = Prescription
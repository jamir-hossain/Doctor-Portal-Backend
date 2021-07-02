const mongoose = require('mongoose');

const doctor = new mongoose.Schema({
   username: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true
   },
   gender: {
      type: String,
      required: true
   },
   degree: {
      type: String,
      required: true
   },
   specialist: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   profilePic: {
      type: String,
      default: ''
   },
   role: {type: String}
}, {timestamps:true})


const DoctorData = mongoose.model("Doctor", doctor)
module.exports = DoctorData
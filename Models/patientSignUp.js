const mongoose = require('mongoose');

const patient = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
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
   role: { type: String }
}, { timestamps: true })


const PatientData = mongoose.model("Patients", patient)
module.exports = PatientData
const mongoose = require('mongoose');

const bookAppointment = new mongoose.Schema({
   patientName: {type: String},
   phone: {type: Number},
   email: {type: String},
   gender: {type: String},
   age: {type: Number},
   weight: {type: Number},
   appointmentStatus: {type: String},
   appointment:{
      bookingDate: {type: String},
      visitingHour: {type: String},
      subject: {type: String},
      category: {type: String}
   },
   prescription:[{
      medicine: {type: String},
      rules: {type: String},
      days: {type: Number}
   }]
}, 

{timestamps: true}
);

const AppointmentData = mongoose.model("AppointmentData", bookAppointment);
module.exports = AppointmentData
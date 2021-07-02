const {Schema, model} = require('mongoose');

const bookAppointment = new Schema({
   selectedDoctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
   },
   userId: {type: String},
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
   },
   prescription:[{
      medicine: {type: String},
      rules: {type: String},
      days: {type: Number}
   }]
}, 
{timestamps: true}
);

const AppointmentData = model("AppointmentData", bookAppointment);
module.exports = AppointmentData
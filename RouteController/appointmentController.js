const AppointmentData = require('../Models/bookAppointment')


// make appointment
exports.makeAppointment = async (req, res) => {
   const {selectedDoctor, patientName, phone, email, gender, age, weight, appointmentStatus, appointment, prescription} = req.body
   try {
      const savedAppointment = new AppointmentData({
         selectedDoctor,
         userId: req.user.user_id,
         patientName,
         phone,
         email,
         gender,
         age,
         weight,
         appointmentStatus,
         appointment,
         prescription
      })
      await savedAppointment.save()
      res.send({success: "Appointment successfully submitted", savedAppointment})
   } catch (error) {
      res.send({error: 'Internal Server Error, please try again'})
   }
}

// get appointed patient of doctor
exports.getDoctorAppointment = async (req, res) => {
   try {
      const doctorAppointments = await AppointmentData.find({selectedDoctor: req.user.user_id})
      res.send(doctorAppointments)
   } catch (error) {
      res.send({error: 'Internal Server Error, please try again'})
   }
}

// get patient appointment list
exports.getPatientAppointment = async (req, res) => {
   try {
      const patientAppointments = await AppointmentData.find({userId: req.user.user_id}).populate({
         path: 'selectedDoctor',
         select: 'username gender degree specialist profilePic'
      })
      res.send(patientAppointments)
   } catch (error) {
      res.send({error: 'Internal Server Error, please try again'})
   }
}

// Post Prescription Data on Database
exports.addPrescription = async (req, res) => {
   const {prescription, patientId} = req.body
   try {
      const prescriptionData = await AppointmentData.findByIdAndUpdate({_id:patientId}, {
         $push:{prescription:prescription}
      }, {new:true}
      )
      res.send(prescriptionData)
   } catch (error) {
      res.send({error: 'Internal Server Error, please try again'})
   }
}

// update appointment status
exports.updateStatus = async (req, res) => {
   const {status, patientId} = req.body
   try {
      const updatedStatus = await AppointmentData.findByIdAndUpdate({_id:patientId}, 
      {
         $set: {appointmentStatus:status}
      }, {new:true}
      )
      res.send(updatedStatus)
   } catch (error) {
      res.send({error: 'Internal Server Error, please try again'})
   }
}
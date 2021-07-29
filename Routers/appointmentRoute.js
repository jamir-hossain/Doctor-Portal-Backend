const express = require('express')
const router = express.Router()

const checkSignInUser = require('../Middleware/authMiddleware')
const {
   updateStatus,
   addPrescription,
   makeAppointment,
   getDoctorAppointment,
   getPatientAppointment,
} = require('../RouteController/appointmentController')

// Add an Appointment Data
router.post('/make/appointment', checkSignInUser, makeAppointment)

// get appointed patient of doctor
router.get('/get/doctor/appointment', checkSignInUser, getDoctorAppointment)

// get patient appointment list
router.get('/get/patient/appointment', checkSignInUser, getPatientAppointment)

// Post Prescription Data on Database
router.put('/add-prescription', checkSignInUser, addPrescription)

// Post Prescription Data on Database
router.put('/add-status', checkSignInUser, updateStatus)

// root route
router.get('/', (req, res) => {
   res.send("Welcome to node app")
})


module.exports = router
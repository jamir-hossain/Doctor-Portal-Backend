const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

app.use(express.json())
app.use(cors())

// Connecting Database with our server
const {DBConnection} = require('./Database/dbConnection')
DBConnection()

// Appointment Route
const appointmentRoute = require('./Routers/appointmentRoute')
app.use('/', appointmentRoute)


// Patient Prescription Schema Data 
const Prescription = require('./Models/prescription')

// Get Prescription Data
app.get('/prescription', async(req, res) => {
   try {
      const prescriptionData = await Prescription.find()
      res.send(prescriptionData)
   } catch (error) {
      res.status(500).send(error.message)
   }
})


const PORT = process.env.PORT || 3005;
app.listen( PORT, () => console.log(`Server is running on PORT ${PORT}`))
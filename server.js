const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()

app.use(express.json())
app.use(cors())
dotenv.config()

// Connecting Database with our server
const {DBConnection} = require('./Database/dbConnection')
DBConnection()

// Appointment Route
const appointmentRoute = require('./Routers/appointmentRoute')
app.use('/', appointmentRoute)

// User Authentication Route
const authRoute = require('./Routers/authRoute')
app.use('/', authRoute)

// User Profile Route
const profileRoute = require('./Routers/profileRoute')
app.use('/', profileRoute)


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
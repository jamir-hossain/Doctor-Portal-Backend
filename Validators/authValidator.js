const { check } = require('express-validator');
const PatientData = require('../Models/patientSignUp')
const DoctorData = require('../Models/doctorSignUp')

// signup validator
exports.doctorSignupValidator = [
   check('name')
      .notEmpty().withMessage('Please provide your name.')
   ,
   check('email')
      .notEmpty().withMessage('Please provide an email.')
      .isEmail().withMessage('Please provide a valid email.')
      .custom(async (email) => {
         const user = await DoctorData.findOne({ email })
         if (user) {
            throw new Error('Email is already used by another account')
         } else {
            return true
         }
      })
   ,
   check('gender')
      .notEmpty().withMessage('Please your select gender')
   ,
   check('degree')
      .notEmpty().withMessage('Please Provide Your Education Degree')
      .isLength({ max: 250 }).withMessage('Degree Length Must Be Below 100 characters')
   ,
   check('specialist')
      .notEmpty().withMessage('Please your select specialist')
   ,
   check('password')
      .notEmpty().withMessage('Please provide your password.')
      .custom((password) => {
         if (password.length < 4 || password.length > 8) {
            throw new Error('Password must be between 4 tp 8 characters')
         } else {
            return true
         }
      })
   ,
   check('confirmPassword')
      .notEmpty().withMessage('Please provide your confirm password.')
      .custom((confirm_password, { req }) => {
         if (confirm_password !== req.body.password) {
            throw new Error('Confirm password is not match')
         } else {
            return true
         }
      })
]


// signup validator
exports.patientSignupValidator = [
   check('name')
      .notEmpty().withMessage('Please provide your name.')
   ,
   check('email')
      .notEmpty().withMessage('Please provide an email.')
      .isEmail().withMessage('Please provide a valid email.')
      .custom(async (email) => {
         const user = await PatientData.findOne({ email })
         if (user) {
            throw new Error('Email is already used by another account')
         } else {
            return true
         }
      })
   ,
   check('password')
      .notEmpty().withMessage('Please provide your password.')
      .custom((password) => {
         if (password.length < 4 || password.length > 8) {
            throw new Error('Password must be between 4 to 8 characters')
         } else {
            return true
         }
      })
   ,
   check('confirmPassword')
      .notEmpty().withMessage('Please provide your confirm password.')
      .custom((confirm_password, { req }) => {
         if (confirm_password !== req.body.password) {
            throw new Error('Confirm password is not match')
         } else {
            return true
         }
      })
]

// sign in validator
exports.signinValidator = [
   check('email')
      .notEmpty().withMessage('Please provide an email.')
      .isEmail().withMessage('Please provide a valid email.')
      .custom(async (email) => {
         const user = await PatientData.findOne({ email })
         if (!user) {
            throw new Error('User not found, please try again.')
         } else {
            return true
         }
      })
   ,
   check('password')
      .notEmpty().withMessage('Please provide your password.')
   ,
]
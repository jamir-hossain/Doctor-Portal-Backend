const express = require('express')
const router = express.Router()

const {googleFacebookSignIn, patientSignUp, doctorSignUp, accountActivation, userSignIn} = require('../RouteController/authRouteController')
const {doctorSignupValidator, patientSignupValidator} = require('../Validators/authValidator')

router.post('/google/facebook/signin', googleFacebookSignIn)
router.post('/patient/signup', patientSignupValidator, patientSignUp)
router.post('/doctor/signup', doctorSignupValidator, doctorSignUp)
router.post('/account/activation', accountActivation)
router.post('/user/signin', userSignIn)


module.exports = router
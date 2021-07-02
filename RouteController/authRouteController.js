const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAIL_KEY);
const admin = require("firebase-admin");
const serviceAccount = require("../doctor-garden1-firebase-adminsdk-1x5xy-be52359f26.json");
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)
});


const UserProfilePic = require('../Models/userProfilePic')
const PatientData = require('../Models/patientSignUp')
const DoctorData = require('../Models/doctorSignUp')

// Sing in with Google
exports.googleFacebookSignIn = async (req, res) => {
   try {
      const {authorization} = req.headers
      const decodedToken = await admin.auth().verifyIdToken(authorization)
      const {name, email, user_id} = decodedToken
      const profilePic = await UserProfilePic.findOne({userId: user_id})
      const signInToken = await jwt.sign(
         {
            user_id,
            username: name,
            email,
            picture: profilePic ? profilePic.userProfilePic : '',
            role: 'patient'
         },
         process.env.JWT_SECRET,
         {expiresIn: '7d'}
      );
      res.send({success: 'Sign In Successful', signInToken})
   } catch (error) {
      res.send({error: 'Server Error, Please try again'})
   }
}


// verification email sent
const verificationEmail = async (token) => {
   const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account activation link',
      html: `
         <h1>Welcome to Doctor's Garden</h1>
         <h2>Please use the following link to activate your account</h2>
         <a target="_blank" href="http://localhost:3000/account/activate/${token}">
            Click Here To Active Your Account.
         </a>
         <hr />
         <p>This email may contain sensitive information</p>
      `
   };
   await sgMail.send(emailData);
   res.send({success: `Email has been sent to ${email}. Please check your email to activate your account`})
}

// Patient Sign Up
exports.patientSignUp = async (req, res) => {
   const errors = validationResult(req);
   const formate = (data) => data.msg
   if (!errors.isEmpty()) {
      const errorMsg = errors.formatWith(formate).mapped()
      res.send(errorMsg)
   }

   const {username, email, password} = req.body
   const hashedPassword = await bcrypt.hash(password, 10)

   try {
      const token = await jwt.sign(
         {
            username,
            email,
            password: hashedPassword,
            role: 'patient'
         },
         process.env.JWT_SECRET,
         {expiresIn: '5m'}
      );
      verificationEmail(token)
   } catch (error) {
      console.error(error);
      res.send({error: `Patient Registration Fail.`});
   }
}

// Doctor Sign Up
exports.doctorSignUp = async (req, res) => {
   const errors = validationResult(req);
   const formate = (data) => data.msg
   if (!errors.isEmpty()) {
      const errorMsg = errors.formatWith(formate).mapped()
      res.send(errorMsg)
   }

   const {username, email, gender, degree, specialist, password} = req.body
   const hashedPassword = await bcrypt.hash(password, 10)
   try {
      const token = await jwt.sign(
         {
            username,
            email,
            gender,
            degree,
            specialist,
            password: hashedPassword,
            role: 'doctor'
         },
         process.env.JWT_SECRET,
         {expiresIn: '5m'}
      );
      const emailData = {
         from: process.env.EMAIL_FROM,
         to: email,
         subject: 'Account activation link',
         html: `
            <h1>Welcome to Doctor's Garden</h1>
            <h2>Please use the following link to activate your account</h2>
            <a target="_blank" href="http://localhost:3000/account/activate/${token}">
               Click Here To Active Your Account.
            </a>
            <hr />
            <p>This email may contain sensitive information</p>
         `
      };
      await sgMail.send(emailData);
      res.send({success: `Email has been sent to ${email}. Please check your email to activate your account`})
   } catch (error) {
      console.error(error);
      res.send({error: `Patient Registration Fail.`});
   }
}

exports.accountActivation = (req, res) => {
   const {token} = req.body;
 
   if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
         if (error) {
            res.send({
            error: 'Link expired. Please signup again'
         });
         } else {
            const { role } = jwt.decode(token);
            if (role === 'patient') {
               const { username, email, password, role } = jwt.decode(token);
               const user = new PatientData({
                  username,
                  email,
                  password,
                  role,
               });
               await user.save();
               res.send({success: 'Patient account create successful'});
            } else {
               const {username, email, gender, degree, specialist, password, role} = jwt.decode(token);
               const user = new DoctorData({
                  username,
                  email,
                  gender,
                  degree,
                  specialist,
                  password,
                  role
               });
               await user.save();
               res.send({success: 'Doctor account create successful'});
            }
         }
      });
   } else {
      return res.status(401).send({
         error: 'Error happening please try again'
      });
   }
};

exports.userSignIn = async (req, res, next) => {
   const errors = validationResult(req);
   const formate = (data) => data.msg
   if (!errors.isEmpty()) {
      const errorMsg = errors.formatWith(formate).mapped()
      res.send(errorMsg)
   }
   try {
      const {email, password} = req.body;
      // check user
      const correctUser = await PatientData.findOne({email}) || await DoctorData.findOne({email})
      if (!correctUser) {
         res.status(400).send({error: 'Email or password is incorrect.'})
      }
      // check password
      const correctPassword = await bcrypt.compare(password, correctUser.password)
      if (!correctPassword) {
         res.status(400).send({error: 'Email or password is incorrect.'})
      }
      correctUser.password = undefined

      // Generate Auth Token form user-registration.js
      const {username, role, _id} = correctUser
      if (role === 'doctor') {
         const signInToken = await jwt.sign(
            {
               user_id: _id,
               username,
               email: correctUser.email,
               picture: correctUser.profilePic !== '' ? correctUser.profilePic : '',
               role
            },
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
         );
         res.send({signInToken, success: 'Login Successful'})
      } else {
         const profilePic = await UserProfilePic.findOne({userId: _id})
         const signInToken = await jwt.sign(
            {
               user_id: _id,
               username,
               email: correctUser.email,
               picture: profilePic ? profilePic.userProfilePic : '',
               role
            },
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
         );
         res.send({signInToken, success: 'Login Successful'})
      }
   } catch (error) {
      res.send({error: 'Something was wrong.!'})
   }
}
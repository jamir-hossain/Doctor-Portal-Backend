const cloudinary = require('../CloudinaryConfig/CloudinaryConfig')
const jwt = require('jsonwebtoken');
const ProfilePicData = require('../Models/userProfilePic')
const DoctorData = require('../Models/doctorSignUp')


// Upload User Profile Image
exports.profileImgUpload = async (req, res) => {
   const image = req.file   
   try {
      const uploadedImage = await cloudinary.uploader.upload(image.path)
      const {username, email, user_id, role} = req.user
      if (role === "doctor") {
         await DoctorData.findByIdAndUpdate( 
            user_id, 
            {
               $set: {profilePic: uploadedImage.secure_url}
            },
            {new: true}
         )
         const signInToken = await jwt.sign(
            {
               user_id,
               username,
               email,
               picture: uploadedImage.secure_url,
               role
            },
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
         );
         res.send({success: 'Profile Image Successfully Uploaded', signInToken})
      } else {
         const updatedUserData = new ProfilePicData({
            userId: req.user.user_id,
            userProfilePic: uploadedImage.secure_url
         })
         await updatedUserData.save()
         const signInToken = await jwt.sign(
            {
               user_id,
               username,
               email,
               picture: uploadedImage.secure_url,
               role
            },
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
         );
         res.send({success: 'Profile Image Successfully Uploaded', signInToken})
      }
   } catch (e) {
      res.send({error: "Server Error, Please Try Again."})
   }
}

// Get All User Profile
exports.getAllDoctors = async (req, res, next) => {
   try {
      const allUserData = await DoctorData.find()
      res.send(allUserData)
   } catch (error) {
      res.status(404).json({error: 'Something was wrong.!'})
   }
}
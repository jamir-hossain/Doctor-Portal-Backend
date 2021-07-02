const router = require('express').Router()
const upload = require('../Middleware/uploadMiddleware')
const checkSignInUser = require('../Middleware/authMiddleware')

const {profileImgUpload, getAllDoctors} = require('../RouteController/profileController')

// upload single image
router.post(
   '/profile/image/upload', 
   checkSignInUser, 
   upload.single('file') , 
   profileImgUpload
)

// get all doctors data
router.get('/get/all/doctors', getAllDoctors)



// // upload multiple images
// router.post('/images/upload', upload.array('files') , async (req, res) => {
//    const images = req.files

//    try {
//       const uploadedImages = []
//       for (let i = 0; i < images.length; i++) {
//          const element = images[i];
//          const uploaded = await cloudinary.uploader.upload(element.path)
//          uploadedImages.push(uploaded.secure_url)
//       }
//       if (uploadedImages) {
//          console.log(uploadedImages)
//          res.send({uploadedImages, success: 'Multiple Files Successfully Uploaded'})
//       }
//    } catch (e) {
//       res.send({error: "Some thing was wrong"})
//    }
// })


module.exports = router
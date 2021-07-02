const {Schema, model} = require('mongoose')

const profilePic = new Schema({
   userId: {
      type: String,
   },
   userProfilePic: {
      type: String,
   }
}, {timestamps:true})


const UserProfilePic = model("UserProfilePic", profilePic)
module.exports = UserProfilePic
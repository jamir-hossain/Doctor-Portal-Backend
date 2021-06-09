const admin = require("firebase-admin");
const serviceAccount = require("./privateKey/doctors-garden-firebase-adminsdk-x3vpt-2897660291.json");
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)
});

module.exports.requireLogin = async (req, res, next) => {

   const {authorization} = req.headers
   if(!authorization){
      return res.status(401).send({error:"You are not sing in user"})
   }
   try {
      const decodedToken = await admin.auth().verifyIdToken(authorization)
      loggedInUser = decodedToken
      next()
   } catch (error) {
      console.log(error)
      res.status(401).send({error:"Token expired, please sign in again."})
   }
}
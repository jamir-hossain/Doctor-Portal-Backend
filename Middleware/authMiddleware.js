const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const admin = require("firebase-admin");
const serviceAccount = require("../doctor-garden1-firebase-adminsdk-1x5xy-be52359f26.json");
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)
});


const checkSignInUser = async (req, res, next) => {
   const { authorization } = req.headers
   if (authorization) {
      const decoded = jwtDecode(authorization)
      if (decoded.firebase) {
         admin.auth().verifyIdToken(authorization)
            .then((decodedToken) => {
               req.user = decodedToken
               next()
            })
            .catch((error) => {
               res.status(401).send({ error: error.message })
            });
      } else {
         try {
            const decoded = await jwt.verify(authorization, process.env.JWT_SECRET)
            req.user = decoded
            next()
         } catch (error) {
            res.status(401).send({ error: error.message })
         }
      }
   } else {
      res.send({ error: 'You are not sign in user.' })
   }
}

module.exports = checkSignInUser;
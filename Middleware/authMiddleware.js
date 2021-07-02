const jwt = require('jsonwebtoken');

const checkSignInUser = async (req, res, next) => {
   const {authorization} = req.headers
   // console.log(authorization)
   if (authorization) {
      try {
         // Verify Token
         const verified = await jwt.verify(authorization, process.env.JWT_SECRET)
         req.user = verified
         next()
      } catch (error) {
         res.send({error: 'You are not sign in user.'})
      }
   } else {
      res.send({error: 'You are not sign in user.'})
   }
}

module.exports = checkSignInUser;
require('dotenv').config()
const mongoose = require('mongoose');

const uri = process.env.DB_PATH;
module.exports.DBConnection = async () => {
   try {
      await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
      console.log("Database is successfully connected")
   } catch (error) {
      res.send('Connection Failed. Internal Server Error')
   }
}
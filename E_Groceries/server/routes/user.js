const User = require("../models/Users");
const express = require("express");
const router = express.Router();
// const { body, validationResult } = require("express-validator");
const FetchUser = require('../Middleware/FetchUser')


// Route 1
// Get User details /api/user/get_user POST method

router.get('/user/get_user', FetchUser,  async (req, res) => {

    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
  

// //   Route 2
// //   Update User PUT method 

// router.put("/user/upDate", FetchUser, async (res, req) =>{
//     try{
//         // Destructing
//         const {firstName, lastName, } = req.body
//     }
//     catch{

//     }
// })
  
  
  module.exports = router;
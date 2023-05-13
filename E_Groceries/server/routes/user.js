const User = require("../models/Users");
const express = require("express");
const router = express.Router();
const FetchUser = require('../Middleware/FetchUser')

const sendMail = require("../utils/sendMail")
require('dotenv').config();

// Route 1
// Get User details /api/user/get_user POST method

router.get('/user/get_user', FetchUser,  async (req, res) => {

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    // Handle user not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
  })
  

// Route 2
// Update/Edit User details /api/user/edit_user PUT method

router.put("/user/edit_user", FetchUser, async (req, res) => {
  try {
    // destructing
    const { firstName, lastName, phoneNumber} = req.body;
    // Create a new User Obj
    const newUser = {};
    if (firstName) {
      newUser.firstName = firstName;
    }
    if (lastName) {
      newUser.lastName = lastName;
    }
    if (phoneNumber) {
      newUser.phoneNumber = phoneNumber;
    } 
    const userId = req.user.id;
    let user = await User.findById(userId);

    // Handle user not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user = await User.findByIdAndUpdate(
      userId,
      { $set: newUser },
      { new: true }
    );
    const html = `
    <p>Hello <b>${user.firstName}</b>,</p>
    <p>We sincerely hope that you are doing well. We are writing to inform you that the change to your account information was successful.</p>
    <p>Thank you for choosing our service and we look forward to continuing to provide you with the best experience possible.
    </p>
    <p>Best regards,</p>
    <p>FreshCo Pantry</p>
    <p>Happy Shopping!!!</p>
  `;
  // console.log(html)
        await sendMail(user.email, "Your Account Information Has Been Updated", html)
    res.json({success:true,  message: "User details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
  
// Route 3
// User Delete, DELETE method
router.delete("/user/delete_user", FetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await User.findById(userId);

    // Handle user not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    note = await User.findByIdAndDelete(userId);
    res.json({ Success: true , message:"User Account Deleted Successful."});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


  
  module.exports = router;
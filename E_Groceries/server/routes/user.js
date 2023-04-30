const User = require("../models/Users");
const express = require("express");
const router = express.Router();
const FetchUser = require('../Middleware/FetchUser')


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
  

  
  
  module.exports = router;
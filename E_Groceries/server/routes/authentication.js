const User = require('../models/Users')
const express = require('express')
const router = express.Router();
const { body, validationResult } = require("express-validator");

// Route1 
// SignUp Form 
router.post(
    "/create_user",
    [
        // Data Validation
        body("firstName", "Enter a Valid first name min length required 3").isLength(3),
        body("lastName", "Last name cannot be empty").isLength(1),
        body("email", "Enter a Valid Email id").isEmail(),
        body("password", "Enter a Valid password min length required 5").isLength({ min: 5 }),
        body("phoneNumber", "Enter a Valid Phone Number length should be 10").isLength({ min: 10, max: 10 } )
    ],
    async(req, res) =>{
    // If errors, return bad req and errors (Email Id Unique)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    try {
        // Check user exists or not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Enter a unique Email Id" });
    } 
    // Create user 
    user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
      });
      res.json({user})
}
    catch (err) {
        console.log(err);
      res.status(500).json({error: "Internal Server Error" });
    }
    }
)

module.exports = router;
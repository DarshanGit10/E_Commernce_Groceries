const User = require("../models/Users");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const FetchUser = require('../Middleware/FetchUser')

// Route 1
// SignUp using POST method /api/create_user

const commonPasswords = ["password", "123456", "qwerty", "abc123"];
router.post(
  "/create_user",
  [
    // Data Validation
    body(
      "firstName",
      "Enter a Valid first name min length required 3"
    ).isLength(3),
    body("lastName", "Last name cannot be empty").isLength(1),
    body("email")
      .isEmail()
      .withMessage("Enter a valid email address")
      .custom((value) => {
        if (!value.endsWith("@gmail.com")) {
          throw new Error("Email address must be a valid Gmail address");
        }
        return true;
      }),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/
      )
      .withMessage(
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .not()
      .isIn(commonPasswords)
      .withMessage("Password is too common"),
    body(
      "phoneNumber",
      "Enter a Valid Phone Number length should be 10"
    ).isLength({ min: 10, max: 10 }),
  ],
  async (req, res) => {
    let success = false
    // If errors, return bad request with errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructing
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    try {
      // Check user exists or not
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "Enter a unique Email Id" });
      }
      //   hashing the password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      // Create user
      user = await User.create({
        firstName,
        lastName,
        password: hashPassword,
        email,
        phoneNumber,
      });
      success= true
      res.status(200).json({success, message: "User registered successfully" });

      // res.json({ user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route 2
// Login using POST method /api/login_user
router.post(
  "/login_user",
  // Data Validations
  [
    body("email")
      .isEmail()
      .withMessage("Enter a valid email address")
      .custom((value) => {
        if (!value.endsWith("@gmail.com")) {
          throw new Error("Email address must be a valid Gmail address");
        }
        return true;
      }),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
    let success = false
    // If errors, return bad req with errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructing
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login using correct credentials !!!" });
      }
      // Compare password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          error: "Please try to login using correct credentials !!!",
        });
      }
      const data = {
        user: {
          id: user._id,
        },
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 6) // token will expire in 6 hours
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET_KEY);
      success = true
      res.json({success, authToken });
      
      // return res.status(200).json({ user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);


// Route 3
// Get User details /api/auth/getUser POST method

router.get('/get_user', FetchUser,  async (req, res) => {

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})



module.exports = router;

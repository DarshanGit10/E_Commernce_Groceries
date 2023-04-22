const User = require("../models/Users");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Route1
// SignUp Form
router.post(
  "/create_user",
  [
    // Data Validation
    body(
      "firstName",
      "Enter a Valid first name min length required 3"
    ).isLength(3),
    body("lastName", "Last name cannot be empty").isLength(1),
    body("email", "Enter a Valid Email id").isEmail(),
    body("password", "Enter a Valid password min length required 5").isLength({
      min: 5,
    }),
    body(
      "phoneNumber",
      "Enter a Valid Phone Number length should be 10"
    ).isLength({ min: 10, max: 10 }),
  ],
  async (req, res) => {
    // If errors, return bad req and errors (Email Id Unique)
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
      res.json({ user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route 2
// Login
router.post(
  "/login_user",
  // Data Validations
  [
    body("email", "Enter a Valid Email id").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
    // If errors, return bad req and errors
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
        return res
          .status(400)
          .json({
            error: "Please try to login using correct credentials !!!",
          });
      }
      return res.status(200).json({ user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;

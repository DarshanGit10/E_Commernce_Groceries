const User = require("../models/Users");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Route 1
// SignUp using POST method /api/create_user
const commonPasswords = ["password", "123456", "qwerty", "abc123"];
router.post(
  "/create_user",
  [
    // Data Validation
    body(
      "firstName",
      "Enter a valid first name. Min length required 3."
    ).isLength(3),
    body("lastName", "Last name cannot be empty.").isLength(1),
    body("email")
      .isEmail()
      .withMessage("Enter a valid email address.")
      .custom((value) => {
        if (!value.endsWith("@gmail.com")) {
          throw new Error("Email address must be a valid Gmail address.");
        }
        return true;
      }),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/
      )
      .withMessage(
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
      )
      .not()
      .isIn(commonPasswords)
      .withMessage("Password is too common."),
    body(
      "phoneNumber",
      "Enter a valid Phone Number. Length should be 10."
    ).isLength({ min: 10, max: 10 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password, firstName, lastName, phoneNumber } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(409).json({ error: "User already exists." });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      user = await User.create({
        firstName,
        lastName,
        password: hashPassword,
        email,
        phoneNumber,
      });
      const response = {
        success: true,
        message: "User registered successfully.",
        data: user,
      };
      res.status(201).json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error." });
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
        // Add email validation here
        return true;
      }),
    body("password").exists().withMessage("Password cannot be empty"),
  ],
  async (req, res) => {
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
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check if password is valid
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate and send the JWT token in the response
      const data = {
        user: {
          id: user._id,
        },
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 6, // token will expire in 6 hours
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET_KEY);
      res.status(200).json({ success: true, token: authToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;

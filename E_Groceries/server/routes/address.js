const User = require("../models/Users");
const Address = require("../models/Address")
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const FetchUser = require('../Middleware/FetchUser')

// Route 1
// Add Address
router.post(
    "/address/addAddress",
    FetchUser,
    [
        body("street")
        .notEmpty().withMessage("Street can't be empty")
        .isLength({ min: 3 }).withMessage("Street must be at least 3 characters long"),
      body("city")
        .notEmpty().withMessage("City can't be empty"),
      body("state")
        .notEmpty().withMessage("State can't be empty"),
      body("zipCode")
        .isLength({ min: 6, max: 6 }).withMessage("ZipCode must be 6 characters long")
        .matches(/^[0-9]+$/).withMessage("ZipCode must contain only numbers")
    ],
    async (req, res) => {
      let success = false
      try {
        // destructing
        const { street, city, state, zipCode } = req.body;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const address = new Address({
            street,
            city,
            state,
            zipCode,
        user: req.user.id,
        });
        const addressAdded = await address.save();
        success = true 
       res.status(200).json({success, message : addressAdded})
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );


  // Route 2
  //  Get Address 
  router.get('/address/getAddress', FetchUser, async (req, res) => {
    try {
      const addresses = await Address.find({ user: req.user.id });
      res.status(200).json(addresses);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })



module.exports = router;
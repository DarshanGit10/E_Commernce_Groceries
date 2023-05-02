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
    let success = false;
    try {
      // Destructure the address fields from the request body
      const { street, city, state, zipCode } = req.body;

      // Check if the user has already added the same address
      const existingAddress = await Address.findOne({ user: req.user.id, street, city, state, zipCode });
      if (existingAddress) {
        return res.status(400).json({ error: "Address already exists" });
      }

      // Check if the user has reached the maximum number of addresses allowed
      const addressCount = await Address.countDocuments({ user: req.user.id });
      if (addressCount >= 4) {
        return res.status(400).json({ error: "Maximum number of addresses reached" });
      }

      // If there are no errors, create a new address and save it to the database
      const address = new Address({
          street,
          city,
          state,
          zipCode,
          user: req.user.id,
      });
      const addressAdded = await address.save();
      success = true;
      res.status(200).json({ success, message: addressAdded });
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
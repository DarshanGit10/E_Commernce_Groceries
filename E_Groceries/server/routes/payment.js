const brainTree = require("braintree");
require("dotenv").config();
const express = require("express");
const router = express.Router();

const Orders = require("../models/Orders");
const FetchUser = require("../Middleware/FetchUser");



var gateway = new brainTree.BraintreeGateway({
  environment: brainTree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});

// Route 1, Token
router.get("/brainTree/token", async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        
        return res.status(500).json({ error: err });
        
      } else {
        res.status(200).send(response);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2, Payments
router.post("/brainTree/payment", FetchUser, async (req, res) => {
  
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    const productIds = cart.map((i) => i._id);
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: { submitForSettlement: true },
      },
      
      function (error, result) {
        if(result){
            const order = new Orders({
                products: productIds,
                payment: result,
                buyer: req.user.id

            }).save()
            res.status(200).json({ok:true})
        }
        else{
            console.error(error.message);
    res.status(500).send("Internal Server Error");
        }
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

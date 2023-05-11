const brainTree = require("braintree");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const Products = require('../models/Products')
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
    const { nonce, userCart } = req.body;
    const productIds = userCart.map((i) => i._id);

    const products = await Products.find({ _id: { $in: productIds } });
    let total = 0;
    const updatedProductDetails = [];
    products.forEach((p) => {
      const item = userCart.find((i) => i._id.toString() === p._id.toString());
      if (item) {
        const numberOfQuantity = item.numberOfQuantity;
        total += p.price * numberOfQuantity;
        const productObject = p.toObject(); // Convert Mongoose document to plain JavaScript object
        productObject.numberOfQuantity = numberOfQuantity; // Add numberOfQuantity property to the object
        updatedProductDetails.push(productObject); // Push the updated object to the array
      }
    });

    // console.log("Total: ", total);

    const result = await new Promise((resolve, reject) => {
      gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: { submitForSettlement: true },
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (result.success) {
      const order = new Orders({
        product: productIds,
        products: updatedProductDetails,
        payment: result,
        buyer: req.user.id,
      });

      // Save the order
      await order.save();

      // Update the count field in the products collection
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const item = userCart.find((i) => i._id.toString() === product._id.toString());
        if (item) {
          const newCount = product.count - item.numberOfQuantity;
          await Products.updateOne({ _id: product._id }, { $set: { count: newCount } });
        }
      }

      res.status(200).json({ ok: true });
    } else {
      console.error(result.message);
      res.status(500).send("Payment Failed");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});






module.exports = router;

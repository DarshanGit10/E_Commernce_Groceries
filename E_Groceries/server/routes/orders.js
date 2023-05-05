const FetchUser = require("../Middleware/FetchUser");
const Orders = require("../models/Orders");
const express = require("express");
const router = express.Router();
const Products = require("../models/Products");

router.get("/getOrders", FetchUser, async (req, res) => {
  try {
    const orders = await Orders.find({ buyer: req.user.id })
      .populate("product")
      .populate("products")
      .populate("buyer", "firstName");

    for (const order of orders) {
      if (!Array.isArray(order.product)) {
        continue;
      }
      const productIds = order.product.map((product) => product._id);
      const products = await Products.find({ _id: { $in: productIds } });
      // Map product details to corresponding order products
      const updatedProducts = order.product.map((product) => {
        const productDetails = products.find((p) => p._id.equals(product._id));
        if (!productDetails) {
          return product;
        }
        return { ...product, ...productDetails.toObject() };
      });
      // Update order document with updated products
      await Orders.updateOne({ _id: order._id }, { products: updatedProducts });
    }

    const updatedOrders = await Orders.find({ buyer: req.user.id })
      .populate("product")
      .populate("products")
      .populate("buyer", "firstName");

    return res.status(200).json(updatedOrders);

    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Error while fetching the orders!",
      error,
    });
  }
});

module.exports = router;

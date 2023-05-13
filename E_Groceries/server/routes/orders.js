const FetchUser = require("../Middleware/FetchUser");
const Orders = require("../models/Orders");
const express = require("express");
const router = express.Router();



router.get("/getOrders", FetchUser, async (req, res) => {
  try {
    const orders = await Orders.find({ buyer: req.user.id })
      .populate("product")
      .populate("products")
      .populate("buyer", "firstName").populate('shippingAddress');

    return res.status(200).json(orders);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Error while fetching the orders!",
      error,
    });
  }
});


// Route 2
// Cancel orders
router.put("/cancelOrders/:orderId", FetchUser, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const updatedOrder = await Orders.findByIdAndUpdate(orderId, { 
      status: 'Cancelled',
      payment: {
        success: false
      }
    }, { new: true });
    

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }



    res.json({ success: true, message: 'Order Cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route 3
// Get more details




module.exports = router;

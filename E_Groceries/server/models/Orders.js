const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
  }],
  payment: {},
  buyer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status:{
    type: String,
    default: 'Not Process',
    enum: ['Not Process', 'Processing', 'Shipped', 'Delivered', 'Cancel']
  }
}, 
{timestamps:true});

module.exports = mongoose.model("Orders", ordersSchema);

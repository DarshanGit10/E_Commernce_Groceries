const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({

  payment: {},
  buyer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status:{
    type: String,
    default: 'Not Process',
    enum: ['Not Process', 'Processing', 'Shipped', 'Delivered', 'Cancel']
  },
  products: [{
    type: String
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Products',
  }],
}, 
{timestamps:true});

module.exports = mongoose.model("Orders", ordersSchema);

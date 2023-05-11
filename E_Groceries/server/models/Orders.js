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
    enum: ['Not Process', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  },
  product: [{
    type: String
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Products',
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
  }],
  // updatedAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  // shippingAddress: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Address",
  // },
}, 
{timestamps:true});

module.exports = mongoose.model("Orders", ordersSchema);



// ordersSchema.virtual('autoUpdateStatus').get(function() {
//   const twoHours = 2 * 60 * 60 * 1000; // in milliseconds
//   const sixteenHours = 16 * 60 * 60 * 1000; // in milliseconds
//   const now = Date.now();
//   const timeSinceLastUpdate = now - this.updatedAt.getTime();

//   if (this.status === 'Not Process' && timeSinceLastUpdate >= twoHours) {
//     return 'Processing';
//   } else if (this.status === 'Processing' && timeSinceLastUpdate >= twoHours) {
//     return 'Shipped';
//   } else if (this.status === 'Shipped' && timeSinceLastUpdate >= sixteenHours) {
//     return 'Delivered';
//   } else {
//     return this.status;
//   }
// });

// ordersSchema.pre('save', function(next) {
//   this.status = this.autoUpdateStatus;
//   next();
// });

module.exports = mongoose.model('Orders', ordersSchema);

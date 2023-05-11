const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 50,
  },
  numberOfQuantity: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Products", productSchema);

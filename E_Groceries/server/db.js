// DB Connection File
const mongoose = require('mongoose');

const connectionUrl = 'mongodb+srv://groceriesAdmin:r1QKwi7LMnEihUns@cluster0.focfaof.mongodb.net/eGroceries?retryWrites=true&w=majority'

async function connectToMongo() {
  try {
    await mongoose.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
  }
}

module.exports = connectToMongo;
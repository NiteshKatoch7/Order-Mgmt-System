const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: String,
  itemName: String,
  price: Number,
  discount: Number,
  quantity: {
    type: Number,
    default: 1
  }
});

const orderSchema = new mongoose.Schema({
  orderId: String,
  customerName: String,
  items: [itemSchema],
  totalAmount: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
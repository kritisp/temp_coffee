const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true, index: true },
    drink: { type: mongoose.Schema.Types.ObjectId, ref: 'Drink', required: true },
    drinkName: { type: String, required: true },
    size: { type: String, enum: ['Small', 'Medium', 'Large'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ['Received', 'Being Prepared', 'Delivered'],
      default: 'Received',
    },
  },
  { collection: 'orders', timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

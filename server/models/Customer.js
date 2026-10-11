const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    address: { type: String, trim: true },
  },
  { collection: 'customers', timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);

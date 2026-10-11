const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { collection: 'drinks' }
);

module.exports = mongoose.model('Drink', drinkSchema);

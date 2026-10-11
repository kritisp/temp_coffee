const router = require('express').Router();
const Drink = require('../models/Drink');

// GET all drinks (cheapest first)
router.get('/', async (req, res) => {
  const drinks = await Drink.find().sort({ price: 1 });
  res.json(drinks);
});

module.exports = router;

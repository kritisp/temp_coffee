const router = require('express').Router();
const Order = require('../models/Order');
const Drink = require('../models/Drink');
const Customer = require('../models/Customer');

// The only order of steps the kitchen can move an order through.
const STATUS_FLOW = ['Received', 'Being Prepared', 'Delivered'];

// GET orders. ?mobile=... for one customer, no query for all (kitchen page).
router.get('/', async (req, res) => {
  const filter = req.query.mobile ? { mobile: req.query.mobile } : {};
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
});

// POST a new order: check stock, reduce it, save the order.
router.post('/', async (req, res) => {
  const { customerName, mobile, drinkId, size, quantity, deliveryAddress } = req.body;
  const qty = Number(quantity);

  if (!customerName || !mobile || !drinkId || !size || !deliveryAddress || !(qty >= 1)) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Take the stock in one step, only if enough is left.
  // This stops two buyers from both getting the last cup.
  const drink = await Drink.findOneAndUpdate(
    { _id: drinkId, stock: { $gte: qty } },
    { $inc: { stock: -qty } },
    { new: true }
  );

  if (!drink) {
    const current = await Drink.findById(drinkId);
    if (!current) return res.status(404).json({ message: 'Drink not found' });
    if (current.stock === 0) return res.status(409).json({ message: 'Out of stock' });
    return res.status(409).json({ message: `Only ${current.stock} left in stock` });
  }

  try {
    // Remember the customer by mobile number.
    const customer = await Customer.findOneAndUpdate(
      { mobile },
      { $set: { name: customerName, address: deliveryAddress } },
      { upsert: true, new: true }
    );

    const order = await Order.create({
      customer: customer._id,
      customerName,
      mobile,
      drink: drink._id,
      drinkName: drink.name,
      size,
      quantity: qty,
      unitPrice: drink.price,
      totalAmount: drink.price * qty,
      deliveryAddress,
      status: 'Received',
    });

    res.status(201).json(order);
  } catch (err) {
    // Saving failed after the stock was taken, so give it back.
    await Drink.updateOne({ _id: drink._id }, { $inc: { stock: qty } });
    throw err;
  }
});

// PATCH status: kitchen moves an order one step forward.
router.patch('/:id/status', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];
  if (!nextStatus || req.body.status !== nextStatus) {
    return res.status(400).json({
      message: nextStatus
        ? `This order can only move to "${nextStatus}"`
        : 'This order is already delivered',
    });
  }

  order.status = nextStatus;
  await order.save();
  res.json(order);
});

// DELETE (cancel): only while the order is still "Received". Gives the stock back.
router.delete('/:id', async (req, res) => {
  const order = await Order.findOneAndDelete({ _id: req.params.id, status: 'Received' });

  if (!order) {
    const exists = await Order.exists({ _id: req.params.id });
    if (!exists) return res.status(404).json({ message: 'Order not found' });
    return res.status(400).json({ message: 'Only orders still in "Received" can be cancelled' });
  }

  await Drink.updateOne({ _id: order.drink }, { $inc: { stock: order.quantity } });
  res.json({ message: 'Order cancelled' });
});

module.exports = router;

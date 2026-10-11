const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Initial seed data matching the mockups and seed.js
let drinks = [
  { _id: '6aca00000000000000000001', name: 'Espresso', description: 'Strong, short shot of pure coffee', price: 120, image: '/images/espresso.svg', stock: 30 },
  { _id: '6aca00000000000000000002', name: 'Americano', description: 'Espresso topped with hot water', price: 150, image: '/images/americano.svg', stock: 25 },
  { _id: '6aca00000000000000000003', name: 'Cappuccino', description: 'Equal parts espresso, milk and foam', price: 180, image: '/images/cappuccino.svg', stock: 25 },
  { _id: '6aca00000000000000000004', name: 'Latte', description: 'Smooth espresso with lots of steamed milk', price: 190, image: '/images/latte.svg', stock: 40 },
  { _id: '6aca00000000000000000005', name: 'Mocha', description: 'Espresso with chocolate and milk', price: 200, image: '/images/mocha.svg', stock: 0 },
  { _id: '6aca00000000000000000006', name: 'Cold Coffee', description: 'Chilled blended coffee with milk and ice', price: 210, image: '/images/cold-coffee.svg', stock: 20 },
];

let customers = [
  { _id: 'cust1', name: 'Bhagyashri Valecha', mobile: '9999999999', address: 'd19/8' },
  { _id: 'cust2', name: 'Demo Customer', mobile: '5555555555', address: 'lh-1' }
];

let orders = [
  {
    _id: '6aca586d54cca9557dfd406a',
    customerName: 'Bhagyashri Valecha',
    mobile: '9999999999',
    drink: '6aca00000000000000000001',
    drinkName: 'Espresso',
    size: 'Medium',
    quantity: 2,
    unitPrice: 120,
    totalAmount: 240,
    deliveryAddress: 'd19/8',
    status: 'Received',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: '6aca2cd516b8535cde1ad343',
    customerName: 'Demo Customer',
    mobile: '9999999999',
    drink: '6aca00000000000000000004',
    drinkName: 'Latte',
    size: 'Medium',
    quantity: 2,
    unitPrice: 190,
    totalAmount: 380,
    deliveryAddress: '12 MG Road, Bhubaneswar',
    status: 'Being Prepared',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    _id: '6aca79c354cca9557dfd40c2',
    customerName: 'Customer',
    mobile: '5555555555',
    drink: '6aca00000000000000000002',
    drinkName: 'Americano',
    size: 'Medium',
    quantity: 1,
    unitPrice: 150,
    totalAmount: 150,
    deliveryAddress: 'lh-1',
    status: 'Received',
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    updatedAt: new Date(Date.now() - 1200000).toISOString(),
  }
];

const STATUS_FLOW = ['Received', 'Being Prepared', 'Delivered'];

// Drinks
router.get('/drinks', (req, res) => {
  const sorted = [...drinks].sort((a, b) => a.price - b.price);
  res.json(sorted);
});

// Orders
router.get('/orders', (req, res) => {
  const { mobile } = req.query;
  let list = orders;
  if (mobile) {
    list = list.filter((o) => o.mobile === mobile);
  }
  const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

router.post('/orders', (req, res) => {
  const { customerName, mobile, drinkId, size, quantity, deliveryAddress } = req.body;
  const qty = Number(quantity);

  if (!customerName || !mobile || !drinkId || !size || !deliveryAddress || !(qty >= 1)) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  const drink = drinks.find((d) => d._id === drinkId || d.name.toLowerCase() === drinkId.toLowerCase());
  if (!drink) return res.status(404).json({ message: 'Drink not found' });
  if (drink.stock === 0) return res.status(409).json({ message: 'Out of stock' });
  if (drink.stock < qty) return res.status(409).json({ message: `Only ${drink.stock} left in stock` });

  drink.stock -= qty;

  const newOrder = {
    _id: crypto.randomBytes(12).toString('hex'),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

router.patch('/orders/:id/status', (req, res) => {
  const order = orders.find((o) => o._id === req.params.id);
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
  order.updatedAt = new Date().toISOString();
  res.json(order);
});

router.delete('/orders/:id', (req, res) => {
  const index = orders.findIndex((o) => o._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Order not found' });

  const order = orders[index];
  if (order.status !== 'Received') {
    return res.status(400).json({ message: 'Only orders still in "Received" can be cancelled' });
  }

  const drink = drinks.find((d) => d._id === order.drink);
  if (drink) {
    drink.stock += order.quantity;
  }

  orders.splice(index, 1);
  res.json({ message: 'Order cancelled' });
});

// Analytics
router.get('/analytics', (req, res) => {
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const drinkMap = {};
  orders.forEach((o) => {
    if (!drinkMap[o.drinkName]) {
      drinkMap[o.drinkName] = { name: o.drinkName, orders: 0, sales: 0 };
    }
    drinkMap[o.drinkName].orders += 1;
    drinkMap[o.drinkName].sales += o.totalAmount || 0;
  });

  const perDrink = Object.values(drinkMap).sort((a, b) => b.orders - a.orders).map((d) => ({
    name: d.name,
    orders: d.orders,
    sales: d.sales,
    percent: totalOrders ? Math.round((d.orders / totalOrders) * 1000) / 10 : 0,
  }));

  res.json({
    totalOrders,
    totalSales,
    perDrink,
  });
});

module.exports = router;

const router = require('express').Router();
const Order = require('../models/Order');

// GET dashboard numbers: total orders, total sales, and orders per drink.
router.get('/', async (req, res) => {
  const [totals] = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$totalAmount' },
      },
    },
  ]);

  const perDrink = await Order.aggregate([
    {
      $group: {
        _id: '$drinkName',
        orders: { $sum: 1 },
        sales: { $sum: '$totalAmount' },
      },
    },
    { $sort: { orders: -1 } },
  ]);

  const totalOrders = totals?.totalOrders || 0;

  res.json({
    totalOrders,
    totalSales: totals?.totalSales || 0,
    perDrink: perDrink.map((d) => ({
      name: d._id,
      orders: d.orders,
      sales: d.sales,
      percent: totalOrders ? Math.round((d.orders / totalOrders) * 1000) / 10 : 0,
    })),
  });
});

module.exports = router;

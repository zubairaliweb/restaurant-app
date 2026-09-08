const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');
const Food = require('../models/Food');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalCustomers, totalFoodItems, pendingOrders, recentOrders, revenueAgg] =
    await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Food.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

  const totalRevenue = revenueAgg[0]?.total || 0;

  res.json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalFoodItems,
      pendingOrders,
      recentOrders,
    },
  });
});

module.exports = { getStats };

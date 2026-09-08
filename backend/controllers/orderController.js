const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, fullName, phone, deliveryAddress, orderNotes, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }
  if (!fullName || !phone || !deliveryAddress) {
    res.status(400);
    throw new Error('Please provide delivery information');
  }

  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = itemsPrice > 0 ? 150 : 0;
  const totalPrice = itemsPrice + deliveryFee;

  const order = await Order.create({
    user: req.user._id,
    items,
    fullName,
    phone,
    deliveryAddress,
    orderNotes,
    paymentMethod,
    itemsPrice,
    deliveryFee,
    totalPrice,
  });

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Get single order (owner or admin)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json({ success: true, order });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = status;
  await order.save();
  res.json({ success: true, order });
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };

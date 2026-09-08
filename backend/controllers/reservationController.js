const asyncHandler = require('express-async-handler');
const Reservation = require('../models/Reservation');

// @desc    Create a table reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = asyncHandler(async (req, res) => {
  const { customerName, phone, reservationDate, reservationTime, numberOfGuests } = req.body;

  if (!customerName || !phone || !reservationDate || !reservationTime || !numberOfGuests) {
    res.status(400);
    throw new Error('Please fill in all reservation details');
  }

  const reservation = await Reservation.create({
    user: req.user._id,
    customerName,
    phone,
    reservationDate,
    reservationTime,
    numberOfGuests,
  });

  res.status(201).json({ success: true, reservation });
});

// @desc    Get logged-in user's reservations
// @route   GET /api/reservations/my
// @access  Private
const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, reservations });
});

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
const getAllReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find().populate('user', 'name email phone').sort({ createdAt: -1 });
  res.json({ success: true, count: reservations.length, reservations });
});

// @desc    Update reservation status (approve/cancel)
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin
const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Approved', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid reservation status');
  }

  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    res.status(404);
    throw new Error('Reservation not found');
  }
  reservation.status = status;
  await reservation.save();
  res.json({ success: true, reservation });
});

module.exports = { createReservation, getMyReservations, getAllReservations, updateReservationStatus };

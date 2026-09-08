const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
} = require('../controllers/reservationController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.get('/', protect, admin, getAllReservations);
router.put('/:id/status', protect, admin, updateReservationStatus);

module.exports = router;

const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    reservationDate: { type: String, required: true },
    reservationTime: { type: String, required: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    orderNotes: { type: String, default: '' },
    paymentMethod: { type: String, enum: ['Cash on Delivery', 'Online Payment'], default: 'Cash on Delivery' },
    itemsPrice: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

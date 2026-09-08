const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

foodSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Food', foodSchema);

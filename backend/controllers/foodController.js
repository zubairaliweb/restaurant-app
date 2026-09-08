const asyncHandler = require('express-async-handler');
const Food = require('../models/Food');

// @desc    Get all foods (supports search, category filter, featured)
// @route   GET /api/foods
// @access  Public
const getFoods = asyncHandler(async (req, res) => {
  const { search, category, featured } = req.query;
  const query = {};

  if (search) {
    query.$text = { $search: search };
  }
  if (category) {
    query.category = category;
  }
  if (featured === 'true') {
    query.isFeatured = true;
  }

  const foods = await Food.find(query).populate('category', 'name slug').sort({ createdAt: -1 });
  res.json({ success: true, count: foods.length, foods });
});

// @desc    Get single food by id
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).populate('category', 'name slug');
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }
  res.json({ success: true, food });
});

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Admin
const createFood = asyncHandler(async (req, res) => {
  const { name, description, price, image, category, isAvailable, isFeatured } = req.body;

  if (!name || !description || !price || !image || !category) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const food = await Food.create({
    name,
    description,
    price,
    image,
    category,
    isAvailable: isAvailable ?? true,
    isFeatured: isFeatured ?? false,
  });

  res.status(201).json({ success: true, food });
});

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }

  Object.assign(food, req.body);
  const updated = await food.save();
  res.json({ success: true, food: updated });
});

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findByIdAndDelete(req.params.id);
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }
  res.json({ success: true, message: 'Food item deleted' });
});

module.exports = { getFoods, getFoodById, createFood, updateFood, deleteFood };

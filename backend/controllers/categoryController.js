const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Food = require('../models/Food');

const slugify = (text) =>
  text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, categories });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ success: true, category });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  category.name = req.body.name || category.name;
  category.slug = slugify(category.name);
  await category.save();
  res.json({ success: true, category });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Food.countDocuments({ category: req.params.id });
  if (inUse > 0) {
    res.status(400);
    throw new Error('Cannot delete a category that still has food items assigned to it');
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

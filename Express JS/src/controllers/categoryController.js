const { Not } = require('typeorm');

// Get all categories
const getAllCategories = async (req, res, next) => {
  try {
    const Category = require('../models/Category');
    const categoryRepository = req.AppDataSource.getRepository(Category);

    const categories = await categoryRepository.find({
      order: { name: 'ASC' }
    });

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single category by slug
const getCategoryBySlug = async (req, res, next) => {
  try {
    const Category = require('../models/Category');
    const categoryRepository = req.AppDataSource.getRepository(Category);

    const { slug } = req.params;
    const category = await categoryRepository.findOne({ where: { slug } });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      success: true,
      data: {
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create category (admin only)
const createCategory = async (req, res, next) => {
  try {
    const Category = require('../models/Category');
    const categoryRepository = req.AppDataSource.getRepository(Category);

    const { name, slug } = req.body;

    // Check if category already exists
    const existingCategory = await categoryRepository.findOne({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists with this slug' });
    }

    // Create new category
    const category = new Category();
    category.name = name;
    category.slug = slug;

    const savedCategory = await categoryRepository.save(category);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category: savedCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update category (admin only)
const updateCategory = async (req, res, next) => {
  try {
    const Category = require('../models/Category');
    const categoryRepository = req.AppDataSource.getRepository(Category);

    const { id } = req.params;
    const { name, slug } = req.body;

    const category = await categoryRepository.findOne({ where: { id: parseInt(id) } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if slug is already taken by another category
    if (slug && slug !== category.slug) {
      const existingCategory = await categoryRepository.findOne({
        where: {
          slug,
          id: Not(parseInt(id)),
        },
      });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists with this slug' });
      }
    }

    // Update category
    if (name) category.name = name;
    if (slug) category.slug = slug;

    const updatedCategory = await categoryRepository.save(category);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: {
        category: updatedCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete category (admin only)
const deleteCategory = async (req, res, next) => {
  try {
    const Category = require('../models/Category');
    const categoryRepository = req.AppDataSource.getRepository(Category);

    const { id } = req.params;

    const category = await categoryRepository.findOne({ where: { id: parseInt(id) } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await categoryRepository.remove(category);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
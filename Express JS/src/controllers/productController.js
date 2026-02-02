// Get all products (with pagination)
const getAllProducts = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const productRepository = req.AppDataSource.getRepository(Product);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await productRepository.findAndCount({
      relations: ['category'],
      order: { name: 'ASC' },
      skip,
      take: limit
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by slug
const getProductBySlug = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const productRepository = req.AppDataSource.getRepository(Product);

    const { slug } = req.params;
    const product = await productRepository.findOne({
      where: { slug },
      relations: ['category']
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create product (admin only)
const createProduct = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const Category = require('../models/Category');
    const productRepository = req.AppDataSource.getRepository(Product);
    const categoryRepository = req.AppDataSource.getRepository(Category);

    const { name, slug, description, price, stock, category: categoryId, images } = req.body;

    // Check if product already exists
    const existingProduct = await productRepository.findOne({ where: { slug } });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already exists with this slug' });
    }

    // Check if category exists
    const category = await categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      return res.status(400).json({ message: 'Category not found' });
    }

    // Create new product
    const product = new Product();
    product.name = name;
    product.slug = slug;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.category = category;

    // Handle product image (uploaded via multer or passed directly)
    let imageNames = [];
    if (req.file) {
      imageNames = [req.file.filename];
    } else if (images) {
      imageNames = Array.isArray(images) ? images : [images];
    }
    product.images = imageNames;

    const savedProduct = await productRepository.save(product);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product: savedProduct
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update product (admin only)
const updateProduct = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const Category = require('../models/Category');
    const productRepository = req.AppDataSource.getRepository(Product);
    const categoryRepository = req.AppDataSource.getRepository(Category);

    const { id } = req.params;
    const { name, slug, description, price, stock, category: categoryId, images } = req.body;

    const product = await productRepository.findOne({ 
      where: { id: parseInt(id) },
      relations: ['category']
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if slug is already taken by another product
    if (slug && slug !== product.slug) {
      const existingProduct = await productRepository.findOne({ where: { slug } });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product already exists with this slug' });
      }
    }

    // Check if category exists (if provided)
    if (categoryId) {
      const category = await categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }
      product.category = category;
    }

    // Update product
    if (name) product.name = name;
    if (slug) product.slug = slug;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    // Update image: if new file uploaded, replace; otherwise allow explicit override via body
    if (req.file) {
      product.images = [req.file.filename];
    } else if (images !== undefined) {
      product.images = Array.isArray(images) ? images : [images];
    }

    const updatedProduct = await productRepository.save(product);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const productRepository = req.AppDataSource.getRepository(Product);

    const { id } = req.params;

    const product = await productRepository.findOne({ where: { id: parseInt(id) } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await productRepository.remove(product);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
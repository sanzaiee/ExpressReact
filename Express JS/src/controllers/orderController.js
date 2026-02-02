// Create new order (COD only)
const createOrder = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    const Product = require('../models/Product');
    const User = require('../models/User');
    const orderRepository = req.AppDataSource.getRepository(Order);
    const productRepository = req.AppDataSource.getRepository(Product);
    const userRepository = req.AppDataSource.getRepository(User);

    const { products, shippingAddress } = req.body;

    // Validate input
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products are required' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Get user
    const user = await userRepository.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate products and calculate total
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await productRepository.findOne({ where: { id: item.product } });
      if (!product) {
        return res.status(400).json({ message: `Product with id ${item.product} not found` });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderProducts.push({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images[0]
        },
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order
    const order = new Order();
    order.user = user;
    order.products = orderProducts;
    order.totalAmount = totalAmount;
    order.shippingAddress = shippingAddress;
    order.paymentMethod = 'COD';
    order.status = 'pending';

    // Save order
    const savedOrder = await orderRepository.save(order);

    // Update product stock
    for (const item of products) {
      const product = await productRepository.findOne({ where: { id: item.product } });
      product.stock -= item.quantity;
      await productRepository.save(product);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: savedOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    const orderRepository = req.AppDataSource.getRepository(Order);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await orderRepository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });

    res.json({
      success: true,
      data: {
        orders,
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

// Get user's orders
const getUserOrders = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    const orderRepository = req.AppDataSource.getRepository(Order);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await orderRepository.findAndCount({
      where: { user: { id: req.user.id } },
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });

    res.json({
      success: true,
      data: {
        orders,
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

// Get single order
const getOrderById = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    const orderRepository = req.AppDataSource.getRepository(Order);

    const { id } = req.params;

    const order = await orderRepository.findOne({
      where: { id: parseInt(id), user: { id: req.user.id } },
      relations: ['user']
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order (if pending)
const cancelOrder = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    const Product = require('../models/Product');
    const orderRepository = req.AppDataSource.getRepository(Order);
    const productRepository = req.AppDataSource.getRepository(Product);

    const { id } = req.params;

    const order = await orderRepository.findOne({
      where: { id: parseInt(id), user: { id: req.user.id } }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    // Update order status
    order.status = 'cancelled';
    await orderRepository.save(order);

    // Restore product stock
    for (const item of order.products) {
      const product = await productRepository.findOne({ where: { id: item.product.id } });
      if (product) {
        product.stock += item.quantity;
        await productRepository.save(product);
      }
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};


const updateOrderStatus = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    const orderRepository = req.AppDataSource.getRepository(Order);

    const { id } = req.params;
    const { status } = req.body;
    const order = await orderRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['user'],
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await orderRepository.save(order);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};
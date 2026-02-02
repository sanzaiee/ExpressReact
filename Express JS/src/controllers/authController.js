const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register user
const register = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const userRepository = req.AppDataSource.getRepository(User);

    const { name, email, password, address, phone } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.address = address;
    user.phone = phone;
    user.role = 'user';

    // Hash password
    await user.hashPassword();

    // Save user
    const savedUser = await userRepository.save(user);

    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser.id, email: savedUser.email, role: savedUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: savedUser.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const userRepository = req.AppDataSource.getRepository(User);

    const { email, password } = req.body;

    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
const getMe = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const userRepository = req.AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
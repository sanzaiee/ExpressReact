const express = require('express');
const cors = require('cors');
require('dotenv').config();

const AppDataSource = require('./config/database');
const { errorHandler, notFound } = require('./middleware/error');
const swaggerSpec = require('./config/swagger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Make database available to controllers
app.use((req, res, next) => {
  req.AppDataSource = AppDataSource;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});


app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Swagger Documentation
/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Redirect to Swagger UI documentation
 *     tags: [Documentation]
 *     responses:
 *       302:
 *         description: Redirects to Swagger UI
 */
app.get('/api/docs', (req, res) => {
  res.redirect('/api-docs');
});

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: Swagger UI documentation
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Returns Swagger UI HTML page
 */
app.use('/api-docs', require('swagger-ui-express').serve, require('swagger-ui-express').setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Express JS API Documentation'
}));

/**
 * @swagger
 * /api-docs.json:
 *   get:
 *     summary: Get OpenAPI specification in JSON format
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Returns OpenAPI specification JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection established successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`API Docs JSON: http://localhost:${PORT}/api-docs.json`);
    });
  } catch (error) {
    console.error('Error during server initialization:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
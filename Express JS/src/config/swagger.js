const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express JS API',
      version: '1.0.0',
      description: 'A comprehensive Express.js API with authentication, products, categories, and orders management',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the user',
              example: 1
            },
            name: {
              type: 'string',
              description: 'The name of the user',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email of the user',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              description: 'The password of the user (min 6 characters)',
              example: 'password123'
            },
            address: {
              type: 'string',
              description: 'The address of the user',
              example: '123 Main St, City, Country'
            },
            phone: {
              type: 'string',
              description: 'The phone number of the user',
              example: '+1234567890'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'The role of the user',
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the user was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the user was last updated'
            }
          }
        },
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the category',
              example: 1
            },
            name: {
              type: 'string',
              description: 'The name of the category',
              example: 'Electronics'
            },
            description: {
              type: 'string',
              description: 'The description of the category',
              example: 'Electronic devices and gadgets'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the category was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the category was last updated'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'price', 'categoryId'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the product',
              example: 1
            },
            name: {
              type: 'string',
              description: 'The name of the product',
              example: 'Laptop'
            },
            description: {
              type: 'string',
              description: 'The description of the product',
              example: 'High-performance laptop with 16GB RAM'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'The price of the product',
              example: 999.99
            },
            stock: {
              type: 'integer',
              description: 'The stock quantity of the product',
              example: 50
            },
            categoryId: {
              type: 'integer',
              description: 'The category id of the product',
              example: 1
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the product was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the product was last updated'
            }
          }
        },
        Order: {
          type: 'object',
          required: ['userId'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the order',
              example: 1
            },
            userId: {
              type: 'integer',
              description: 'The user id who placed the order',
              example: 1
            },
            totalAmount: {
              type: 'number',
              format: 'float',
              description: 'The total amount of the order',
              example: 1999.98
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              description: 'The status of the order',
              example: 'pending'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the order was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the order was last updated'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message description'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
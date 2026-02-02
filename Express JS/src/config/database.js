const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '2025_ecommerce_db',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    require('../models/User').UserSchema,
    require('../models/Category').CategorySchema,
    require('../models/Product').ProductSchema,
    require('../models/Order').OrderSchema
  ]
});

module.exports = AppDataSource;
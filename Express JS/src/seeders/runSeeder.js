require('dotenv').config();
const AppDataSource = require('../config/database');
const DatabaseSeeder = require('./DatabaseSeeder');

/**
 * Run database seeders
 * Usage: node src/seeders/runSeeder.js
 */
const runSeeders = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection established\n');

    // Run seeders
    await DatabaseSeeder.run(AppDataSource);

    // Close database connection
    await AppDataSource.destroy();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seeder execution failed:', error);
    process.exit(1);
  }
};

// Run seeders
runSeeders();

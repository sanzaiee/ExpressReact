const CategorySeeder = require('./CategorySeeder');
const ProductSeeder = require('./ProductSeeder');

class DatabaseSeeder {
  /**
   * Run all seeders in the correct order
   * @param {DataSource} AppDataSource - TypeORM DataSource instance
   */
  static async run(AppDataSource) {
    console.log('Starting database seeding...\n');

    try {
      // Seed categories first (products depend on categories)
      await CategorySeeder.run(AppDataSource);

      // Seed products after categories
      await ProductSeeder.run(AppDataSource);

      console.log('\n Database seeding completed successfully!');
    } catch (error) {
      console.error('Error during database seeding:', error);
      throw error;
    }
  }
}

module.exports = DatabaseSeeder;

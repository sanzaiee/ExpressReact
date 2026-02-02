# Database Seeders

This directory contains database seeders for populating your database with initial/test data, similar to Laravel's seeder system.

## Overview

Seeders allow you to populate your database with sample data for development and testing purposes. The seeder system follows a structure similar to Laravel:

- **CategorySeeder**: Seeds categories (must run first)
- **ProductSeeder**: Seeds products (depends on categories)
- **DatabaseSeeder**: Main seeder that runs all seeders in the correct order

## Usage

### Run All Seeders

To seed the database with all data:

```bash
npm run db:seed
```

or

```bash
npm run seed
```

You can also run the seeder directly:

```bash
node src/seeders/runSeeder.js
```

### Running Individual Seeders

If you need to run a specific seeder, you can create a custom script or modify `runSeeder.js`. For example, to run only the ProductSeeder:

```javascript
const ProductSeeder = require('./ProductSeeder');
const AppDataSource = require('../config/database');

(async () => {
  await AppDataSource.initialize();
  await ProductSeeder.run(AppDataSource);
  await AppDataSource.destroy();
})();
```

## Seeder Structure

### CategorySeeder

Seeds the following categories:
- Electronics
- Clothing
- Books
- Home & Garden
- Sports & Outdoors
- Toys & Games
- Food & Beverages
- Health & Beauty

**Note**: This seeder checks if categories already exist and skips seeding if they do.

### ProductSeeder

Seeds 15 sample products across different categories:
- Electronics (headphones, smartphones, laptop stands, etc.)
- Clothing (t-shirts, jeans, jackets)
- Books (programming and development books)
- Sports & Outdoors (running shoes, yoga mats)
- And more...

**Note**: This seeder requires categories to exist first. It checks if products already exist and skips seeding if they do.

## Creating Custom Seeders

To create a new seeder, follow this pattern:

```javascript
const YourModel = require('../models/YourModel');

class YourSeeder {
  /**
   * Run the seeder
   * @param {DataSource} AppDataSource - TypeORM DataSource instance
   */
  static async run(AppDataSource) {
    const repository = AppDataSource.getRepository(YourModel);

    // Check if data already exists
    const existingCount = await repository.count();
    if (existingCount > 0) {
      console.log('Data already exists. Skipping seeder.');
      return;
    }

    const data = [
      // Your data here
    ];

    for (const item of data) {
      const entity = new YourModel();
      // Set properties
      await repository.save(entity);
      console.log(`✓ Created: ${item.name}`);
    }

    console.log(`\n✅ Seeder completed. Created ${data.length} items.`);
  }
}

module.exports = YourSeeder;
```

Then add it to `DatabaseSeeder.js`:

```javascript
const YourSeeder = require('./YourSeeder');

class DatabaseSeeder {
  static async run(AppDataSource) {
    // ... other seeders
    await YourSeeder.run(AppDataSource);
  }
}
```

## Important Notes

1. **Order Matters**: Seeders run in a specific order. Categories must be seeded before products since products have a foreign key relationship with categories.

2. **Idempotent**: Seeders check if data already exists and skip if it does. This prevents duplicate data when running seeders multiple times.

3. **Database Connection**: The seeder runner initializes and closes the database connection automatically.

4. **Environment Variables**: Make sure your `.env` file is properly configured with database credentials before running seeders.

## Troubleshooting

### "No categories found" Error

If you see this error when running ProductSeeder, make sure CategorySeeder runs first. Run `npm run db:seed` to run all seeders in the correct order.

### Database Connection Errors

Ensure your `.env` file has the correct database configuration:
```
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=2025_ecommerce_db
```

### Duplicate Key Errors

If you encounter duplicate key errors, the seeder's existence check might not be working. You can manually clear the tables or modify the seeder to handle duplicates.

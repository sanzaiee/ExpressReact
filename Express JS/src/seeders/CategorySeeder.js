const Category = require('../models/Category');

class CategorySeeder {
  /**
   * Run the category seeder
   * @param {DataSource} AppDataSource - TypeORM DataSource instance
   */
  static async run(AppDataSource) {
    const categoryRepository = AppDataSource.getRepository(Category);

    // Check if categories already exist
    // const existingCategories = await categoryRepository.count();
    // if (existingCategories > 0) {
    //   console.log('Categories already exist. Skipping category seeder.');
    //   return;
    // }

    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics'
      },
      {
        name: 'Clothing',
        slug: 'clothing'
      },
      {
        name: 'Books',
        slug: 'books'
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden'
      },
      {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors'
      },
      {
        name: 'Toys & Games',
        slug: 'toys-games'
      },
      {
        name: 'Food & Beverages',
        slug: 'food-beverages'
      },
      {
        name: 'Health & Beauty',
        slug: 'health-beauty'
      }
    ];

    for (const categoryData of categories) {
      const category = new Category();
      category.name = categoryData.name;
      category.slug = categoryData.slug;

      const existingCategory = await categoryRepository.findOne({ where: { slug: categoryData.slug } });

      if (existingCategory) {
        console.log(`Category already exists: ${categoryData.name}. Skipping...`);
        continue;
      }

      await categoryRepository.save(category);
      console.log(` Created category: ${categoryData.name}`);
    }

    console.log(`\n Category seeder completed. Created ${categories.length} categories.`);
  }
}

module.exports = CategorySeeder;

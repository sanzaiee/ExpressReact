const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductSeeder {
  /**
   * Run the product seeder
   * @param {DataSource} AppDataSource - TypeORM DataSource instance
   */
  static async run(AppDataSource) {
    const productRepository = AppDataSource.getRepository(Product);
    const categoryRepository = AppDataSource.getRepository(Category);

    // Check if products already exist
    // const existingProducts = await productRepository.count();
    // if (existingProducts > 0) {
    //   console.log('Products already exist. Skipping product seeder.');
    //   return;
    // }

    // Get all categories
    const categories = await categoryRepository.find();
    if (categories.length === 0) {
      console.log('No categories found. Please run CategorySeeder first.');
      return;
    }

    // Sample products data
    const products = [
      {
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
        price: 99.99,
        stock: 50,
        categorySlug: 'electronics',
        images: ['headphones-1.jpg', 'headphones-2.jpg']
      },
      {
        name: 'Smartphone 128GB',
        slug: 'smartphone-128gb',
        description: 'Latest generation smartphone with 128GB storage, dual camera system, and fast charging capability.',
        price: 599.99,
        stock: 30,
        categorySlug: 'electronics',
        images: ['phone-1.jpg', 'phone-2.jpg']
      },
      {
        name: 'Laptop Stand Aluminum',
        slug: 'laptop-stand-aluminum',
        description: 'Ergonomic aluminum laptop stand that improves posture and provides better airflow for your laptop.',
        price: 49.99,
        stock: 75,
        categorySlug: 'electronics',
        images: ['stand-1.jpg']
      },
      {
        name: 'Cotton T-Shirt',
        slug: 'cotton-t-shirt',
        description: '100% organic cotton t-shirt, comfortable and breathable. Available in multiple colors.',
        price: 24.99,
        stock: 100,
        categorySlug: 'clothing',
        images: ['tshirt-1.jpg', 'tshirt-2.jpg']
      },
      {
        name: 'Denim Jeans',
        slug: 'denim-jeans',
        description: 'Classic fit denim jeans made from premium denim fabric. Durable and stylish.',
        price: 79.99,
        stock: 60,
        categorySlug: 'clothing',
        images: ['jeans-1.jpg']
      },
      {
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Lightweight running shoes with cushioned sole and breathable mesh upper. Perfect for daily runs.',
        price: 89.99,
        stock: 45,
        categorySlug: 'sports-outdoors',
        images: ['shoes-1.jpg', 'shoes-2.jpg']
      },
      {
        name: 'JavaScript: The Definitive Guide',
        slug: 'javascript-definitive-guide',
        description: 'Comprehensive guide to JavaScript programming. Covers ES6+ features and modern web development.',
        price: 49.99,
        stock: 25,
        categorySlug: 'books',
        images: ['book-js.jpg']
      },
      {
        name: 'Clean Code: A Handbook',
        slug: 'clean-code-handbook',
        description: 'Learn how to write clean, maintainable code. Essential reading for every developer.',
        price: 39.99,
        stock: 30,
        categorySlug: 'books',
        images: ['book-clean.jpg']
      },
      {
        name: 'Coffee Maker',
        slug: 'coffee-maker',
        description: 'Programmable coffee maker with 12-cup capacity and auto-shutoff feature.',
        price: 69.99,
        stock: 40,
        categorySlug: 'home-garden',
        images: ['coffee-1.jpg']
      },
      {
        name: 'Yoga Mat Premium',
        slug: 'yoga-mat-premium',
        description: 'Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and exercise routines.',
        price: 34.99,
        stock: 55,
        categorySlug: 'sports-outdoors',
        images: ['mat-1.jpg']
      },
      {
        name: 'Board Game Collection',
        slug: 'board-game-collection',
        description: 'Family-friendly board game collection with 5 popular games. Hours of fun for all ages.',
        price: 59.99,
        stock: 20,
        categorySlug: 'toys-games',
        images: ['games-1.jpg']
      },
      {
        name: 'Organic Green Tea',
        slug: 'organic-green-tea',
        description: 'Premium organic green tea leaves. Rich in antioxidants and naturally caffeine-free.',
        price: 19.99,
        stock: 80,
        categorySlug: 'food-beverages',
        images: ['tea-1.jpg']
      },
      {
        name: 'Face Moisturizer',
        slug: 'face-moisturizer',
        description: 'Hydrating face moisturizer with SPF 30. Suitable for all skin types.',
        price: 29.99,
        stock: 65,
        categorySlug: 'health-beauty',
        images: ['moisturizer-1.jpg']
      },
      {
        name: 'Wireless Mouse',
        slug: 'wireless-mouse',
        description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
        price: 24.99,
        stock: 90,
        categorySlug: 'electronics',
        images: ['mouse-1.jpg']
      },
      {
        name: 'Winter Jacket',
        slug: 'winter-jacket',
        description: 'Warm and waterproof winter jacket. Perfect for cold weather and outdoor activities.',
        price: 129.99,
        stock: 35,
        categorySlug: 'clothing',
        images: ['jacket-1.jpg', 'jacket-2.jpg']
      }
    ];

    let createdCount = 0;

    for (const productData of products) {
      // Find category by slug
      const category = categories.find(cat => cat.slug === productData.categorySlug);
      
      if (!category) {
        console.log(`Category not found for product: ${productData.name}. Skipping...`);
        continue;
      }

      const product = new Product();
      product.name = productData.name;
      product.slug = productData.slug;
      const existingProduct = await productRepository.findOne({ where: { slug: productData.slug } });
      if (existingProduct) {
        console.log(`Product already exists: ${productData.name}. Skipping...`);
        continue;
      }
      product.description = productData.description;
      product.price = productData.price;
      product.stock = productData.stock;
      product.category = category;
      product.images = productData.images || [];

      await productRepository.save(product);
      console.log(` Created product: ${productData.name}`);
      createdCount++;
    }

    console.log(`\n Product seeder completed. Created ${createdCount} products.`);
  }
}

module.exports = ProductSeeder;

const { EntitySchema } = require('typeorm');

class Product {
  constructor() {
    this.id = undefined;
    this.name = '';
    this.slug = '';
    this.description = '';
    this.price = 0;
    this.stock = 0;
    this.category = null;
  }
}

module.exports = Product;
module.exports.ProductSchema = new EntitySchema({
  name: 'Product',
  target: Product,
  tableName: 'products',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    name: {
      type: 'varchar'
    },
    slug: {
      type: 'varchar',
      unique: true
    },
    description: {
      type: 'text'
    },
    price: {
      type: 'decimal'
    },
    stock: {
      type: 'int'
    },
    images: {
      type: 'simple-array',
      nullable: true
    }
  },
  relations: {
    category: {
      target: 'Category',
      type: 'many-to-one',
      joinColumn: true,
      inverseSide: 'products'
    }
  }
});
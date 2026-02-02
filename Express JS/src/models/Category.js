const { EntitySchema } = require('typeorm');

class Category {
  constructor() {
    this.id = undefined;
    this.name = '';
    this.slug = '';
  }
}

module.exports = Category;
module.exports.CategorySchema = new EntitySchema({
  name: 'Category',
  target: Category,
  tableName: 'categories',
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
    }
  },
  relations: {
    products: {
      target: 'Product',
      type: 'one-to-many',
      inverseSide: 'category'
    }
  }
});
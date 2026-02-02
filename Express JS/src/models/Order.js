const { EntitySchema } = require('typeorm');

class Order {
  constructor() {
    this.id = undefined;
    this.user = null;
    this.products = [];
    this.totalAmount = 0;
    this.shippingAddress = '';
    this.paymentMethod = 'COD';
    this.status = 'pending';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

module.exports = Order;
module.exports.OrderSchema = new EntitySchema({
  name: 'Order',
  target: Order,
  tableName: 'orders',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    products: {
      type: 'simple-json'
    },
    totalAmount: {
      type: 'decimal'
    },
    shippingAddress: {
      type: 'varchar'
    },
    paymentMethod: {
      type: 'varchar',
      default: 'COD'
    },
    status: {
      type: 'varchar',
      default: 'pending'
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP'
    }
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: true,
      inverseSide: 'orders'
    }
  }
});
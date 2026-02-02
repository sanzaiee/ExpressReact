const { EntitySchema } = require('typeorm');
const bcrypt = require('bcryptjs');

class User {
  constructor() {
    this.id = undefined;
    this.name = '';
    this.email = '';
    this.password = '';
    this.address = '';
    this.phone = '';
    this.role = 'user';
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  // Compare password for login
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Remove password from response
  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}

module.exports = User;
module.exports.UserSchema = new EntitySchema({
  name: 'User',
  target: User,
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    name: {
      type: 'varchar'
    },
    email: {
      type: 'varchar',
      unique: true
    },
    password: {
      type: 'varchar'
    },
    address: {
      type: 'varchar'
    },
    phone: {
      type: 'varchar'
    },
    role: {
      type: 'varchar',
      default: 'user'
    }
  },
  relations: {
    orders: {
      target: 'Order',
      type: 'one-to-many',
      inverseSide: 'user'
    }
  }
});
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PackagePurchase = sequelize.define('PackagePurchase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'customer_id'
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'package_id'
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'trainer_id'
  },
  purchasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'purchase_price'
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    field: 'discount_amount'
  },
  sessionsRemaining: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sessions_remaining'
  },
  sessionsTotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sessions_total'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at'
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled', 'completed'),
    defaultValue: 'active'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded'),
    defaultValue: 'pending',
    field: 'payment_status'
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    field: 'payment_method'
  },
  transactionId: {
    type: DataTypes.STRING(100),
    field: 'transaction_id'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'package_purchases',
  timestamps: true
});

module.exports = PackagePurchase;
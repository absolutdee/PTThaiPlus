const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Trainer = sequelize.define('Trainer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  profilePicture: DataTypes.STRING,
  bio: DataTypes.TEXT,
  experience: DataTypes.INTEGER,
  specialties: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  serviceAreas: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  rating: {
    type: DataTypes.DECIMAL(2,1),
    defaultValue: 0
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  pricePerSession: DataTypes.DECIMAL(10,2),
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'trainers'
});

// Associations
Trainer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Trainer;
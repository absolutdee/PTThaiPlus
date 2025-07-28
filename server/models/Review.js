const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
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
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'trainer_id'
  },
  sessionId: {
    type: DataTypes.INTEGER,
    field: 'session_id'
  },
  packagePurchaseId: {
    type: DataTypes.INTEGER,
    field: 'package_purchase_id'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING(255)
  },
  comment: {
    type: DataTypes.TEXT
  },
  pros: {
    type: DataTypes.TEXT
  },
  cons: {
    type: DataTypes.TEXT
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_featured'
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_approved'
  },
  helpfulCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'helpful_count'
  },
  replyFromTrainer: {
    type: DataTypes.TEXT,
    field: 'reply_from_trainer'
  },
  repliedAt: {
    type: DataTypes.DATE,
    field: 'replied_at'
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  hooks: {
    afterCreate: async (review) => {
      // Update trainer rating
      const Trainer = require('./Trainer');
      const trainer = await Trainer.findByPk(review.trainerId);
      if (trainer) {
        await trainer.updateRating();
      }
    },
    afterUpdate: async (review) => {
      if (review.changed('rating') || review.changed('isApproved')) {
        const Trainer = require('./Trainer');
        const trainer = await Trainer.findByPk(review.trainerId);
        if (trainer) {
          await trainer.updateRating();
        }
      }
    }
  }
});

module.exports = Review;
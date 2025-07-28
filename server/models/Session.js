const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Session = sequelize.define('Session', {
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
  packagePurchaseId: {
    type: DataTypes.INTEGER,
    field: 'package_purchase_id'
  },
  sessionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'session_date'
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'duration_minutes'
  },
  sessionType: {
    type: DataTypes.ENUM('personal', 'group', 'online'),
    defaultValue: 'personal',
    field: 'session_type'
  },
  location: {
    type: DataTypes.STRING(255)
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'),
    defaultValue: 'scheduled'
  },
  notes: {
    type: DataTypes.TEXT
  },
  customerNotes: {
    type: DataTypes.TEXT,
    field: 'customer_notes'
  },
  exercises: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  performanceData: {
    type: DataTypes.JSON,
    field: 'performance_data'
  },
  trainerFeedback: {
    type: DataTypes.TEXT,
    field: 'trainer_feedback'
  },
  customerFeedback: {
    type: DataTypes.TEXT,
    field: 'customer_feedback'
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  caloriesBurned: {
    type: DataTypes.INTEGER,
    field: 'calories_burned'
  },
  cancelledBy: {
    type: DataTypes.ENUM('customer', 'trainer', 'system'),
    field: 'cancelled_by'
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    field: 'cancellation_reason'
  },
  rescheduledFrom: {
    type: DataTypes.INTEGER,
    field: 'rescheduled_from'
  }
}, {
  tableName: 'sessions',
  timestamps: true
});

module.exports = Session;
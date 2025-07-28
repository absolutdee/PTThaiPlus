// ================================
// server/config/database.js
// Database Configuration
// ================================

const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'fitconnect_db',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306,
    timezone: '+07:00',
    logging: console.log, // เปิด logging ใน development
    define: {
      timestamps: true,
      underscored: true, // ใช้ snake_case
      paranoid: true, // soft delete
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false, // ปิด logging ใน production
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    }
  }
};

const environment = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[environment]);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

module.exports = { sequelize, config, testConnection };

// ================================
// server/models/index.js  
// Models Index File
// ================================

const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Trainer = require('./Trainer');
const TrainerImage = require('./TrainerImage');
const Customer = require('./Customer');
const Package = require('./Package');
const PackagePurchase = require('./PackagePurchase');
const Session = require('./Session');
const Review = require('./Review');
const NutritionPlan = require('./NutritionPlan');
const ProgressRecord = require('./ProgressRecord');
const Message = require('./Message');
const Notification = require('./Notification');
const Article = require('./Article');
const Event = require('./Event');
const EventRegistration = require('./EventRegistration');
const Gym = require('./Gym');
const Partner = require('./Partner');
const Payment = require('./Payment');
const MediaFile = require('./MediaFile');
const SystemSetting = require('./SystemSetting');
const Coupon = require('./Coupon');
const CouponUsage = require('./CouponUsage');
const ActivityLog = require('./ActivityLog');
const NewsletterSubscription = require('./NewsletterSubscription');

// Define associations
const setupAssociations = () => {
  // User associations
  User.hasOne(Trainer, { foreignKey: 'user_id', as: 'trainer' });
  User.hasOne(Customer, { foreignKey: 'user_id', as: 'customer' });
  User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
  User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
  User.hasMany(Article, { foreignKey: 'author_id', as: 'articles' });
  User.hasMany(Event, { foreignKey: 'organizer_id', as: 'events' });

  // Trainer associations
  Trainer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Trainer.hasMany(TrainerImage, { foreignKey: 'trainer_id', as: 'images' });
  Trainer.hasMany(Package, { foreignKey: 'trainer_id', as: 'packages' });
  Trainer.hasMany(Session, { foreignKey: 'trainer_id', as: 'sessions' });
  Trainer.hasMany(Review, { foreignKey: 'trainer_id', as: 'reviews' });
  Trainer.hasMany(NutritionPlan, { foreignKey: 'trainer_id', as: 'nutritionPlans' });
  Trainer.hasMany(PackagePurchase, { foreignKey: 'trainer_id', as: 'sales' });

  // Customer associations  
  Customer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Customer.hasMany(Session, { foreignKey: 'customer_id', as: 'sessions' });
  Customer.hasMany(Review, { foreignKey: 'customer_id', as: 'reviews' });
  Customer.hasMany(PackagePurchase, { foreignKey: 'customer_id', as: 'purchases' });
  Customer.hasMany(NutritionPlan, { foreignKey: 'customer_id', as: 'nutritionPlans' });
  Customer.hasMany(ProgressRecord, { foreignKey: 'customer_id', as: 'progressRecords' });
  Customer.belongsTo(Customer, { foreignKey: 'referred_by', as: 'referrer' });

  // Package associations
  Package.belongsTo(Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
  Package.hasMany(PackagePurchase, { foreignKey: 'package_id', as: 'purchases' });

  // PackagePurchase associations
  PackagePurchase.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
  PackagePurchase.belongsTo(Package, { foreignKey: 'package_id', as: 'package' });
  PackagePurchase.belongsTo(Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
  PackagePurchase.hasMany(Session, { foreignKey: 'package_purchase_id', as: 'sessions' });

  // Session associations
  Session.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
  Session.belongsTo(Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
  Session.belongsTo(PackagePurchase, { foreignKey: 'package_purchase_id', as: 'packagePurchase' });
  Session.hasMany(Review, { foreignKey: 'session_id', as: 'reviews' });
  Session.belongsTo(Session, { foreignKey: 'rescheduled_from', as: 'originalSession' });

  // Review associations
  Review.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
  Review.belongsTo(Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
  Review.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });
  Review.belongsTo(PackagePurchase, { foreignKey: 'package_purchase_id', as: 'packagePurchase' });

  // Other associations
  TrainerImage.belongsTo(Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
  NutritionPlan.belongsTo(Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
  NutritionPlan.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
  ProgressRecord.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
  
  Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
  Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });
  Message.belongsTo(Message, { foreignKey: 'replied_to', as: 'originalMessage' });
  
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  
  Article.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
  
  Event.belongsTo(User, { foreignKey: 'organizer_id', as: 'organizer' });
  Event.hasMany(EventRegistration, { foreignKey: 'event_id', as: 'registrations' });
  
  EventRegistration.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
  EventRegistration.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  
  Payment.belongsTo(User, { foreignKey: 'payer_id', as: 'payer' });
  Payment.belongsTo(Trainer, { foreignKey: 'receiver_id', as: 'receiver' });
  
  MediaFile.belongsTo(User, { foreignKey: 'uploader_id', as: 'uploader' });
  
  Coupon.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  Coupon.hasMany(CouponUsage, { foreignKey: 'coupon_id', as: 'usages' });
  
  CouponUsage.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'coupon' });
  CouponUsage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  
  ActivityLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  
  NewsletterSubscription.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
};

// Initialize database
const initializeDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Setup associations
    setupAssociations();
    console.log('✅ Model associations set up successfully.');
    
    // Sync database (ระวัง: ใช้เฉพาะใน development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized successfully.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  initializeDatabase,
  setupAssociations,
  models: {
    User,
    Trainer,
    TrainerImage,
    Customer,
    Package,
    PackagePurchase,
    Session,
    Review,
    NutritionPlan,
    ProgressRecord,
    Message,
    Notification,
    Article,
    Event,
    EventRegistration,
    Gym,
    Partner,
    Payment,
    MediaFile,
    SystemSetting,
    Coupon,
    CouponUsage,
    ActivityLog,
    NewsletterSubscription
  }
};

// ================================
// server/models/User.js
// User Model
// ================================

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'trainer', 'customer'),
    allowNull: false,
    defaultValue: 'customer'
  },
  firstName: {
    type: DataTypes.STRING(100),
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(100),
    field: 'last_name'
  },
  displayName: {
    type: DataTypes.STRING(200),
    field: 'display_name'
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    field: 'date_of_birth'
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other')
  },
  profilePicture: {
    type: DataTypes.STRING(255),
    field: 'profile_picture'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'email_verified'
  },
  emailVerifiedAt: {
    type: DataTypes.DATE,
    field: 'email_verified_at'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    field: 'last_login_at'
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
      if (user.firstName && user.lastName && !user.displayName) {
        user.displayName = `${user.firstName} ${user.lastName}`;
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
      if ((user.changed('firstName') || user.changed('lastName')) && !user.displayName) {
        user.displayName = `${user.firstName} ${user.lastName}`;
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.toSafeObject = function() {
  const { password, ...safeUser } = this.toJSON();
  return safeUser;
};

User.prototype.getFullName = function() {
  return this.displayName || `${this.firstName || ''} ${this.lastName || ''}`.trim();
};

module.exports = User;

// ================================
// server/models/Trainer.js
// Trainer Model
// ================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trainer = sequelize.define('Trainer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  bio: {
    type: DataTypes.TEXT
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'experience_years'
  },
  specialties: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  education: {
    type: DataTypes.TEXT
  },
  languages: {
    type: DataTypes.JSON,
    defaultValue: ['Thai']
  },
  serviceAreas: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'service_areas'
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_reviews'
  },
  totalSessions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_sessions'
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'base_price'
  },
  minPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'min_price'
  },
  maxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'max_price'
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_featured'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_available'
  },
  availabilitySchedule: {
    type: DataTypes.JSON,
    field: 'availability_schedule'
  },
  socialMedia: {
    type: DataTypes.JSON,
    field: 'social_media'
  },
  bankAccount: {
    type: DataTypes.JSON,
    field: 'bank_account'
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    field: 'total_earnings'
  },
  commissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.00,
    field: 'commission_rate'
  }
}, {
  tableName: 'trainers',
  timestamps: true,
  paranoid: true
});

// Instance methods
Trainer.prototype.updateRating = async function() {
  const Review = require('./Review');
  const ratings = await Review.findAll({
    where: { trainerId: this.id, isApproved: true },
    attributes: ['rating']
  });
  
  if (ratings.length > 0) {
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    this.rating = Math.round(avgRating * 100) / 100;
    this.totalReviews = ratings.length;
    await this.save();
  }
};

module.exports = Trainer;

// ================================
// server/models/Customer.js  
// Customer Model
// ================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  height: {
    type: DataTypes.DECIMAL(5, 2) // cm
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2) // kg
  },
  fitnessLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner',
    field: 'fitness_level'
  },
  fitnessGoals: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'fitness_goals'
  },
  medicalConditions: {
    type: DataTypes.TEXT,
    field: 'medical_conditions'
  },
  emergencyContact: {
    type: DataTypes.JSON,
    field: 'emergency_contact'
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  totalSessions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_sessions'
  },
  totalSpent: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    field: 'total_spent'
  },
  membershipLevel: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
    defaultValue: 'bronze',
    field: 'membership_level'
  },
  referralCode: {
    type: DataTypes.STRING(20),
    unique: true,
    field: 'referral_code'
  },
  referredBy: {
    type: DataTypes.INTEGER,
    field: 'referred_by'
  }
}, {
  tableName: 'customers',
  timestamps: true,
  paranoid: true,
  hooks: {
    beforeCreate: async (customer) => {
      if (!customer.referralCode) {
        // Generate unique referral code
        const User = require('./User');
        const user = await User.findByPk(customer.userId);
        if (user && user.firstName) {
          customer.referralCode = `${user.firstName.toUpperCase()}${Date.now().toString().slice(-4)}`;
        }
      }
    }
  }
});

// Instance methods
Customer.prototype.updateMembershipLevel = function() {
  if (this.totalSpent >= 100000) {
    this.membershipLevel = 'platinum';
  } else if (this.totalSpent >= 50000) {
    this.membershipLevel = 'gold';
  } else if (this.totalSpent >= 20000) {
    this.membershipLevel = 'silver';
  } else {
    this.membershipLevel = 'bronze';
  }
};

Customer.prototype.getBMI = function() {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    return Math.round((this.weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }
  return null;
};

module.exports = Customer;

// ================================
// server/models/Package.js
// Package Model  
// ================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'trainer_id'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'original_price'
  },
  sessionsCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sessions_count'
  },
  sessionDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'session_duration'
  },
  validityDays: {
    type: DataTypes.INTEGER,
    defaultValue: 90,
    field: 'validity_days'
  },
  packageType: {
    type: DataTypes.ENUM('personal', 'group', 'online', 'hybrid'),
    defaultValue: 'personal',
    field: 'package_type'
  },
  difficultyLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner',
    field: 'difficulty_level'
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'max_participants'
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  includes: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  excludes: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  requirements: {
    type: DataTypes.TEXT
  },
  isRecommended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_recommended'
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_popular'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'sort_order'
  },
  totalSold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_sold'
  }
}, {
  tableName: 'packages',
  timestamps: true,
  paranoid: true
});

// Instance methods
Package.prototype.getDiscountPercentage = function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
};

Package.prototype.getPricePerSession = function() {
  return Math.round((this.price / this.sessionsCount) * 100) / 100;
};

module.exports = Package;
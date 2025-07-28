const mysql = require('mysql2/promise');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,  
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'fitconnect_db',
  timezone: '+07:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Database connection pool ready');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Simple models using raw MySQL queries
const models = {
  // User model
  User: {
    async findByEmail(email) {
      try {
        const [rows] = await pool.execute(
          'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
          [email]
        );
        return rows[0] || null;
      } catch (error) {
        console.error('User.findByEmail error:', error);
        throw error;
      }
    },

    async findById(id) {
      try {
        const [rows] = await pool.execute(
          'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
          [id]
        );
        return rows[0] || null;
      } catch (error) {
        console.error('User.findById error:', error);
        throw error;
      }
    },

    async create(userData) {
      try {
        const [result] = await pool.execute(
          `INSERT INTO users (email, password, role, first_name, last_name, display_name, phone, is_active, email_verified) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userData.email,
            userData.password,
            userData.role || 'customer',
            userData.firstName || '',
            userData.lastName || '',
            userData.displayName || `${userData.firstName} ${userData.lastName}`,
            userData.phone || '',
            userData.isActive !== false,
            userData.emailVerified || false
          ]
        );
        
        return { id: result.insertId, ...userData };
      } catch (error) {
        console.error('User.create error:', error);
        throw error;
      }
    }
  },

  // Trainer model
  Trainer: {
    async findAll(options = {}) {
      try {
        let query = `
          SELECT t.*, u.first_name, u.last_name, u.display_name, u.profile_picture
          FROM trainers t
          JOIN users u ON t.user_id = u.id
          WHERE t.deleted_at IS NULL AND u.deleted_at IS NULL
        `;
        
        const params = [];
        
        if (options.available) {
          query += ' AND t.is_available = true';
        }
        
        if (options.verified) {
          query += ' AND t.is_verified = true';
        }
        
        if (options.limit) {
          query += ' LIMIT ?';
          params.push(parseInt(options.limit));
        }
        
        query += ' ORDER BY t.is_featured DESC, t.rating DESC';
        
        const [rows] = await pool.execute(query, params);
        return rows;
      } catch (error) {
        console.error('Trainer.findAll error:', error);
        throw error;
      }
    },

    async findById(id) {
      try {
        const [rows] = await pool.execute(
          `SELECT t.*, u.first_name, u.last_name, u.display_name, u.profile_picture, u.phone, u.email
           FROM trainers t
           JOIN users u ON t.user_id = u.id
           WHERE t.id = ? AND t.deleted_at IS NULL AND u.deleted_at IS NULL`,
          [id]
        );
        return rows[0] || null;
      } catch (error) {
        console.error('Trainer.findById error:', error);
        throw error;
      }
    }
  },

  // Package model
  Package: {
    async findByTrainerId(trainerId) {
      try {
        const [rows] = await pool.execute(
          'SELECT * FROM packages WHERE trainer_id = ? AND is_active = true AND deleted_at IS NULL ORDER BY is_recommended DESC, sort_order ASC',
          [trainerId]
        );
        return rows;
      } catch (error) {
        console.error('Package.findByTrainerId error:', error);
        throw error;
      }
    }
  }
};

// Initialize database connection
const initializeDatabase = async () => {
  try {
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      return false;
    }
    
    console.log('✅ Database models initialized');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
};

module.exports = {
  pool,
  models,
  initializeDatabase,
  testConnection,
  ...models
};
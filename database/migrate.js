const mysql = require('mysql2/promise');
require('dotenv').config();

const migrate = async () => {
  let connection;
  
  try {
    console.log('🔄 Starting database migration...');
    
    // Create connection (without database first)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      timezone: '+07:00',
      multipleStatements: true
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Create database if not exists (ใช้ query แทน execute)
    const dbName = process.env.DB_DATABASE || 'fitconnect_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' created or already exists`);
    
    // Close connection and reconnect with database
    await connection.end();
    
    // Reconnect with database specified
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName, // เชื่อมต่อโดยระบุ database ตรงนี้
      timezone: '+07:00',
      multipleStatements: true
    });
    
    console.log(`✅ Connected to database '${dbName}'`);
    
    // Execute the complete schema
    console.log('🔧 Creating database tables...');
    await createTables(connection);
    
    console.log('✅ Schema migration completed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    
    // Specific error messages
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure MySQL is running in XAMPP Control Panel');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Check your database credentials in .env file');
    } else if (error.code === 'ER_DBACCESS_DENIED_ERROR') {
      console.log('💡 User does not have permission to create database');
      console.log('💡 Create database manually or use root user');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
};

// Create all tables function (ใช้ query แทน execute สำหรับคำสั่งพิเศษ)
const createTables = async (connection) => {
  console.log('📋 Creating tables...');
  
  try {
    // Users table
    console.log('  ➤ Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'trainer', 'customer') NOT NULL DEFAULT 'customer',
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        display_name VARCHAR(200),
        phone VARCHAR(20),
        date_of_birth DATE,
        gender ENUM('male', 'female', 'other'),
        profile_picture VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        email_verified_at TIMESTAMP NULL,
        last_login_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Trainers table
    console.log('  ➤ Creating trainers table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS trainers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        bio TEXT,
        experience_years INT DEFAULT 0,
        specialties JSON,
        certifications JSON,
        education TEXT,
        languages JSON,
        service_areas JSON,
        rating DECIMAL(3,2) DEFAULT 0.00,
        total_reviews INT DEFAULT 0,
        total_sessions INT DEFAULT 0,
        base_price DECIMAL(10,2),
        min_price DECIMAL(10,2),
        max_price DECIMAL(10,2),
        is_featured BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        is_available BOOLEAN DEFAULT TRUE,
        availability_schedule JSON,
        social_media JSON,
        bank_account JSON,
        total_earnings DECIMAL(15,2) DEFAULT 0.00,
        commission_rate DECIMAL(5,2) DEFAULT 10.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_rating (rating),
        INDEX idx_featured (is_featured),
        INDEX idx_verified (is_verified),
        INDEX idx_available (is_available)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Customers table
    console.log('  ➤ Creating customers table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        height DECIMAL(5,2),
        weight DECIMAL(5,2),
        fitness_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
        fitness_goals JSON,
        medical_conditions TEXT,
        emergency_contact JSON,
        preferences JSON,
        total_sessions INT DEFAULT 0,
        total_spent DECIMAL(15,2) DEFAULT 0.00,
        membership_level ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
        referral_code VARCHAR(20) UNIQUE,
        referred_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (referred_by) REFERENCES customers(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_level (fitness_level),
        INDEX idx_membership (membership_level),
        INDEX idx_referral (referral_code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Packages table
    console.log('  ➤ Creating packages table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        trainer_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        sessions_count INT NOT NULL,
        session_duration INT NOT NULL,
        validity_days INT DEFAULT 90,
        package_type ENUM('personal', 'group', 'online', 'hybrid') DEFAULT 'personal',
        difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
        max_participants INT DEFAULT 1,
        features JSON,
        includes JSON,
        excludes JSON,
        requirements TEXT,
        is_recommended BOOLEAN DEFAULT FALSE,
        is_popular BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        total_sold INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        
        FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
        INDEX idx_trainer_id (trainer_id),
        INDEX idx_price (price),
        INDEX idx_type (package_type),
        INDEX idx_recommended (is_recommended),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Package Purchases table
    console.log('  ➤ Creating package_purchases table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS package_purchases (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        package_id INT NOT NULL,
        trainer_id INT NOT NULL,
        purchase_price DECIMAL(10,2) NOT NULL,
        discount_amount DECIMAL(10,2) DEFAULT 0.00,
        sessions_remaining INT NOT NULL,
        sessions_total INT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        status ENUM('active', 'expired', 'cancelled', 'completed') DEFAULT 'active',
        payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
        payment_method VARCHAR(50),
        transaction_id VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
        FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
        INDEX idx_customer_id (customer_id),
        INDEX idx_package_id (package_id),
        INDEX idx_trainer_id (trainer_id),
        INDEX idx_status (status),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Sessions table  
    console.log('  ➤ Creating sessions table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        trainer_id INT NOT NULL,
        package_purchase_id INT,
        session_date DATETIME NOT NULL,
        duration_minutes INT NOT NULL,
        session_type ENUM('personal', 'group', 'online') DEFAULT 'personal',
        location VARCHAR(255),
        status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
        notes TEXT,
        customer_notes TEXT,
        exercises JSON,
        performance_data JSON,
        trainer_feedback TEXT,
        customer_feedback TEXT,
        rating INT,
        calories_burned INT,
        cancelled_by ENUM('customer', 'trainer', 'system'),
        cancellation_reason TEXT,
        rescheduled_from INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
        FOREIGN KEY (package_purchase_id) REFERENCES package_purchases(id) ON DELETE SET NULL,
        FOREIGN KEY (rescheduled_from) REFERENCES sessions(id) ON DELETE SET NULL,
        INDEX idx_customer_id (customer_id),
        INDEX idx_trainer_id (trainer_id),
        INDEX idx_session_date (session_date),
        INDEX idx_status (status),
        CONSTRAINT chk_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Reviews table
    console.log('  ➤ Creating reviews table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        trainer_id INT NOT NULL,
        session_id INT,
        package_purchase_id INT,
        rating INT NOT NULL,
        title VARCHAR(255),
        comment TEXT,
        pros TEXT,
        cons TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        is_approved BOOLEAN DEFAULT TRUE,
        helpful_count INT DEFAULT 0,
        reply_from_trainer TEXT,
        replied_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL,
        FOREIGN KEY (package_purchase_id) REFERENCES package_purchases(id) ON DELETE SET NULL,
        INDEX idx_customer_id (customer_id),
        INDEX idx_trainer_id (trainer_id),
        INDEX idx_rating (rating),
        INDEX idx_approved (is_approved),
        INDEX idx_created (created_at),
        CONSTRAINT chk_review_rating CHECK (rating >= 1 AND rating <= 5)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Messages table
    console.log('  ➤ Creating messages table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        conversation_id VARCHAR(100) NOT NULL,
        message_type ENUM('text', 'image', 'file', 'system') DEFAULT 'text',
        content TEXT,
        file_url VARCHAR(255),
        file_name VARCHAR(255),
        file_size INT,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP NULL,
        replied_to INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (replied_to) REFERENCES messages(id) ON DELETE SET NULL,
        INDEX idx_conversation (conversation_id),
        INDEX idx_sender (sender_id),
        INDEX idx_receiver (receiver_id),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Notifications table
    console.log('  ➤ Creating notifications table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        notification_type ENUM(
          'session_reminder', 'session_cancelled', 'session_rescheduled',
          'new_message', 'payment_received', 'review_received',
          'package_expired', 'system_update', 'promotion'
        ) NOT NULL,
        related_id INT,
        action_url VARCHAR(255),
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP NULL,
        priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
        expires_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_type (notification_type),
        INDEX idx_read (is_read),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ All tables created successfully');
    
    // Create indexes for better performance
    console.log('🔧 Creating additional indexes...');
    await connection.query(`
      CREATE INDEX IF NOT EXISTS idx_trainer_rating_available ON trainers(rating DESC, is_available, is_verified)
    `);
    await connection.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_trainer_date ON sessions(trainer_id, session_date)
    `);
    await connection.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_customer_date ON sessions(customer_id, session_date)
    `);
    
    console.log('✅ Additional indexes created');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
};

// Run migration if called directly
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('🎉 Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = migrate;

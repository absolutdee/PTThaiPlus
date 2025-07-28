const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seed = async () => {
  let connection;
  
  try {
    console.log('🌱 Starting safe database seeding...');
    
    // Create connection with database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'fitconnect_db',
      timezone: '+07:00',
      multipleStatements: true
    });
    
    console.log('✅ Connected to database');
    
    // Check if data already exists
    const [existingUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
    
    if (existingUsers[0].count > 0) {
      console.log(`⚠️  Found ${existingUsers[0].count} existing users`);
      console.log('🔄 Clearing existing sample data...');
      
      // Clear existing sample data (in correct order due to foreign keys)
      await clearExistingData(connection);
    }
    
    // Insert fresh sample data
    await insertSampleData(connection);
    
    console.log('✅ Database seeding completed successfully');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('💡 Run migration first: npm run migrate');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Database does not exist. Run migration first.');
    } else if (error.code === 'ER_DUP_ENTRY') {
      console.log('💡 Data already exists. Use: npm run reset-seed');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
};

const clearExistingData = async (connection) => {
  try {
    console.log('🧹 Clearing existing data...');
    
    // Delete in correct order (child tables first)
    await connection.execute('DELETE FROM sessions WHERE id BETWEEN 1 AND 100');
    await connection.execute('DELETE FROM reviews WHERE id BETWEEN 1 AND 100');
    await connection.execute('DELETE FROM packages WHERE id BETWEEN 1 AND 100');
    await connection.execute('DELETE FROM customers WHERE id BETWEEN 1 AND 100');
    await connection.execute('DELETE FROM trainers WHERE id BETWEEN 1 AND 100');
    await connection.execute('DELETE FROM users WHERE id BETWEEN 1 AND 100');
    
    // Reset auto increment
    await connection.execute('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE trainers AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE customers AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE packages AUTO_INCREMENT = 1');
    
    console.log('✅ Existing data cleared');
    
  } catch (error) {
    console.log('⚠️  Error clearing data (this is usually okay):', error.message);
  }
};

const insertSampleData = async (connection) => {
  try {
    // Hash password for all users
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    console.log('👥 Inserting users...');
    
    // Insert users using REPLACE INTO (safer than INSERT)
    await connection.execute(`
      REPLACE INTO users (id, email, password, role, first_name, last_name, display_name, phone, is_active, email_verified, email_verified_at) 
      VALUES (1, 'admin@fitconnect.com', ?, 'admin', 'Admin', 'System', 'Admin System', '02-000-0000', TRUE, TRUE, NOW())
    `, [hashedPassword]);
    
    await connection.execute(`
      REPLACE INTO users (id, email, password, role, first_name, last_name, display_name, phone, is_active, email_verified, email_verified_at) 
      VALUES (10, 'john.trainer@fitconnect.com', ?, 'trainer', 'จอห์น', 'ฟิตเนส', 'จอห์น ฟิตเนส', '081-111-1111', TRUE, TRUE, NOW())
    `, [hashedPassword]);
    
    await connection.execute(`
      REPLACE INTO users (id, email, password, role, first_name, last_name, display_name, phone, is_active, email_verified, email_verified_at) 
      VALUES (11, 'sara.trainer@fitconnect.com', ?, 'trainer', 'ซาร่า', 'แข็งแรง', 'ซาร่า แข็งแรง', '081-222-2222', TRUE, TRUE, NOW())
    `, [hashedPassword]);
    
    await connection.execute(`
      REPLACE INTO users (id, email, password, role, first_name, last_name, display_name, phone, is_active, email_verified, email_verified_at) 
      VALUES (20, 'somchai@example.com', ?, 'customer', 'สมชาย', 'ใจดี', 'สมชาย ใจดี', '082-111-1111', TRUE, TRUE, NOW())
    `, [hashedPassword]);
    
    await connection.execute(`
      REPLACE INTO users (id, email, password, role, first_name, last_name, display_name, phone, is_active, email_verified, email_verified_at) 
      VALUES (21, 'somying@example.com', ?, 'customer', 'สมหญิง', 'ใจงาม', 'สมหญิง ใจงาม', '082-222-2222', TRUE, TRUE, NOW())
    `, [hashedPassword]);
    
    console.log('🏋️ Inserting trainers...');
    
    // Insert trainers
    await connection.execute(`
      REPLACE INTO trainers (id, user_id, bio, experience_years, specialties, certifications, education, languages, service_areas, rating, total_reviews, total_sessions, base_price, min_price, max_price, is_featured, is_verified, is_available) 
      VALUES (1, 10, 'เทรนเนอร์มืออาชีพด้วยประสบการณ์กว่า 8 ปี เชี่ยวชาญการเพิ่มกล้ามเนื้อและการลดน้ำหนัก', 8, ?, ?, 'ปริญญาตรี วิทยาศาสตร์การกีฬา จุฬาลงกรณ์มหาวิทยาลัย', ?, ?, 4.8, 50, 100, 1500.00, 1200.00, 2000.00, TRUE, TRUE, TRUE)
    `, [
      JSON.stringify(['Weight Training', 'Muscle Building', 'Fat Loss']),
      JSON.stringify([{name: 'ACSM Certified Personal Trainer', year: 2020}]),
      JSON.stringify(['Thai', 'English']),
      JSON.stringify(['Bangkok', 'Samut Prakan', 'Nonthaburi'])
    ]);
    
    await connection.execute(`
      REPLACE INTO trainers (id, user_id, bio, experience_years, specialties, certifications, education, languages, service_areas, rating, total_reviews, total_sessions, base_price, min_price, max_price, is_featured, is_verified, is_available) 
      VALUES (2, 11, 'เทรนเนอร์หญิงมืออาชีพ เชี่ยวชาญโยคะ พิลาทิส และการออกแบบโปรแกรมสำหรับผู้หญิง', 6, ?, ?, 'ปริญญาโท สาธารณสุขศาสตร์ มหาวิทยาลัยรามคำแหง', ?, ?, 4.9, 75, 80, 1300.00, 1000.00, 1800.00, TRUE, TRUE, TRUE)
    `, [
      JSON.stringify(['Yoga', 'Pilates', 'Women Fitness']),
      JSON.stringify([{name: 'RYT 500 Yoga Alliance', year: 2019}]),
      JSON.stringify(['Thai', 'English']),
      JSON.stringify(['Bangkok', 'Pathum Thani'])
    ]);
    
    console.log('👤 Inserting customers...');
    
    // Insert customers
    await connection.execute(`
      REPLACE INTO customers (id, user_id, height, weight, fitness_level, fitness_goals, medical_conditions, emergency_contact, preferences, total_sessions, total_spent, membership_level, referral_code, referred_by) 
      VALUES (1, 20, 175.00, 78.50, 'beginner', ?, NULL, ?, ?, 0, 0.00, 'bronze', 'SOMCHAI2024', NULL)
    `, [
      JSON.stringify(['lose_weight', 'build_muscle']),
      JSON.stringify({name: 'สมใจ ใจดี', phone: '082-111-1112', relationship: 'พี่ชาย'}),
      JSON.stringify({preferred_time: 'evening', music: 'pop'})
    ]);
    
    await connection.execute(`
      REPLACE INTO customers (id, user_id, height, weight, fitness_level, fitness_goals, medical_conditions, emergency_contact, preferences, total_sessions, total_spent, membership_level, referral_code, referred_by) 
      VALUES (2, 21, 160.00, 55.00, 'intermediate', ?, NULL, ?, ?, 0, 0.00, 'bronze', 'SOMYING2024', NULL)
    `, [
      JSON.stringify(['improve_flexibility', 'stress_relief']),
      JSON.stringify({name: 'สมศักดิ์ ใจงาม', phone: '082-222-2223', relationship: 'สามี'}),
      JSON.stringify({preferred_time: 'morning', style: 'yoga'})
    ]);
    
    console.log('📦 Inserting packages...');
    
    // Insert packages
    await connection.execute(`
      REPLACE INTO packages (id, trainer_id, name, description, price, original_price, sessions_count, session_duration, validity_days, package_type, difficulty_level, max_participants, features, includes, excludes, is_recommended, is_popular, is_active, sort_order, total_sold) 
      VALUES (1, 1, 'Muscle Building Starter', 'แพคเกจเพิ่มกล้ามเนื้อสำหรับผู้เริ่มต้น ครอบคลุมการฝึกพื้นฐานและการดูแลโภชนาการ', 4500.00, 5000.00, 4, 60, 60, 'personal', 'beginner', 1, ?, ?, ?, TRUE, TRUE, TRUE, 1, 10)
    `, [
      JSON.stringify(['Personal Training Plan', 'Nutrition Guide', 'Progress Tracking']),
      JSON.stringify(['4 เซสชั่นส่วนตัว', 'แผนโภชนาการ', 'การติดตามผล', 'คำปรึกษาผ่านแชท']),
      JSON.stringify(['อาหารเสริม', 'อุปกรณ์ออกกำลังกาย'])
    ]);
    
    await connection.execute(`
      REPLACE INTO packages (id, trainer_id, name, description, price, original_price, sessions_count, session_duration, validity_days, package_type, difficulty_level, max_participants, features, includes, excludes, is_recommended, is_popular, is_active, sort_order, total_sold) 
      VALUES (2, 2, 'Yoga for Beginners', 'โยคะสำหรับผู้เริ่มต้น เรียนรู้ท่าพื้นฐานและการหายใจ', 3200.00, 4000.00, 4, 60, 45, 'personal', 'beginner', 1, ?, ?, ?, TRUE, FALSE, TRUE, 1, 15)
    `, [
      JSON.stringify(['Basic Yoga Poses', 'Breathing Techniques', 'Relaxation Methods']),
      JSON.stringify(['4 เซสชั่นโยคะส่วนตัว', 'คู่มือท่าโยคะ', 'แผ่น CD สำหรับฝึกที่บ้าน']),
      JSON.stringify(['อุปกรณ์โยคะ', 'เสื่อโยคะ'])
    ]);
    
    await connection.execute(`
      REPLACE INTO packages (id, trainer_id, name, description, price, original_price, sessions_count, session_duration, validity_days, package_type, difficulty_level, max_participants, features, includes, excludes, is_recommended, is_popular, is_active, sort_order, total_sold) 
      VALUES (3, 1, 'Weight Loss Program', 'โปรแกรมลดน้ำหนักแบบครบวงจร เปลี่ยนแปลงรูปร่างใน 8 สัปดาห์', 8000.00, 10000.00, 8, 60, 90, 'personal', 'intermediate', 1, ?, ?, ?, FALSE, TRUE, TRUE, 2, 25)
    `, [
      JSON.stringify(['Weight Loss Plan', 'Cardio Training', 'Diet Management']),
      JSON.stringify(['8 เซสชั่นส่วนตัว', 'แผนอาหารลดน้ำหนัก', 'การวัดผล', 'คำปรึกษา 24/7']),
      JSON.stringify(['อาหาร', 'อาหารเสริม', 'ยิมเมมเบอร์ชิป'])
    ]);
    
    console.log('🎉 Sample data inserted successfully');
    console.log('\n🔑 Test accounts created:');
    console.log('   Admin: admin@fitconnect.com / admin123');
    console.log('   Trainer: john.trainer@fitconnect.com / admin123');
    console.log('   Trainer: sara.trainer@fitconnect.com / admin123');
    console.log('   Customer: somchai@example.com / admin123');
    console.log('   Customer: somying@example.com / admin123');
    
  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
};

// Run seeding if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seed;
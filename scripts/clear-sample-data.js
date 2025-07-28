const mysql = require('mysql2/promise');
require('dotenv').config();

const clearSampleData = async () => {
  let connection;
  
  try {
    console.log('🧹 Clearing sample data...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'fitconnect_db',
      timezone: '+07:00'
    });
    
    // Delete sample data in correct order
    console.log('🗑️  Removing sessions...');
    await connection.execute('DELETE FROM sessions WHERE id BETWEEN 1 AND 100');
    
    console.log('🗑️  Removing reviews...');
    await connection.execute('DELETE FROM reviews WHERE id BETWEEN 1 AND 100');
    
    console.log('🗑️  Removing packages...');
    await connection.execute('DELETE FROM packages WHERE id BETWEEN 1 AND 100');
    
    console.log('🗑️  Removing customers...');
    await connection.execute('DELETE FROM customers WHERE id BETWEEN 1 AND 100');
    
    console.log('🗑️  Removing trainers...');
    await connection.execute('DELETE FROM trainers WHERE id BETWEEN 1 AND 100');
    
    console.log('🗑️  Removing users...');
    await connection.execute('DELETE FROM users WHERE id BETWEEN 1 AND 100');
    
    // Reset auto increment counters
    console.log('🔄 Resetting auto increment...');
    await connection.execute('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE trainers AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE customers AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE packages AUTO_INCREMENT = 1');
    
    console.log('✅ Sample data cleared successfully');
    console.log('💡 You can now run: npm run seed');
    
  } catch (error) {
    console.error('❌ Clear failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

if (require.main === module) {
  clearSampleData();
}

module.exports = clearSampleData;
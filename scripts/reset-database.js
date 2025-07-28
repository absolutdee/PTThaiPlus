const mysql = require('mysql2/promise');
require('dotenv').config();

const resetDatabase = async () => {
  let connection;
  
  try {
    console.log('🔄 Resetting database completely...\n');
    
    // Create connection without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      timezone: '+07:00'
    });
    
    const dbName = process.env.DB_DATABASE || 'fitconnect_db';
    
    console.log('🗑️  Dropping existing database...');
    await connection.execute(`DROP DATABASE IF EXISTS \`${dbName}\``);
    
    console.log('🏗️  Creating fresh database...');
    await connection.execute(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    console.log('✅ Database reset completed');
    console.log('\n📝 Next steps:');
    console.log('   1. npm run migrate');
    console.log('   2. npm run seed');
    console.log('   3. npm run dev');
    
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;

const axios = require('axios').default;

const quickTest = async () => {
  const baseURL = 'http://localhost:3001';
  
  console.log('🧪 Running quick API tests...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthRes = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Health check:', healthRes.data.message);
    
    // Test 2: Database test
    console.log('\n2️⃣ Testing database connection...');
    const dbRes = await axios.get(`${baseURL}/api/db-test`);
    console.log('✅ Database test:', dbRes.data.message);
    console.log('📊 User count:', dbRes.data.userCount);
    
    // Test 3: Login test
    console.log('\n3️⃣ Testing login...');
    const loginRes = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'admin@fitconnect.com',
      password: 'admin123'
    });
    console.log('✅ Login test:', loginRes.data.message);
    console.log('👤 User role:', loginRes.data.user.role);
    
    // Test 4: Trainers test
    console.log('\n4️⃣ Testing trainers endpoint...');
    const trainersRes = await axios.get(`${baseURL}/api/trainers`);
    console.log('✅ Trainers test:', trainersRes.data.success);
    console.log('🏋️ Trainers count:', trainersRes.data.data.total);
    
    console.log('\n🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data?.message || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running: npm run dev');
    }
  }
};

if (require.main === module) {
  quickTest();
}

module.exports = quickTest;
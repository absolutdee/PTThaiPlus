// mockApiService.js - Mock API สำหรับทดสอบ Frontend
// วางไฟล์นี้ในโฟลเดอร์ src/services/

// Mock data สำหรับทดสอบ
const mockData = {
  users: {
    'user123': {
      id: 'user123',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      name: 'สมชาย ใจดี',
      email: 'somchai@example.com',
      phone: '081-234-5678',
      profileImage: null,
      dateOfBirth: '1990-05-15',
      gender: 'male',
      height: 175,
      weight: 70,
      fitnessGoal: 'muscle_gain',
      experience: 'beginner',
      medicalConditions: [],
      createdAt: '2024-01-15',
      lastActive: new Date().toISOString()
    }
  },
  badgeCounts: {
    'user123': {
      scheduleCount: 3,
      messagesCount: 2,
      notificationsCount: 5,
      couponsCount: 1
    }
  },
  packages: {
    'user123': {
      id: 'pkg001',
      name: 'แพคเกจเพิ่มมวลกล้ามเนื้อ',
      trainer: {
        id: 'trainer001',
        name: 'โค้ชมาร์ค',
        avatar: null,
        specialization: 'การเพิ่มกล้ามเนื้อ'
      },
      duration: '3 เดือน',
      sessionsTotal: 24,
      sessionsCompleted: 8,
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      status: 'active',
      price: 15000
    }
  }
};

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
const mockApiService = {
  // ตรวจสอบ authentication
  validateToken: async (token) => {
    await delay(200);
    
    // Mock token validation
    if (!token || token === 'invalid_token') {
      throw new Error('UNAUTHORIZED');
    }
    
    return { valid: true, userId: 'user123' };
  },

  // ดึงข้อมูลผู้ใช้
  getUserProfile: async (userId) => {
    await delay(800);
    
    const user = mockData.users[userId];
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    
    return user;
  },

  // ดึงข้อมูล badge counts
  getBadgeCounts: async (userId) => {
    await delay(300);
    
    return mockData.badgeCounts[userId] || {
      scheduleCount: 0,
      messagesCount: 0,
      notificationsCount: 0,
      couponsCount: 0
    };
  },

  // ดึงข้อมูลแพคเกจปัจจุบัน
  getCurrentPackage: async (userId) => {
    await delay(600);
    
    return mockData.packages[userId] || null;
  },

  // อัพเดทข้อมูลผู้ใช้
  updateUserProfile: async (userId, data) => {
    await delay(1000);
    
    if (mockData.users[userId]) {
      mockData.users[userId] = { ...mockData.users[userId], ...data };
      return mockData.users[userId];
    }
    
    throw new Error('USER_NOT_FOUND');
  },

  // Mock logout
  logout: async () => {
    await delay(200);
    return { success: true };
  }
};

export default mockApiService;
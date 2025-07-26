// server/routes/admin.js
const express = require('express');
const router = express.Router();

// Mock data for statistics and management
let systemStats = {
  users: {
    total: 1247,
    trainers: 312,
    clients: 935,
    admins: 12,
    activeToday: 89,
    newThisMonth: 45,
    verifiedTrainers: 298,
    pendingVerification: 14
  },
  sessions: {
    total: 15432,
    thisMonth: 1234,
    completed: 14890,
    cancelled: 542,
    pending: 89,
    averageRating: 4.7,
    totalRevenue: 28900000
  },
  revenue: {
    thisMonth: 2450000,
    lastMonth: 2280000,
    growth: 7.4,
    totalRevenue: 28900000,
    commission: 4335000, // 15% commission
    pendingPayouts: 245000
  },
  packages: {
    sold: 3421,
    active: 892,
    expired: 2529,
    mostPopular: 'Premium Package',
    totalValue: 45600000
  },
  reviews: {
    total: 1823,
    average: 4.8,
    pending: 23,
    published: 1800,
    flagged: 12
  },
  content: {
    articles: 156,
    events: 23,
    gyms: 89,
    media: 2341
  }
};

// Mock users data for admin management
let adminUsers = [
  {
    id: 1,
    email: 'admin@fitconnect.com',
    firstName: 'Admin',
    lastName: 'System',
    role: 'super_admin',
    isActive: true,
    lastLogin: '2024-07-26T08:30:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    email: 'trainer@example.com',
    firstName: 'John',
    lastName: 'Trainer',
    role: 'trainer',
    isActive: true,
    isVerified: true,
    lastLogin: '2024-07-26T10:15:00Z',
    createdAt: '2024-02-15T00:00:00Z',
    stats: {
      totalClients: 23,
      completedSessions: 345,
      averageRating: 4.8,
      totalEarnings: 450000
    }
  },
  {
    id: 3,
    email: 'client@example.com',
    firstName: 'Jane',
    lastName: 'Client',
    role: 'client',
    isActive: true,
    lastLogin: '2024-07-26T09:45:00Z',
    createdAt: '2024-03-10T00:00:00Z',
    stats: {
      totalSessions: 45,
      activePackages: 1,
      totalSpent: 35000
    }
  }
];

// System settings
let systemSettings = {
  general: {
    siteName: 'FitConnect',
    siteDescription: 'ค้นหาเทรนเนอร์ออกกำลังกายที่ใช่สำหรับคุณ',
    contactEmail: 'support@fitconnect.com',
    supportPhone: '02-123-4567',
    maintenanceMode: false
  },
  payments: {
    commission: 15, // percentage
    minimumPayout: 1000,
    payoutSchedule: 'weekly', // weekly, monthly
    autoApprovePayouts: false,
    paymentMethods: ['bank_transfer', 'promptpay', 'credit_card']
  },
  trainer: {
    verificationRequired: true,
    maxPackages: 3,
    maxImages: 12,
    autoApprovePackages: false,
    defaultSessionDuration: 60
  },
  client: {
    maxActivePackages: 5,
    cancellationPolicy: 2, // hours before session
    rescheduleLimit: 3, // times per package
    autoRefundCancellation: false
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    adminAlerts: true
  },
  seo: {
    metaTitle: 'FitConnect - ค้นหาเทรนเนอร์ออกกำลังกาย',
    metaDescription: 'แพลตฟอร์มค้นหาเทรนเนอร์ออกกำลังกายที่ดีที่สุดในประเทศไทย',
    keywords: 'เทรนเนอร์, ออกกำลังกาย, ฟิตเนส, สุขภาพ',
    ogImage: '/images/og-image.jpg'
  }
};

// @route   GET /api/admin/stats
// @desc    Get system statistics
// @access  Private (Admin)
router.get('/stats', (req, res) => {
  try {
    // Calculate real-time stats (in production, this would come from database)
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();
    
    // Add some dynamic calculations
    const realtimeStats = {
      ...systemStats,
      realtime: {
        onlineUsers: 47,
        activeSessions: 12,
        pendingBookings: 8,
        systemLoad: 23.5,
        uptime: '99.9%'
      },
      trends: {
        usersGrowth: '+12.5%',
        revenueGrowth: '+7.4%',
        sessionsGrowth: '+15.2%',
        satisfactionScore: 4.8
      }
    };

    res.json({
      success: true,
      data: realtimeStats,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin management
// @access  Private (Admin)
router.get('/users', (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let filteredUsers = [...adminUsers];

    // Apply filters
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    if (status) {
      if (status === 'active') {
        filteredUsers = filteredUsers.filter(user => user.isActive);
      } else if (status === 'inactive') {
        filteredUsers = filteredUsers.filter(user => !user.isActive);
      } else if (status === 'verified') {
        filteredUsers = filteredUsers.filter(user => user.isVerified);
      } else if (status === 'pending') {
        filteredUsers = filteredUsers.filter(user => user.role === 'trainer' && !user.isVerified);
      }
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort users
    filteredUsers.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'lastLogin':
          aValue = new Date(a.lastLogin || 0);
          bValue = new Date(b.lastLogin || 0);
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredUsers.length / parseInt(limit)),
        total: filteredUsers.length
      }
    });

  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    });
  }
});

// @route   PUT /api/admin/users/:id/verify
// @desc    Verify trainer
// @access  Private (Admin)
router.put('/users/:id/verify', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = adminUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้ที่ระบุ'
      });
    }

    if (adminUsers[userIndex].role !== 'trainer') {
      return res.status(400).json({
        success: false,
        message: 'สามารถยืนยันได้เฉพาะเทรนเนอร์เท่านั้น'
      });
    }

    const { notes = '' } = req.body;

    adminUsers[userIndex].isVerified = true;
    adminUsers[userIndex].verifiedAt = new Date().toISOString();
    adminUsers[userIndex].verificationNotes = notes;

    // Update stats
    systemStats.users.verifiedTrainers += 1;
    systemStats.users.pendingVerification -= 1;

    res.json({
      success: true,
      message: 'ยืนยันเทรนเนอร์สำเร็จ',
      data: adminUsers[userIndex]
    });

  } catch (error) {
    console.error('Verify trainer error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการยืนยันเทรนเนอร์'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status
// @access  Private (Admin)
router.put('/users/:id/status', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = adminUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้ที่ระบุ'
      });
    }

    const { isActive, reason = '' } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'สถานะต้องเป็น true หรือ false'
      });
    }

    adminUsers[userIndex].isActive = isActive;
    adminUsers[userIndex].statusChangedAt = new Date().toISOString();
    adminUsers[userIndex].statusChangeReason = reason;

    const action = isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน';

    res.json({
      success: true,
      message: `${action}บัญชีผู้ใช้สำเร็จ`,
      data: adminUsers[userIndex]
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะผู้ใช้'
    });
  }
});

// @route   GET /api/admin/reports
// @desc    Get system reports
// @access  Private (Admin)
router.get('/reports', (req, res) => {
  try {
    const { type = 'overview', period = 'month', startDate, endDate } = req.query;

    // Mock report data
    const reports = {
      overview: {
        totalUsers: systemStats.users.total,
        totalRevenue: systemStats.revenue.totalRevenue,
        totalSessions: systemStats.sessions.total,
        averageRating: systemStats.sessions.averageRating,
        growthRate: 12.5,
        topTrainers: [
          { name: 'จอห์น ทรัพย์สิน', sessions: 156, rating: 4.9, revenue: 234000 },
          { name: 'เจน ฟิตเนส', sessions: 134, rating: 4.8, revenue: 201000 },
          { name: 'ไมค์ โยคะ', sessions: 123, rating: 4.7, revenue: 184500 }
        ]
      },
      revenue: {
        totalRevenue: systemStats.revenue.totalRevenue,
        commission: systemStats.revenue.commission,
        netRevenue: systemStats.revenue.totalRevenue - systemStats.revenue.commission,
        monthlyGrowth: 7.4,
        topPackages: [
          { name: 'Premium Package', sales: 234, revenue: 4680000 },
          { name: 'Basic Package', sales: 456, revenue: 5472000 },
          { name: 'Elite Package', sales: 123, revenue: 3690000 }
        ],
        payoutsPending: systemStats.revenue.pendingPayouts
      },
      users: {
        totalUsers: systemStats.users.total,
        newUsers: systemStats.users.newThisMonth,
        activeUsers: systemStats.users.activeToday,
        userRetention: 85.6,
        demographics: {
          ageGroups: {
            '18-25': 245,
            '26-35': 456,
            '36-45': 312,
            '46-55': 178,
            '55+': 56
          },
          genders: {
            male: 543,
            female: 689,
            other: 15
          }
        }
      },
      sessions: {
        totalSessions: systemStats.sessions.total,
        completionRate: 96.5,
        averageRating: systemStats.sessions.averageRating,
        cancellationRate: 3.5,
        popularTimes: {
          '06:00-09:00': 234,
          '09:00-12:00': 345,
          '12:00-15:00': 123,
          '15:00-18:00': 456,
          '18:00-21:00': 567,
          '21:00-24:00': 89
        },
        sessionTypes: {
          personal_training: 1234,
          group_training: 456,
          yoga: 234,
          pilates: 123,
          cardio: 345
        }
      }
    };

    const requestedReport = reports[type] || reports.overview;

    res.json({
      success: true,
      data: requestedReport,
      reportType: type,
      period: period,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างรายงาน'
    });
  }
});

// @route   GET /api/admin/settings
// @desc    Get system settings
// @access  Private (Admin)
router.get('/settings', (req, res) => {
  try {
    res.json({
      success: true,
      data: systemSettings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงการตั้งค่าระบบ'
    });
  }
});

// @route   PUT /api/admin/settings
// @desc    Update system settings
// @access  Private (Admin)
router.put('/settings', (req, res) => {
  try {
    const { section, settings } = req.body;

    if (!section || !settings) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุส่วนและการตั้งค่าที่ต้องการอัพเดท'
      });
    }

    const validSections = ['general', 'payments', 'trainer', 'client', 'notifications', 'seo'];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'ส่วนการตั้งค่าไม่ถูกต้อง'
      });
    }

    // Update settings
    systemSettings[section] = {
      ...systemSettings[section],
      ...settings
    };

    // Log settings change
    console.log('Settings updated:', {
      section,
      settings,
      updatedBy: 'admin', // In real app, get from authenticated user
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'อัพเดทการตั้งค่าสำเร็จ',
      data: systemSettings[section]
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทการตั้งค่า'
    });
  }
});

// @route   GET /api/admin/logs
// @desc    Get system logs
// @access  Private (Admin)
router.get('/logs', (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      level = 'all',
      startDate,
      endDate,
      search
    } = req.query;

    // Mock log data
    const logs = [
      {
        id: 1,
        level: 'info',
        message: 'User logged in',
        userId: 2,
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        timestamp: '2024-07-26T10:15:00Z'
      },
      {
        id: 2,
        level: 'warning',
        message: 'Failed login attempt',
        ip: '192.168.1.200',
        timestamp: '2024-07-26T10:10:00Z'
      },
      {
        id: 3,
        level: 'error',
        message: 'Database connection timeout',
        error: 'Connection timeout after 30 seconds',
        timestamp: '2024-07-26T09:45:00Z'
      },
      {
        id: 4,
        level: 'info',
        message: 'Session completed',
        sessionId: 123,
        trainerId: 1,
        clientId: 2,
        timestamp: '2024-07-26T09:30:00Z'
      }
    ];

    let filteredLogs = [...logs];

    // Apply filters
    if (level !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.message.toLowerCase().includes(searchLower) ||
        (log.error && log.error.toLowerCase().includes(searchLower))
      );
    }

    if (startDate) {
      filteredLogs = filteredLogs.filter(log =>
        new Date(log.timestamp) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredLogs = filteredLogs.filter(log =>
        new Date(log.timestamp) <= new Date(endDate)
      );
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredLogs.length / parseInt(limit)),
        total: filteredLogs.length
      }
    });

  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล log'
    });
  }
});

// @route   POST /api/admin/maintenance
// @desc    Toggle maintenance mode
// @access  Private (Admin)
router.post('/maintenance', (req, res) => {
  try {
    const { enabled, message = 'ระบบอยู่ระหว่างการปรับปรุง กรุณาลองใหม่อีกครั้งในภายหลัง' } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุสถานะการปรับปรุงระบบ'
      });
    }

    systemSettings.general.maintenanceMode = enabled;
    systemSettings.general.maintenanceMessage = message;

    const action = enabled ? 'เปิด' : 'ปิด';

    // Log maintenance mode change
    console.log('Maintenance mode toggled:', {
      enabled,
      message,
      changedBy: 'admin', // In real app, get from authenticated user
      changedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `${action}โหมดปรับปรุงระบบสำเร็จ`,
      data: {
        maintenanceMode: enabled,
        maintenanceMessage: message
      }
    });

  } catch (error) {
    console.error('Toggle maintenance mode error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเปลี่ยนโหมดปรับปรุงระบบ'
    });
  }
});

// @route   POST /api/admin/broadcast
// @desc    Send broadcast notification
// @access  Private (Admin)
router.post('/broadcast', (req, res) => {
  try {
    const {
      title,
      message,
      type = 'info', // info, warning, success, error
      targetAudience = 'all', // all, trainers, clients
      channels = ['push'] // push, email, sms
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกหัวข้อและข้อความ'
      });
    }

    const validTypes = ['info', 'warning', 'success', 'error'];
    const validAudiences = ['all', 'trainers', 'clients'];
    const validChannels = ['push', 'email', 'sms'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'ประเภทการแจ้งเตือนไม่ถูกต้อง'
      });
    }

    if (!validAudiences.includes(targetAudience)) {
      return res.status(400).json({
        success: false,
        message: 'กลุ่มเป้าหมายไม่ถูกต้อง'
      });
    }

    // Validate channels
    const invalidChannels = channels.filter(ch => !validChannels.includes(ch));
    if (invalidChannels.length > 0) {
      return res.status(400).json({
        success: false,
        message: `ช่องทางการแจ้งเตือนไม่ถูกต้อง: ${invalidChannels.join(', ')}`
      });
    }

    // Calculate target users count
    let targetCount = 0;
    switch (targetAudience) {
      case 'trainers':
        targetCount = systemStats.users.trainers;
        break;
      case 'clients':
        targetCount = systemStats.users.clients;
        break;
      default:
        targetCount = systemStats.users.total;
    }

    // Mock broadcasting (in real app, would integrate with notification services)
    console.log('Broadcast notification sent:', {
      title,
      message,
      type,
      targetAudience,
      channels,
      targetCount,
      sentBy: 'admin', // In real app, get from authenticated user
      sentAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'ส่งการแจ้งเตือนสำเร็จ',
      data: {
        targetCount,
        estimatedDelivery: '5-10 นาที',
        sentAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งการแจ้งเตือน'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = adminUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้ที่ระบุ'
      });
    }

    const { reason = '', hardDelete = false } = req.body;

    if (hardDelete) {
      // Permanently delete user
      const deletedUser = adminUsers.splice(userIndex, 1)[0];
      
      // Log deletion for audit
      console.log('User permanently deleted:', {
        userId,
        userEmail: deletedUser.email,
        reason,
        deletedBy: 'admin', // In real app, get from authenticated user
        deletedAt: new Date().toISOString()
      });

      res.json({
        success: true,
        message: 'ลบผู้ใช้อย่างถาวรสำเร็จ'
      });
    } else {
      // Soft delete - just deactivate
      adminUsers[userIndex].isActive = false;
      adminUsers[userIndex].deletedAt = new Date().toISOString();
      adminUsers[userIndex].deletionReason = reason;

      res.json({
        success: true,
        message: 'ปิดใช้งานบัญชีผู้ใช้สำเร็จ'
      });
    }

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบผู้ใช้'
    });
  }
});

module.exports = router;
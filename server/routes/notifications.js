const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all notification routes
router.use(authenticateToken);

// Mock notifications database
let notifications = [
  {
    id: 1,
    userId: 1,
    type: 'session_reminder',
    title: 'เซสชั่นใกล้เริ่มแล้ว',
    message: 'เซสชั่นการออกกำลังกายของคุณจะเริ่มในอีก 1 ชั่วโมง',
    data: {
      sessionId: 123,
      trainerId: 1,
      sessionDate: '2024-07-27T14:00:00Z'
    },
    isRead: false,
    createdAt: '2024-07-26T10:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    type: 'package_expiring',
    title: 'แพคเกจใกล้หมดอายุ',
    message: 'แพคเกจ Premium ของคุณจะหมดอายุในอีก 3 วัน',
    data: {
      packageId: 456,
      expiryDate: '2024-07-29T23:59:59Z',
      remainingSessions: 2
    },
    isRead: false,
    createdAt: '2024-07-25T09:00:00Z'
  },
  {
    id: 3,
    userId: 2,
    type: 'new_client',
    title: 'ลูกค้าใหม่',
    message: 'คุณมีลูกค้าใหม่ "สมศรี ใจดี" ต้องการจองเซสชั่น',
    data: {
      clientId: 789,
      clientName: 'สมศรี ใจดี',
      requestedDate: '2024-07-28T10:00:00Z'
    },
    isRead: true,
    createdAt: '2024-07-24T16:30:00Z'
  },
  {
    id: 4,
    userId: 1,
    type: 'session_completed',
    title: 'เซสชั่นเสร็จสิ้น',
    message: 'เซสชั่นการออกกำลังกายของคุณเสร็จสิ้นแล้ว กรุณาให้คะแนนเทรนเนอร์',
    data: {
      sessionId: 124,
      trainerId: 1,
      completedAt: '2024-07-26T15:00:00Z'
    },
    isRead: false,
    createdAt: '2024-07-26T15:05:00Z'
  },
  {
    id: 5,
    userId: 2,
    type: 'payment_received',
    title: 'ได้รับการชำระเงิน',
    message: 'คุณได้รับการชำระเงินสำหรับแพคเกจ Premium จำนวน 20,000 บาท',
    data: {
      amount: 20000,
      packageId: 456,
      clientId: 1,
      paymentId: 'pay_123456789'
    },
    isRead: false,
    createdAt: '2024-07-26T12:30:00Z'
  },
  {
    id: 6,
    userId: 1,
    type: 'achievement_unlocked',
    title: 'ปลดล็อกความสำเร็จใหม่!',
    message: 'คุณได้รับความสำเร็จ "นักสู้ 30 วัน" - ออกกำลังกายต่อเนื่อง 30 วัน',
    data: {
      achievementId: 'fighter_30_days',
      achievementName: 'นักสู้ 30 วัน',
      points: 500
    },
    isRead: false,
    createdAt: '2024-07-26T08:00:00Z'
  }
];

// Notification types
const NOTIFICATION_TYPES = [
  'session_reminder',      // แจ้งเตือนเซสชั่น
  'session_completed',     // เซสชั่นเสร็จสิ้น
  'session_cancelled',     // เซสชั่นถูกยกเลิก
  'session_rescheduled',   // เซสชั่นถูกเลื่อน
  'package_expiring',      // แพคเกจใกล้หมดอายุ
  'package_expired',       // แพคเกจหมดอายุ
  'package_purchased',     // ซื้อแพคเกจ
  'new_client',           // ลูกค้าใหม่
  'payment_received',     // ได้รับเงิน
  'payment_failed',       // การชำระเงินล้มเหลว
  'review_received',      // ได้รับรีวิว
  'achievement_unlocked', // ปลดล็อกความสำเร็จ
  'promotion',           // โปรโมชั่น
  'system_update',       // อัพเดทระบบ
  'account_verified',    // บัญชีได้รับการยืนยัน
  'profile_incomplete'   // โปรไฟล์ยังไม่สมบูรณ์
];

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      unread_only = 'false',
      type 
    } = req.query;

    // Get userId from authenticated user
    const userId = req.user?.userId || 1;

    let userNotifications = notifications.filter(n => n.userId === userId);

    // Filter by type
    if (type) {
      userNotifications = userNotifications.filter(n => n.type === type);
    }

    // Filter unread only
    if (unread_only === 'true') {
      userNotifications = userNotifications.filter(n => !n.isRead);
    }

    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = userNotifications.slice(startIndex, endIndex);

    // Count unread notifications
    const unreadCount = notifications.filter(n => n.userId === userId && !n.isRead).length;

    // Group notifications by date
    const groupedNotifications = {};
    paginatedNotifications.forEach(notification => {
      const date = new Date(notification.createdAt).toISOString().split('T')[0];
      if (!groupedNotifications[date]) {
        groupedNotifications[date] = [];
      }
      groupedNotifications[date].push(notification);
    });

    res.json({
      success: true,
      data: paginatedNotifications,
      groupedData: groupedNotifications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(userNotifications.length / parseInt(limit)),
        total: userNotifications.length,
        unreadCount: unreadCount
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน'
    });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread-count', (req, res) => {
  try {
    const userId = req.user?.userId || 1;
    
    const unreadCount = notifications.filter(n => n.userId === userId && !n.isRead).length;
    
    res.json({
      success: true,
      data: {
        unreadCount,
        hasUnread: unreadCount > 0
      }
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงจำนวนการแจ้งเตือนที่ยังไม่อ่าน'
    });
  }
});

// @route   GET /api/notifications/:id
// @desc    Get single notification
// @access  Private
router.get('/:id', (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    const userId = req.user?.userId || 1;

    const notification = notifications.find(n => 
      n.id === notificationId && n.userId === userId
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบการแจ้งเตือนที่ระบุ'
      });
    }

    // Mark as read when viewed
    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date().toISOString();
    }

    res.json({
      success: true,
      data: notification
    });

  } catch (error) {
    console.error('Get notification detail error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน'
    });
  }
});

// @route   POST /api/notifications
// @desc    Create notification (System/Admin)
// @access  Private (System)
router.post('/', (req, res) => {
  try {
    const {
      userId,
      type,
      title,
      message,
      data = {}
    } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    if (!NOTIFICATION_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'ประเภทการแจ้งเตือนไม่ถูกต้อง'
      });
    }

    const newNotification = {
      id: notifications.length + 1,
      userId: parseInt(userId),
      type,
      title: title.trim(),
      message: message.trim(),
      data,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    notifications.push(newNotification);

    res.status(201).json({
      success: true,
      message: 'สร้างการแจ้งเตือนสำเร็จ',
      data: newNotification
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างการแจ้งเตือน'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    const userId = req.user?.userId || 1;

    const notificationIndex = notifications.findIndex(n => 
      n.id === notificationId && n.userId === userId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบการแจ้งเตือนที่ระบุ'
      });
    }

    if (notifications[notificationIndex].isRead) {
      return res.json({
        success: true,
        message: 'การแจ้งเตือนนี้ถูกอ่านแล้ว',
        data: notifications[notificationIndex]
      });
    }

    notifications[notificationIndex].isRead = true;
    notifications[notificationIndex].readAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'อ่านการแจ้งเตือนแล้ว',
      data: notifications[notificationIndex]
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทการแจ้งเตือน'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', (req, res) => {
  try {
    const userId = req.user?.userId || 1;

    const userNotifications = notifications.filter(n => n.userId === userId && !n.isRead);
    
    let markedCount = 0;
    userNotifications.forEach(notification => {
      notification.isRead = true;
      notification.readAt = new Date().toISOString();
      markedCount++;
    });

    res.json({
      success: true,
      message: `อ่านการแจ้งเตือนทั้งหมดแล้ว (${markedCount} รายการ)`,
      data: {
        markedCount: markedCount
      }
    });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทการแจ้งเตือน'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    const userId = req.user?.userId || 1;

    const notificationIndex = notifications.findIndex(n => 
      n.id === notificationId && n.userId === userId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบการแจ้งเตือนที่ระบุ'
      });
    }

    notifications.splice(notificationIndex, 1);

    res.json({
      success: true,
      message: 'ลบการแจ้งเตือนสำเร็จ'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบการแจ้งเตือน'
    });
  }
});

// @route   DELETE /api/notifications/clear-all
// @desc    Clear all read notifications
// @access  Private
router.delete('/clear-all', (req, res) => {
  try {
    const userId = req.user?.userId || 1;

    const initialCount = notifications.length;
    notifications = notifications.filter(n => 
      !(n.userId === userId && n.isRead)
    );
    const deletedCount = initialCount - notifications.length;

    res.json({
      success: true,
      message: `ลบการแจ้งเตือนที่อ่านแล้วทั้งหมด (${deletedCount} รายการ)`,
      data: {
        deletedCount
      }
    });

  } catch (error) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบการแจ้งเตือน'
    });
  }
});

// @route   GET /api/notifications/types
// @desc    Get notification types
// @access  Private
router.get('/types', (req, res) => {
  try {
    const typeLabels = {
      session_reminder: 'แจ้งเตือนเซสชั่น',
      session_completed: 'เซสชั่นเสร็จสิ้น',
      session_cancelled: 'เซสชั่นถูกยกเลิก',
      session_rescheduled: 'เซสชั่นถูกเลื่อน',
      package_expiring: 'แพคเกจใกล้หมดอายุ',
      package_expired: 'แพคเกจหมดอายุ',
      package_purchased: 'ซื้อแพคเกจ',
      new_client: 'ลูกค้าใหม่',
      payment_received: 'ได้รับเงิน',
      payment_failed: 'การชำระเงินล้มเหลว',
      review_received: 'ได้รับรีวิว',
      achievement_unlocked: 'ปลดล็อกความสำเร็จ',
      promotion: 'โปรโมชั่น',
      system_update: 'อัพเดทระบบ',
      account_verified: 'บัญชีได้รับการยืนยัน',
      profile_incomplete: 'โปรไฟล์ยังไม่สมบูรณ์'
    };

    const typesWithCounts = NOTIFICATION_TYPES.map(type => {
      const count = notifications.filter(n => 
        n.type === type && n.userId === (req.user?.userId || 1)
      ).length;

      return {
        value: type,
        label: typeLabels[type] || type,
        count
      };
    });

    res.json({
      success: true,
      data: typesWithCounts
    });

  } catch (error) {
    console.error('Get notification types error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงประเภทการแจ้งเตือน'
    });
  }
});

// @route   POST /api/notifications/bulk-action
// @desc    Perform bulk action on notifications
// @access  Private
router.post('/bulk-action', (req, res) => {
  try {
    const { action, notificationIds } = req.body;
    const userId = req.user?.userId || 1;

    if (!action || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุการดำเนินการและรายการที่ต้องการ'
      });
    }

    const validActions = ['mark_read', 'mark_unread', 'delete'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'การดำเนินการไม่ถูกต้อง'
      });
    }

    let processedCount = 0;

    notificationIds.forEach(id => {
      const notificationIndex = notifications.findIndex(n => 
        n.id === parseInt(id) && n.userId === userId
      );

      if (notificationIndex !== -1) {
        switch (action) {
          case 'mark_read':
            if (!notifications[notificationIndex].isRead) {
              notifications[notificationIndex].isRead = true;
              notifications[notificationIndex].readAt = new Date().toISOString();
              processedCount++;
            }
            break;
          case 'mark_unread':
            if (notifications[notificationIndex].isRead) {
              notifications[notificationIndex].isRead = false;
              delete notifications[notificationIndex].readAt;
              processedCount++;
            }
            break;
          case 'delete':
            notifications.splice(notificationIndex, 1);
            processedCount++;
            break;
        }
      }
    });

    const actionLabels = {
      mark_read: 'อ่านแล้ว',
      mark_unread: 'ยังไม่ได้อ่าน',
      delete: 'ลบ'
    };

    res.json({
      success: true,
      message: `ดำเนินการ ${actionLabels[action]} สำเร็จ ${processedCount} รายการ`,
      data: {
        action,
        processedCount,
        requestedCount: notificationIds.length
      }
    });

  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดำเนินการ'
    });
  }
});

// @route   GET /api/notifications/preferences
// @desc    Get user notification preferences
// @access  Private
router.get('/preferences', (req, res) => {
  try {
    const userId = req.user?.userId || 1;
    
    // Mock user preferences (in real app, get from database)
    const preferences = {
      userId,
      email: {
        enabled: true,
        types: [
          'session_reminder',
          'session_cancelled',
          'package_expiring',
          'payment_received'
        ]
      },
      push: {
        enabled: true,
        types: [
          'session_reminder',
          'session_completed',
          'new_client',
          'achievement_unlocked'
        ]
      },
      sms: {
        enabled: false,
        types: [
          'session_reminder',
          'session_cancelled'
        ]
      },
      inApp: {
        enabled: true,
        types: NOTIFICATION_TYPES // All types enabled for in-app
      },
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '07:00'
      }
    };

    res.json({
      success: true,
      data: preferences
    });

  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงการตั้งค่าการแจ้งเตือน'
    });
  }
});

// @route   PUT /api/notifications/preferences
// @desc    Update notification preferences
// @access  Private
router.put('/preferences', (req, res) => {
  try {
    const userId = req.user?.userId || 1;
    const preferences = req.body;

    // Validate preferences structure
    const requiredChannels = ['email', 'push', 'sms', 'inApp'];
    const hasValidStructure = requiredChannels.every(channel => 
      preferences[channel] && 
      typeof preferences[channel].enabled === 'boolean' &&
      Array.isArray(preferences[channel].types)
    );

    if (!hasValidStructure) {
      return res.status(400).json({
        success: false,
        message: 'โครงสร้างการตั้งค่าไม่ถูกต้อง'
      });
    }

    // In real app, save to database
    console.log('Updated notification preferences for user:', userId, preferences);

    res.json({
      success: true,
      message: 'อัพเดทการตั้งค่าการแจ้งเตือนสำเร็จ',
      data: preferences
    });

  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทการตั้งค่าการแจ้งเตือน'
    });
  }
});

module.exports = router;
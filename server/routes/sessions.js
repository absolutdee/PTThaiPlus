// server/routes/sessions.js
const express = require('express');
const router = express.Router();

// Mock sessions database
let sessions = [
  {
    id: 1,
    trainerId: 1,
    trainerName: 'จอห์น ทรัพย์สิน',
    clientId: 1,
    clientName: 'สมศรี ใจดี',
    packageId: 2,
    sessionDate: '2024-07-28T09:00:00Z',
    duration: 60,
    type: 'personal_training',
    status: 'scheduled',
    location: 'ห้องฟิตเนส ชั้น 2',
    notes: 'โฟกัส Upper Body และ Core Strength',
    exercises: [],
    feedback: {},
    createdAt: '2024-07-20T00:00:00Z',
    updatedAt: '2024-07-20T00:00:00Z'
  },
  {
    id: 2,
    trainerId: 1,
    trainerName: 'จอห์น ทรัพย์สิน',
    clientId: 1,
    clientName: 'สมศรี ใจดี',
    packageId: 2,
    sessionDate: '2024-07-25T09:00:00Z',
    duration: 60,
    type: 'personal_training',
    status: 'completed',
    location: 'ห้องฟิตเนส ชั้น 2',
    notes: 'เริ่มต้นด้วย Cardio และ Strength Training',
    exercises: [
      { name: 'Treadmill', sets: 1, duration: 15, calories: 120 },
      { name: 'Squats', sets: 3, reps: 12, weight: 40 },
      { name: 'Push-ups', sets: 3, reps: 10, weight: 0 },
      { name: 'Lunges', sets: 3, reps: 12, weight: 15 }
    ],
    feedback: {
      trainerRating: 5,
      clientRating: 5,
      trainerNotes: 'ลูกค้าแสดงท่าได้ดีขึ้นมาก',
      clientNotes: 'ชอบมาก เทรนเนอร์อธิบายชัดเจน'
    },
    createdAt: '2024-07-18T00:00:00Z',
    updatedAt: '2024-07-25T15:00:00Z',
    completedAt: '2024-07-25T15:00:00Z'
  },
  {
    id: 3,
    trainerId: 1,
    trainerName: 'จอห์น ทรัพย์สิน',
    clientId: 1,
    clientName: 'สมศรี ใจดี',
    packageId: 2,
    sessionDate: '2024-07-30T14:00:00Z',
    duration: 60,
    type: 'personal_training',
    status: 'scheduled',
    location: 'ห้องฟิตเนส ชั้น 2',
    notes: 'Lower Body Focus และ Flexibility',
    exercises: [],
    feedback: {},
    createdAt: '2024-07-20T00:00:00Z',
    updatedAt: '2024-07-20T00:00:00Z'
  }
];

// Session types
const SESSION_TYPES = [
  'personal_training',
  'group_training',
  'yoga',
  'pilates',
  'cardio',
  'strength_training',
  'functional_training',
  'consultation'
];

// Session statuses
const SESSION_STATUSES = [
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'rescheduled'
];

// @route   GET /api/sessions
// @desc    Get sessions (filtered by user role)
// @access  Private
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      trainerId,
      clientId,
      startDate,
      endDate,
      type,
      sortBy = 'sessionDate',
      sortOrder = 'desc'
    } = req.query;

    let filteredSessions = [...sessions];

    // Apply filters
    if (trainerId) {
      filteredSessions = filteredSessions.filter(s => s.trainerId === parseInt(trainerId));
    }

    if (clientId) {
      filteredSessions = filteredSessions.filter(s => s.clientId === parseInt(clientId));
    }

    if (status) {
      filteredSessions = filteredSessions.filter(s => s.status === status);
    }

    if (type) {
      filteredSessions = filteredSessions.filter(s => s.type === type);
    }

    if (startDate) {
      filteredSessions = filteredSessions.filter(s => 
        new Date(s.sessionDate) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredSessions = filteredSessions.filter(s => 
        new Date(s.sessionDate) <= new Date(endDate)
      );
    }

    // Sort sessions
    filteredSessions.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'sessionDate':
          aValue = new Date(a.sessionDate);
          bValue = new Date(b.sessionDate);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'clientName':
          aValue = a.clientName;
          bValue = b.clientName;
          break;
        default:
          aValue = new Date(a.sessionDate);
          bValue = new Date(b.sessionDate);
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
    const paginatedSessions = filteredSessions.slice(startIndex, endIndex);

    // Calculate summary stats
    const summary = {
      total: filteredSessions.length,
      scheduled: filteredSessions.filter(s => s.status === 'scheduled').length,
      completed: filteredSessions.filter(s => s.status === 'completed').length,
      cancelled: filteredSessions.filter(s => s.status === 'cancelled').length,
      today: filteredSessions.filter(s => {
        const today = new Date().toISOString().split('T')[0];
        const sessionDate = new Date(s.sessionDate).toISOString().split('T')[0];
        return sessionDate === today;
      }).length
    };

    res.json({
      success: true,
      data: paginatedSessions,
      summary,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredSessions.length / parseInt(limit)),
        total: filteredSessions.length
      }
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเซสชั่น'
    });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get single session
// @access  Private
router.get('/:id', (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const session = sessions.find(s => s.id === sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเซสชั่นที่ระบุ'
      });
    }

    res.json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Get session detail error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเซสชั่น'
    });
  }
});

// @route   POST /api/sessions
// @desc    Create new session
// @access  Private (Trainer)
router.post('/', (req, res) => {
  try {
    const {
      clientId,
      packageId,
      sessionDate,
      duration = 60,
      type = 'personal_training',
      location,
      notes
    } = req.body;

    // Validation
    if (!clientId || !sessionDate) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลลูกค้าและวันที่นัดหมาย'
      });
    }

    if (!SESSION_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'ประเภทเซสชั่นไม่ถูกต้อง'
      });
    }

    // Check if session time conflicts
    const sessionDateTime = new Date(sessionDate);
    const conflictSession = sessions.find(s => 
      s.trainerId === 1 && // Mock trainer ID
      s.status !== 'cancelled' &&
      Math.abs(new Date(s.sessionDate) - sessionDateTime) < 60 * 60 * 1000 // 1 hour difference
    );

    if (conflictSession) {
      return res.status(400).json({
        success: false,
        message: 'มีเซสชั่นอื่นในช่วงเวลาใกล้เคียง กรุณาเลือกเวลาอื่น'
      });
    }

    // In real app, get trainer info from authenticated user
    const trainerId = 1; // Mock trainer ID

    const newSession = {
      id: sessions.length + 1,
      trainerId,
      trainerName: 'จอห์น ทรัพย์สิน', // In real app, get from database
      clientId: parseInt(clientId),
      clientName: 'ลูกค้า', // In real app, get from database
      packageId: packageId ? parseInt(packageId) : null,
      sessionDate,
      duration: parseInt(duration),
      type,
      status: 'scheduled',
      location: location || '',
      notes: notes || '',
      exercises: [],
      feedback: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    sessions.push(newSession);

    res.status(201).json({
      success: true,
      message: 'สร้างเซสชั่นสำเร็จ',
      data: newSession
    });

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างเซสชั่น'
    });
  }
});

// @route   PUT /api/sessions/:id
// @desc    Update session
// @access  Private
router.put('/:id', (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);

    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเซสชั่นที่ระบุ'
      });
    }

    const {
      sessionDate,
      duration,
      location,
      notes,
      exercises,
      status,
      type
    } = req.body;

    // Validate status
    if (status && !SESSION_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'สถานะเซสชั่นไม่ถูกต้อง'
      });
    }

    // Validate type
    if (type && !SESSION_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'ประเภทเซสชั่นไม่ถูกต้อง'
      });
    }

    // Update session
    if (sessionDate) sessions[sessionIndex].sessionDate = sessionDate;
    if (duration) sessions[sessionIndex].duration = parseInt(duration);
    if (location) sessions[sessionIndex].location = location;
    if (notes) sessions[sessionIndex].notes = notes;
    if (exercises) sessions[sessionIndex].exercises = exercises;
    if (status) sessions[sessionIndex].status = status;
    if (type) sessions[sessionIndex].type = type;

    sessions[sessionIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'อัพเดทเซสชั่นสำเร็จ',
      data: sessions[sessionIndex]
    });

  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทเซสชั่น'
    });
  }
});

// @route   POST /api/sessions/:id/complete
// @desc    Mark session as complete
// @access  Private (Trainer)
router.post('/:id/complete', (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);

    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเซสชั่นที่ระบุ'
      });
    }

    const { exercises, trainerNotes, clientRating } = req.body;

    // Update session
    sessions[sessionIndex].status = 'completed';
    sessions[sessionIndex].completedAt = new Date().toISOString();
    sessions[sessionIndex].updatedAt = new Date().toISOString();

    if (exercises) sessions[sessionIndex].exercises = exercises;
    
    if (!sessions[sessionIndex].feedback) {
      sessions[sessionIndex].feedback = {};
    }
    
    if (trainerNotes) sessions[sessionIndex].feedback.trainerNotes = trainerNotes;
    if (clientRating) sessions[sessionIndex].feedback.clientRating = parseInt(clientRating);

    res.json({
      success: true,
      message: 'บันทึกเซสชั่นสำเร็จ',
      data: sessions[sessionIndex]
    });

  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกเซสชั่น'
    });
  }
});

// @route   POST /api/sessions/:id/cancel
// @desc    Cancel session
// @access  Private
router.post('/:id/cancel', (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);

    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเซสชั่นที่ระบุ'
      });
    }

    const { reason, cancelledBy = 'client' } = req.body;

    // Check if session can be cancelled
    const sessionDate = new Date(sessions[sessionIndex].sessionDate);
    const now = new Date();
    const hoursUntilSession = (sessionDate - now) / (1000 * 60 * 60);

    if (hoursUntilSession < 2) {
      return res.status(400).json({
        success: false,
        message: 'ไม่สามารถยกเลิกเซสชั่นได้ เนื่องจากเหลือเวลาไม่ถึง 2 ชั่วโมง'
      });
    }

    // Update session
    sessions[sessionIndex].status = 'cancelled';
    sessions[sessionIndex].cancelledAt = new Date().toISOString();
    sessions[sessionIndex].cancellationReason = reason || '';
    sessions[sessionIndex].cancelledBy = cancelledBy;
    sessions[sessionIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'ยกเลิกเซสชั่นสำเร็จ',
      data: sessions[sessionIndex]
    });

  } catch (error) {
    console.error('Cancel session error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการยกเลิกเซสชั่น'
    });
  }
});

// @route   POST /api/sessions/:id/reschedule
// @desc    Reschedule session
// @access  Private
router.post('/:id/reschedule', (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);

    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเซสชั่นที่ระบุ'
      });
    }

    const { newDate, reason, requestedBy = 'client' } = req.body;

    if (!newDate) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุวันที่ใหม่'
      });
    }

    // Check if new date conflicts
    const newDateTime = new Date(newDate);
    const conflictSession = sessions.find(s => 
      s.trainerId === sessions[sessionIndex].trainerId &&
      s.id !== sessionId &&
      s.status !== 'cancelled' &&
      Math.abs(new Date(s.sessionDate) - newDateTime) < 60 * 60 * 1000 // 1 hour difference
    );

    if (conflictSession) {
      return res.status(400).json({
        success: false,
        message: 'มีเซสชั่นอื่นในช่วงเวลาใกล้เคียง กรุณาเลือกเวลาอื่น'
      });
    }

    // Store original date for history
    const originalDate = sessions[sessionIndex].sessionDate;

    // Update session
    sessions[sessionIndex].sessionDate = newDate;
    sessions[sessionIndex].status = 'rescheduled';
    sessions[sessionIndex].rescheduledAt = new Date().toISOString();
    sessions[sessionIndex].rescheduleReason = reason || '';
    sessions[sessionIndex].requestedBy = requestedBy;
    sessions[sessionIndex].originalDate = originalDate;
    sessions[sessionIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'เลื่อนนัดหมายสำเร็จ',
      data: sessions[sessionIndex]
    });

  } catch (error) {
    console.error('Reschedule session error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเลื่อนนัดหมาย'
    });
  }
});

// @route   GET /api/sessions/calendar/:trainerId
// @desc    Get trainer's calendar view
// @access  Private
router.get('/calendar/:trainerId', (req, res) => {
  try {
    const trainerId = parseInt(req.params.trainerId);
    const { month, year } = req.query;

    let trainerSessions = sessions.filter(s => s.trainerId === trainerId);

    // Filter by month/year if provided
    if (month && year) {
      trainerSessions = trainerSessions.filter(s => {
        const sessionDate = new Date(s.sessionDate);
        return sessionDate.getMonth() === parseInt(month) - 1 && 
               sessionDate.getFullYear() === parseInt(year);
      });
    }

    // Group sessions by date
    const calendar = {};
    trainerSessions.forEach(session => {
      const date = new Date(session.sessionDate).toISOString().split('T')[0];
      if (!calendar[date]) {
        calendar[date] = [];
      }
      calendar[date].push({
        id: session.id,
        time: new Date(session.sessionDate).toLocaleTimeString('th-TH', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        clientName: session.clientName,
        type: session.type,
        status: session.status,
        duration: session.duration
      });
    });

    res.json({
      success: true,
      data: calendar
    });

  } catch (error) {
    console.error('Get calendar error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลปฏิทิน'
    });
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Delete session (Admin only)
// @access  Private (Admin)
router.delete('/:id', (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);

    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเซสชั่นที่ระบุ'
      });
    }

    sessions.splice(sessionIndex, 1);

    res.json({
      success: true,
      message: 'ลบเซสชั่นสำเร็จ'
    });

  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบเซสชั่น'
    });
  }
});

module.exports = router;
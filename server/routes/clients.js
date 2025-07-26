// server/routes/clients.js
const express = require('express');
const router = express.Router();

// Mock clients database
let clients = [
  {
    id: 1,
    userId: 2,
    firstName: 'สมศรี',
    lastName: 'ใจดี',
    email: 'client@example.com',
    phone: '082-345-6789',
    birthDate: '1990-05-15',
    gender: 'female',
    weight: 60,
    height: 165,
    fitnessGoals: ['weight_loss', 'muscle_gain'],
    medicalConditions: [],
    emergencyContact: {
      name: 'สมหวัง ใจดี',
      phone: '081-234-5678',
      relationship: 'สามี'
    },
    preferences: {
      workoutDays: ['monday', 'wednesday', 'friday'],
      workoutTime: 'morning',
      intensity: 'medium'
    },
    currentPackages: [
      {
        id: 1,
        trainerId: 1,
        packageId: 2,
        name: 'Premium Package',
        remainingSessions: 12,
        totalSessions: 16,
        startDate: '2024-07-01',
        endDate: '2024-08-30',
        status: 'active'
      }
    ],
    healthMetrics: [
      {
        date: '2024-07-26',
        weight: 59.5,
        bodyFat: 22.5,
        muscleMass: 45.2,
        notes: 'ลดน้ำหนักได้ 0.5 กิโลกรัม'
      },
      {
        date: '2024-07-19',
        weight: 60,
        bodyFat: 23,
        muscleMass: 45,
        notes: 'เริ่มต้นโปรแกรม'
      }
    ],
    achievements: [
      {
        id: 1,
        name: 'เริ่มต้นการเดินทาง',
        description: 'เข้าร่วมเซสชั่นแรก',
        dateEarned: '2024-07-01',
        icon: '🎯'
      },
      {
        id: 2,
        name: 'นักสู้ 7 วัน',
        description: 'ออกกำลังกายต่อเนื่อง 7 วัน',
        dateEarned: '2024-07-08',
        icon: '🔥'
      }
    ],
    workoutHistory: [],
    nutritionPlans: [],
    isActive: true,
    joinedAt: '2024-07-01T00:00:00Z',
    lastActivity: '2024-07-26T10:30:00Z'
  }
];

// @route   GET /api/clients
// @desc    Get all clients (Admin only)
// @access  Private (Admin)
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      trainer,
      goal
    } = req.query;

    let filteredClients = [...clients];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredClients = filteredClients.filter(client =>
        client.firstName.toLowerCase().includes(searchLower) ||
        client.lastName.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.includes(search)
      );
    }

    // Apply status filter
    if (status) {
      if (status === 'active') {
        filteredClients = filteredClients.filter(client => client.isActive);
      } else if (status === 'inactive') {
        filteredClients = filteredClients.filter(client => !client.isActive);
      }
    }

    // Apply trainer filter
    if (trainer) {
      filteredClients = filteredClients.filter(client =>
        client.currentPackages.some(pkg => pkg.trainerId === parseInt(trainer))
      );
    }

    // Apply goal filter
    if (goal) {
      filteredClients = filteredClients.filter(client =>
        client.fitnessGoals.includes(goal)
      );
    }

    // Sort by last activity
    filteredClients.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedClients = filteredClients.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedClients,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredClients.length / parseInt(limit)),
        total: filteredClients.length
      }
    });

  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า'
    });
  }
});

// @route   GET /api/clients/:id
// @desc    Get single client
// @access  Private
router.get('/:id', (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const client = clients.find(c => c.id === clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลลูกค้า'
      });
    }

    res.json({
      success: true,
      data: client
    });

  } catch (error) {
    console.error('Get client detail error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า'
    });
  }
});

// @route   POST /api/clients
// @desc    Create client profile
// @access  Private
router.post('/', (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      birthDate,
      gender,
      weight,
      height,
      fitnessGoals = [],
      medicalConditions = [],
      emergencyContact,
      preferences = {}
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลพื้นฐานให้ครบถ้วน'
      });
    }

    // Check if email already exists
    const existingClient = clients.find(c => c.email === email);
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'อีเมลนี้ถูกใช้งานแล้ว'
      });
    }

    const newClient = {
      id: clients.length + 1,
      userId: null, // Will be linked when user registers
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase(),
      phone: phone || '',
      birthDate: birthDate || null,
      gender: gender || null,
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      fitnessGoals: Array.isArray(fitnessGoals) ? fitnessGoals : [],
      medicalConditions: Array.isArray(medicalConditions) ? medicalConditions : [],
      emergencyContact: emergencyContact || {},
      preferences: {
        workoutDays: preferences.workoutDays || [],
        workoutTime: preferences.workoutTime || 'morning',
        intensity: preferences.intensity || 'medium'
      },
      currentPackages: [],
      healthMetrics: [],
      achievements: [],
      workoutHistory: [],
      nutritionPlans: [],
      isActive: true,
      joinedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    clients.push(newClient);

    res.status(201).json({
      success: true,
      message: 'สร้างโปรไฟล์ลูกค้าสำเร็จ',
      data: newClient
    });

  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างโปรไฟล์ลูกค้า'
    });
  }
});

// @route   PUT /api/clients/:id
// @desc    Update client profile
// @access  Private
router.put('/:id', (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const clientIndex = clients.findIndex(c => c.id === clientId);

    if (clientIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลลูกค้า'
      });
    }

    const updateData = req.body;

    // Update allowed fields
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'birthDate', 'gender',
      'weight', 'height', 'fitnessGoals', 'medicalConditions',
      'emergencyContact', 'preferences'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        clients[clientIndex][field] = updateData[field];
      }
    });

    clients[clientIndex].lastActivity = new Date().toISOString();

    res.json({
      success: true,
      message: 'อัพเดทข้อมูลลูกค้าสำเร็จ',
      data: clients[clientIndex]
    });

  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูลลูกค้า'
    });
  }
});

// @route   POST /api/clients/:id/health-metrics
// @desc    Add health metric record
// @access  Private
router.post('/:id/health-metrics', (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const clientIndex = clients.findIndex(c => c.id === clientId);

    if (clientIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลลูกค้า'
      });
    }

    const { weight, bodyFat, muscleMass, notes } = req.body;

    const newMetric = {
      date: new Date().toISOString().split('T')[0],
      weight: weight ? parseFloat(weight) : null,
      bodyFat: bodyFat ? parseFloat(bodyFat) : null,
      muscleMass: muscleMass ? parseFloat(muscleMass) : null,
      notes: notes || ''
    };

    clients[clientIndex].healthMetrics.push(newMetric);
    clients[clientIndex].lastActivity = new Date().toISOString();

    // Update current weight if provided
    if (weight) {
      clients[clientIndex].weight = parseFloat(weight);
    }

    res.status(201).json({
      success: true,
      message: 'บันทึกข้อมูลสุขภาพสำเร็จ',
      data: newMetric
    });

  } catch (error) {
    console.error('Add health metric error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลสุขภาพ'
    });
  }
});

// @route   GET /api/clients/:id/progress
// @desc    Get client progress data
// @access  Private
router.get('/:id/progress', (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const client = clients.find(c => c.id === clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลลูกค้า'
      });
    }

    // Calculate progress data
    const healthMetrics = client.healthMetrics.sort((a, b) => new Date(a.date) - new Date(b.date));
    const latestMetric = healthMetrics[healthMetrics.length - 1];
    const firstMetric = healthMetrics[0];

    const progressData = {
      current: latestMetric || {},
      initial: firstMetric || {},
      changes: {},
      achievements: client.achievements,
      totalSessions: client.workoutHistory.length,
      currentPackages: client.currentPackages
    };

    // Calculate changes
    if (latestMetric && firstMetric) {
      if (latestMetric.weight && firstMetric.weight) {
        progressData.changes.weight = latestMetric.weight - firstMetric.weight;
      }
      if (latestMetric.bodyFat && firstMetric.bodyFat) {
        progressData.changes.bodyFat = latestMetric.bodyFat - firstMetric.bodyFat;
      }
      if (latestMetric.muscleMass && firstMetric.muscleMass) {
        progressData.changes.muscleMass = latestMetric.muscleMass - firstMetric.muscleMass;
      }
    }

    res.json({
      success: true,
      data: progressData
    });

  } catch (error) {
    console.error('Get client progress error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลความก้าวหน้า'
    });
  }
});

// @route   POST /api/clients/:id/achievements
// @desc    Award achievement to client
// @access  Private (Trainer/Admin)
router.post('/:id/achievements', (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const clientIndex = clients.findIndex(c => c.id === clientId);

    if (clientIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลลูกค้า'
      });
    }

    const { name, description, icon = '🏆' } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อและคำอธิบายความสำเร็จ'
      });
    }

    const newAchievement = {
      id: clients[clientIndex].achievements.length + 1,
      name: name.trim(),
      description: description.trim(),
      dateEarned: new Date().toISOString().split('T')[0],
      icon: icon
    };

    clients[clientIndex].achievements.push(newAchievement);
    clients[clientIndex].lastActivity = new Date().toISOString();

    res.status(201).json({
      success: true,
      message: 'มอบรางวัลความสำเร็จสำเร็จ',
      data: newAchievement
    });

  } catch (error) {
    console.error('Award achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการมอบรางวัลความสำเร็จ'
    });
  }
});

// @route   DELETE /api/clients/:id
// @desc    Deactivate client
// @access  Private (Admin)
router.delete('/:id', (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const clientIndex = clients.findIndex(c => c.id === clientId);

    if (clientIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลลูกค้า'
      });
    }

    // Soft delete - just deactivate
    clients[clientIndex].isActive = false;
    clients[clientIndex].lastActivity = new Date().toISOString();

    res.json({
      success: true,
      message: 'ปิดใช้งานบัญชีลูกค้าสำเร็จ'
    });

  } catch (error) {
    console.error('Deactivate client error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการปิดใช้งานบัญชี'
    });
  }
});

module.exports = router;
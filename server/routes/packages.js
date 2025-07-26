// server/routes/packages.js
const express = require('express');
const router = express.Router();

// Mock packages database
let packages = [
  {
    id: 1,
    trainerId: 1,
    trainerName: 'จอห์น ทรัพย์สิน',
    name: 'Basic Package',
    description: '8 เซสชั่นฝึกซ้อมสำหรับผู้เริ่มต้น พร้อมคำแนะนำพื้นฐาน',
    sessions: 8,
    duration: 30, // days
    price: 12000,
    originalPrice: 15000,
    features: [
      '8 เซสชั่นฝึกซ้อม (60 นาทีต่อเซสชั่น)',
      'แผนการออกกำลังกายส่วนตัว',
      'คำปรึกษาพื้นฐาน',
      'ติดตามความก้าวหน้า',
      'รายงานผลการเทรน'
    ],
    included: [
      'personal_training',
      'workout_plan',
      'basic_consultation',
      'progress_tracking'
    ],
    excluded: [
      'nutrition_plan',
      'supplement_advice',
      '24_7_support'
    ],
    isRecommended: false,
    isActive: true,
    isPopular: false,
    category: 'beginner',
    difficulty: 'beginner',
    targetAudience: ['weight_loss', 'fitness_maintenance'],
    minAge: 16,
    maxAge: 65,
    prerequisites: [],
    cancellationPolicy: '24h_advance',
    reschedulePolicy: '2h_advance',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  },
  {
    id: 2,
    trainerId: 1,
    trainerName: 'จอห์น ทรัพย์สิน',
    name: 'Premium Package',
    description: '16 เซสชั่นฝึกซ้อม + แผนโภชนาการครบวงจร สำหรับผู้ที่ต้องการผลลัพธ์สูงสุด',
    sessions: 16,
    duration: 60, // days
    price: 20000,
    originalPrice: 25000,
    features: [
      '16 เซสชั่นฝึกซ้อม (60 นาทีต่อเซสชั่น)',
      'แผนการออกกำลังกายส่วนตัว',
      'แผนโภชนาการครบวงจร',
      'ติดตามความก้าวหน้า 24/7',
      'คำปรึกษาไม่จำกัด',
      'เซสชั่นโบนัส 2 ครั้ง',
      'รายงานผลการเทรนรายสัปดาห์'
    ],
    included: [
      'personal_training',
      'workout_plan',
      'nutrition_plan',
      'progress_tracking',
      'unlimited_consultation',
      'bonus_sessions',
      'weekly_reports'
    ],
    excluded: [
      'supplement_delivery',
      'home_visit'
    ],
    isRecommended: true,
    isActive: true,
    isPopular: true,
    category: 'intermediate',
    difficulty: 'intermediate',
    targetAudience: ['weight_loss', 'muscle_gain', 'athletic_performance'],
    minAge: 18,
    maxAge: 60,
    prerequisites: ['basic_fitness'],
    cancellationPolicy: '24h_advance',
    reschedulePolicy: '2h_advance',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  },
  {
    id: 3,
    trainerId: 1,
    trainerName: 'จอห์น ทรัพย์สิน',
    name: 'Elite Package',
    description: '24 เซสชั่นฝึกซ้อม + โปรแกรมสมบูรณ์แบบ สำหรับนักกีฬาและผู้ที่ต้องการความเป็นเลิศ',
    sessions: 24,
    duration: 90, // days
    price: 30000,
    originalPrice: 36000,
    features: [
      '24 เซสชั่นฝึกซ้อม (90 นาทีต่อเซสชั่น)',
      'แผนการออกกำลังกายขั้นสูง',
      'แผนโภชนาการเฉพาะบุคคล',
      'ติดตามความก้าวหน้าแบบ Real-time',
      'คำปรึกษา 24/7',
      'เซสชั่นโบนัส 4 ครั้ง',
      'การวิเคราะห์ร่างกายครบวงจร',
      'โปรแกรมฟื้นฟูและป้องกันการบาดเจ็บ'
    ],
    included: [
      'personal_training',
      'advanced_workout_plan',
      'personalized_nutrition',
      'realtime_tracking',
      '24_7_support',
      'bonus_sessions',
      'body_analysis',
      'injury_prevention',
      'recovery_program'
    ],
    excluded: [],
    isRecommended: false,
    isActive: true,
    isPopular: false,
    category: 'advanced',
    difficulty: 'advanced',
    targetAudience: ['athletic_performance', 'competition_prep', 'professional_training'],
    minAge: 18,
    maxAge: 50,
    prerequisites: ['intermediate_fitness', 'medical_clearance'],
    cancellationPolicy: '48h_advance',
    reschedulePolicy: '4h_advance',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  },
  {
    id: 4,
    trainerId: 2,
    trainerName: 'เจน ฟิตเนส',
    name: 'Cardio Blast',
    description: '12 เซสชั่น HIIT และ Cardio เข้มข้น เพื่อการเผาผลาญและลดน้ำหนัก',
    sessions: 12,
    duration: 45, // days
    price: 15000,
    originalPrice: 18000,
    features: [
      '12 เซสชั่น HIIT (45 นาทีต่อเซสชั่น)',
      'โปรแกรม Cardio เข้มข้น',
      'แผนการเผาผลาญไขมัน',
      'ติดตามแคลอรี่',
      'คำแนะนำด้านโภชนาการ',
      'เซสชั่นโบนัส 1 ครั้ง'
    ],
    included: [
      'hiit_training',
      'cardio_program',
      'fat_burning_plan',
      'calorie_tracking',
      'nutrition_guidance'
    ],
    excluded: [
      'strength_training',
      'supplement_plan'
    ],
    isRecommended: false,
    isActive: true,
    isPopular: true,
    category: 'cardio',
    difficulty: 'intermediate',
    targetAudience: ['weight_loss', 'endurance'],
    minAge: 16,
    maxAge: 55,
    prerequisites: [],
    cancellationPolicy: '24h_advance',
    reschedulePolicy: '2h_advance',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  }
];

// Package categories
const PACKAGE_CATEGORIES = [
  'beginner', 'intermediate', 'advanced', 'cardio', 'strength', 
  'flexibility', 'rehabilitation', 'sports_specific'
];

// Difficulty levels
const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'];

// Target audiences
const TARGET_AUDIENCES = [
  'weight_loss', 'muscle_gain', 'fitness_maintenance', 'athletic_performance',
  'endurance', 'flexibility', 'rehabilitation', 'competition_prep', 'professional_training'
];

// @route   GET /api/packages
// @desc    Get all packages (with filters)
// @access  Public
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      trainerId,
      category,
      difficulty,
      minPrice,
      maxPrice,
      targetAudience,
      sortBy = 'popular',
      sortOrder = 'desc',
      isActive = 'true'
    } = req.query;

    let filteredPackages = [...packages];

    // Apply filters
    if (trainerId) {
      filteredPackages = filteredPackages.filter(p => p.trainerId === parseInt(trainerId));
    }

    if (category) {
      filteredPackages = filteredPackages.filter(p => p.category === category);
    }

    if (difficulty) {
      filteredPackages = filteredPackages.filter(p => p.difficulty === difficulty);
    }

    if (minPrice) {
      filteredPackages = filteredPackages.filter(p => p.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      filteredPackages = filteredPackages.filter(p => p.price <= parseInt(maxPrice));
    }

    if (targetAudience) {
      filteredPackages = filteredPackages.filter(p => 
        p.targetAudience.includes(targetAudience)
      );
    }

    if (isActive === 'true') {
      filteredPackages = filteredPackages.filter(p => p.isActive);
    }

    // Sort packages
    filteredPackages.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'sessions':
          aValue = a.sessions;
          bValue = b.sessions;
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'popular':
          aValue = a.isPopular ? 1 : 0;
          bValue = b.isPopular ? 1 : 0;
          break;
        case 'recommended':
          aValue = a.isRecommended ? 1 : 0;
          bValue = b.isRecommended ? 1 : 0;
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
    const paginatedPackages = filteredPackages.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: filteredPackages.length,
      averagePrice: filteredPackages.length > 0 
        ? Math.round(filteredPackages.reduce((sum, p) => sum + p.price, 0) / filteredPackages.length)
        : 0,
      priceRange: {
        min: filteredPackages.length > 0 ? Math.min(...filteredPackages.map(p => p.price)) : 0,
        max: filteredPackages.length > 0 ? Math.max(...filteredPackages.map(p => p.price)) : 0
      },
      categories: PACKAGE_CATEGORIES.map(cat => ({
        name: cat,
        count: filteredPackages.filter(p => p.category === cat).length
      })),
      popular: filteredPackages.filter(p => p.isPopular).length,
      recommended: filteredPackages.filter(p => p.isRecommended).length
    };

    res.json({
      success: true,
      data: paginatedPackages,
      stats,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredPackages.length / parseInt(limit)),
        total: filteredPackages.length
      }
    });

  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแพคเกจ'
    });
  }
});

// @route   GET /api/packages/:id
// @desc    Get single package
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const package = packages.find(p => p.id === packageId);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบแพคเกจที่ระบุ'
      });
    }

    // Add related packages (same trainer, different packages)
    const relatedPackages = packages
      .filter(p => p.trainerId === package.trainerId && p.id !== package.id && p.isActive)
      .slice(0, 3);

    const packageWithRelated = {
      ...package,
      relatedPackages
    };

    res.json({
      success: true,
      data: packageWithRelated
    });

  } catch (error) {
    console.error('Get package detail error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแพคเกจ'
    });
  }
});

// @route   POST /api/packages
// @desc    Create new package
// @access  Private (Trainer)
router.post('/', (req, res) => {
  try {
    const {
      name,
      description,
      sessions,
      duration,
      price,
      originalPrice,
      features = [],
      included = [],
      excluded = [],
      category,
      difficulty,
      targetAudience = [],
      minAge = 16,
      maxAge = 65,
      prerequisites = [],
      cancellationPolicy = '24h_advance',
      reschedulePolicy = '2h_advance'
    } = req.body;

    // Validation
    if (!name || !description || !sessions || !duration || !price) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลพื้นฐานให้ครบถ้วน'
      });
    }

    if (!PACKAGE_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'หมวดหมู่แพคเกจไม่ถูกต้อง'
      });
    }

    if (!DIFFICULTY_LEVELS.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'ระดับความยากไม่ถูกต้อง'
      });
    }

    // In real app, get trainer info from authenticated user
    const trainerId = 1; // Mock trainer ID

    // Check if trainer already has 3 packages
    const trainerPackages = packages.filter(p => p.trainerId === trainerId && p.isActive);
    if (trainerPackages.length >= 3) {
      return res.status(400).json({
        success: false,
        message: 'คุณสร้างแพคเกจได้สูงสุด 3 แพคเกจ'
      });
    }

    // Check for duplicate package names by same trainer
    const existingPackage = packages.find(p => 
      p.trainerId === trainerId && 
      p.name.toLowerCase() === name.toLowerCase() &&
      p.isActive
    );

    if (existingPackage) {
      return res.status(400).json({
        success: false,
        message: 'คุณมีแพคเกจชื่อนี้อยู่แล้ว'
      });
    }

    const newPackage = {
      id: packages.length + 1,
      trainerId,
      trainerName: 'เทรนเนอร์', // In real app, get from database
      name: name.trim(),
      description: description.trim(),
      sessions: parseInt(sessions),
      duration: parseInt(duration),
      price: parseInt(price),
      originalPrice: originalPrice ? parseInt(originalPrice) : parseInt(price),
      features: Array.isArray(features) ? features.map(f => f.trim()).filter(f => f) : [],
      included: Array.isArray(included) ? included : [],
      excluded: Array.isArray(excluded) ? excluded : [],
      isRecommended: false,
      isActive: true,
      isPopular: false,
      category,
      difficulty,
      targetAudience: Array.isArray(targetAudience) ? targetAudience : [],
      minAge: parseInt(minAge),
      maxAge: parseInt(maxAge),
      prerequisites: Array.isArray(prerequisites) ? prerequisites : [],
      cancellationPolicy,
      reschedulePolicy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    packages.push(newPackage);

    res.status(201).json({
      success: true,
      message: 'สร้างแพคเกจสำเร็จ',
      data: newPackage
    });

  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างแพคเกจ'
    });
  }
});

// @route   PUT /api/packages/:id
// @desc    Update package
// @access  Private (Trainer)
router.put('/:id', (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const packageIndex = packages.findIndex(p => p.id === packageId);

    if (packageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบแพคเกจที่ระบุ'
      });
    }

    // In real app, check if package belongs to authenticated trainer
    const trainerId = 1; // Mock trainer ID
    if (packages[packageIndex].trainerId !== trainerId) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์แก้ไขแพคเกจนี้'
      });
    }

    const updateData = req.body;

    // Validate category and difficulty if provided
    if (updateData.category && !PACKAGE_CATEGORIES.includes(updateData.category)) {
      return res.status(400).json({
        success: false,
        message: 'หมวดหมู่แพคเกจไม่ถูกต้อง'
      });
    }

    if (updateData.difficulty && !DIFFICULTY_LEVELS.includes(updateData.difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'ระดับความยากไม่ถูกต้อง'
      });
    }

    // Update allowed fields
    const allowedFields = [
      'name', 'description', 'sessions', 'duration', 'price', 'originalPrice',
      'features', 'included', 'excluded', 'category', 'difficulty', 'targetAudience',
      'minAge', 'maxAge', 'prerequisites', 'cancellationPolicy', 'reschedulePolicy'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'name' && typeof updateData[field] === 'string') {
          packages[packageIndex][field] = updateData[field].trim();
        } else if (field === 'description' && typeof updateData[field] === 'string') {
          packages[packageIndex][field] = updateData[field].trim();
        } else if (['sessions', 'duration', 'price', 'originalPrice', 'minAge', 'maxAge'].includes(field)) {
          packages[packageIndex][field] = parseInt(updateData[field]);
        } else if (['features', 'included', 'excluded', 'targetAudience', 'prerequisites'].includes(field)) {
          packages[packageIndex][field] = Array.isArray(updateData[field]) ? updateData[field] : [];
        } else {
          packages[packageIndex][field] = updateData[field];
        }
      }
    });

    packages[packageIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'อัพเดทแพคเกจสำเร็จ',
      data: packages[packageIndex]
    });

  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทแพคเกจ'
    });
  }
});

// @route   PUT /api/packages/:id/status
// @desc    Update package status (active/inactive)
// @access  Private (Trainer)
router.put('/:id/status', (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const packageIndex = packages.findIndex(p => p.id === packageId);

    if (packageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบแพคเกจที่ระบุ'
      });
    }

    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'สถานะต้องเป็น true หรือ false'
      });
    }

    packages[packageIndex].isActive = isActive;
    packages[packageIndex].updatedAt = new Date().toISOString();

    const action = isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน';

    res.json({
      success: true,
      message: `${action}แพคเกจสำเร็จ`,
      data: packages[packageIndex]
    });

  } catch (error) {
    console.error('Update package status error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะแพคเกจ'
    });
  }
});

// @route   PUT /api/packages/:id/recommend
// @desc    Set package as recommended
// @access  Private (Trainer)
router.put('/:id/recommend', (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const packageIndex = packages.findIndex(p => p.id === packageId);

    if (packageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบแพคเกจที่ระบุ'
      });
    }

    // In real app, check if package belongs to authenticated trainer
    const trainerId = 1; // Mock trainer ID
    if (packages[packageIndex].trainerId !== trainerId) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์แก้ไขแพคเกจนี้'
      });
    }

    // Remove recommended status from other packages by same trainer
    packages.forEach((pkg, index) => {
      if (pkg.trainerId === trainerId && index !== packageIndex) {
        pkg.isRecommended = false;
      }
    });

    // Set current package as recommended
    packages[packageIndex].isRecommended = true;
    packages[packageIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'ตั้งค่าแพคเกจแนะนำสำเร็จ',
      data: packages[packageIndex]
    });

  } catch (error) {
    console.error('Set recommended package error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตั้งค่าแพคเกจแนะนำ'
    });
  }
});

// @route   POST /api/packages/:id/purchase
// @desc    Purchase package
// @access  Private (Client)
router.post('/:id/purchase', (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const package = packages.find(p => p.id === packageId);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบแพคเกจที่ระบุ'
      });
    }

    if (!package.isActive) {
      return res.status(400).json({
        success: false,
        message: 'แพคเกจนี้ไม่เปิดให้บริการ'
      });
    }

    const { paymentMethod, couponCode } = req.body;

    // In real app, get client info from authenticated user
    const clientId = 1; // Mock client ID

    // Check if client already has active package with same trainer
    // (This is business logic - you might want to allow multiple packages)
    
    // Calculate final price (apply discounts, coupons, etc.)
    let finalPrice = package.price;
    let discount = 0;

    if (couponCode) {
      // Mock coupon validation
      if (couponCode === 'FIRST10') {
        discount = Math.round(package.price * 0.1);
        finalPrice = package.price - discount;
      }
    }

    // Mock purchase record
    const purchase = {
      id: Date.now(), // Simple ID generation for mock
      clientId,
      packageId: package.id,
      trainerId: package.trainerId,
      packageName: package.name,
      originalPrice: package.price,
      discount,
      finalPrice,
      paymentMethod: paymentMethod || 'credit_card',
      couponCode: couponCode || null,
      status: 'completed', // In real app, this would be 'pending' initially
      purchasedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + package.duration * 24 * 60 * 60 * 1000).toISOString(),
      remainingSessions: package.sessions,
      totalSessions: package.sessions
    };

    // In real app, save to database and process payment

    res.status(201).json({
      success: true,
      message: 'ซื้อแพคเกจสำเร็จ',
      data: {
        purchase,
        package: {
          id: package.id,
          name: package.name,
          sessions: package.sessions,
          duration: package.duration
        }
      }
    });

  } catch (error) {
    console.error('Purchase package error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการซื้อแพคเกจ'
    });
  }
});

// @route   GET /api/packages/categories
// @desc    Get package categories and metadata
// @access  Public
router.get('/categories', (req, res) => {
  try {
    const metadata = {
      categories: PACKAGE_CATEGORIES.map(cat => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' '),
        count: packages.filter(p => p.category === cat && p.isActive).length
      })),
      difficulties: DIFFICULTY_LEVELS.map(diff => ({
        value: diff,
        label: diff.charAt(0).toUpperCase() + diff.slice(1),
        count: packages.filter(p => p.difficulty === diff && p.isActive).length
      })),
      targetAudiences: TARGET_AUDIENCES.map(audience => ({
        value: audience,
        label: audience.charAt(0).toUpperCase() + audience.slice(1).replace('_', ' '),
        count: packages.filter(p => p.targetAudience.includes(audience) && p.isActive).length
      })),
      priceRanges: [
        { min: 0, max: 10000, label: 'ต่ำกว่า 10,000 บาท' },
        { min: 10000, max: 20000, label: '10,000 - 20,000 บาท' },
        { min: 20000, max: 30000, label: '20,000 - 30,000 บาท' },
        { min: 30000, max: 999999, label: 'มากกว่า 30,000 บาท' }
      ].map(range => ({
        ...range,
        count: packages.filter(p => 
          p.price >= range.min && p.price < range.max && p.isActive
        ).length
      }))
    };

    res.json({
      success: true,
      data: metadata
    });

  } catch (error) {
    console.error('Get package categories error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่'
    });
  }
});

// @route   DELETE /api/packages/:id
// @desc    Delete package (Trainer/Admin)
// @access  Private
router.delete('/:id', (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const packageIndex = packages.findIndex(p => p.id === packageId);

    if (packageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบแพคเกจที่ระบุ'
      });
    }

    // In real app, check if package belongs to authenticated trainer
    const trainerId = 1; // Mock trainer ID
    if (packages[packageIndex].trainerId !== trainerId) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์ลบแพคเกจนี้'
      });
    }

    // Soft delete - just deactivate instead of permanent deletion
    packages[packageIndex].isActive = false;
    packages[packageIndex].deletedAt = new Date().toISOString();
    packages[packageIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'ลบแพคเกจสำเร็จ'
    });

  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบแพคเกจ'
    });
  }
});

module.exports = router;
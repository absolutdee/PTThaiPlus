// server/routes/trainers.js
const express = require('express');
const router = express.Router();

// Mock trainer database
let trainers = [
  {
    id: 1,
    userId: 1,
    firstName: 'จอห์น',
    lastName: 'ทรัพย์สิน',
    displayName: 'จอห์น ทรัพย์สิน',
    email: 'john@example.com',
    phone: '081-234-5678',
    bio: 'เทรนเนอร์มืออาชีพด้วยประสบการณ์กว่า 5 ปี เชี่ยวชาญในการสร้างกล้ามเนื้อและลดน้ำหนัก',
    specialties: ['Weight Training', 'Muscle Building', 'Fat Loss'],
    certifications: ['ACSM Certified', 'NASM Personal Trainer'],
    experience: 5,
    hourlyRate: 1500,
    city: 'กรุงเทพฯ',
    province: 'กรุงเทพมหานคร',
    serviceAreas: ['กรุงเทพฯ', 'สมุทรปราการ'],
    rating: 4.8,
    totalReviews: 125,
    totalSessions: 580,
    profilePicture: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop'
    ],
    isVerified: true,
    isFeatured: true,
    isActive: true,
    workingHours: {
      monday: ['09:00-12:00', '14:00-18:00'],
      tuesday: ['09:00-12:00', '14:00-18:00'],
      wednesday: ['09:00-12:00', '14:00-18:00'],
      thursday: ['09:00-12:00', '14:00-18:00'],
      friday: ['09:00-12:00', '14:00-18:00'],
      saturday: ['09:00-15:00'],
      sunday: ['off']
    },
    packages: [
      {
        id: 1,
        name: 'Basic Package',
        sessions: 8,
        duration: 30,
        price: 12000,
        description: '8 เซสชั่นฝึกซ้อม 1 เดือน',
        isRecommended: false
      },
      {
        id: 2,
        name: 'Premium Package',
        sessions: 16,
        duration: 60,
        price: 20000,
        description: '16 เซสชั่นฝึกซ้อม 2 เดือน + แผนโภชนาการ',
        isRecommended: true
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 2,
    firstName: 'เจน',
    lastName: 'ฟิตเนส',
    displayName: 'เจน ฟิตเนส',
    email: 'jane@example.com',
    phone: '082-345-6789',
    bio: 'เชี่ยวชาญด้าน Cardio และ HIIT มีประสบการณ์ 3 ปี',
    specialties: ['Cardio', 'HIIT', 'Weight Loss'],
    certifications: ['ACE Certified'],
    experience: 3,
    hourlyRate: 1200,
    city: 'กรุงเทพฯ',
    province: 'กรุงเทพมหานคร',
    serviceAreas: ['กรุงเทพฯ'],
    rating: 4.9,
    totalReviews: 89,
    totalSessions: 320,
    profilePicture: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&h=600&fit=crop'
    ],
    isVerified: true,
    isFeatured: true,
    isActive: true,
    workingHours: {
      monday: ['06:00-09:00', '18:00-21:00'],
      tuesday: ['06:00-09:00', '18:00-21:00'],
      wednesday: ['06:00-09:00', '18:00-21:00'],
      thursday: ['06:00-09:00', '18:00-21:00'],
      friday: ['06:00-09:00', '18:00-21:00'],
      saturday: ['08:00-12:00'],
      sunday: ['off']
    },
    packages: [
      {
        id: 3,
        name: 'Cardio Blast',
        sessions: 12,
        duration: 45,
        price: 14400,
        description: '12 เซสชั่น Cardio + HIIT',
        isRecommended: true
      }
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    userId: 3,
    firstName: 'ไมค์',
    lastName: 'โยคะ',
    displayName: 'ไมค์ โยคะ',
    email: 'mike@example.com',
    phone: '083-456-7890',
    bio: 'ผู้เชี่ยวชาญด้าน Yoga และ Pilates ประสบการณ์ 7 ปี',
    specialties: ['Yoga', 'Pilates', 'Flexibility'],
    certifications: ['RYT-200', 'Pilates Mat Certified'],
    experience: 7,
    hourlyRate: 1000,
    city: 'เชียงใหม่',
    province: 'เชียงใหม่',
    serviceAreas: ['เชียงใหม่'],
    rating: 4.7,
    totalReviews: 67,
    totalSessions: 445,
    profilePicture: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=600&h=600&fit=crop'
    ],
    isVerified: true,
    isFeatured: false,
    isActive: true,
    workingHours: {
      monday: ['07:00-10:00', '17:00-20:00'],
      tuesday: ['07:00-10:00', '17:00-20:00'],
      wednesday: ['07:00-10:00', '17:00-20:00'],
      thursday: ['07:00-10:00', '17:00-20:00'],
      friday: ['07:00-10:00', '17:00-20:00'],
      saturday: ['08:00-12:00'],
      sunday: ['08:00-11:00']
    },
    packages: [
      {
        id: 4,
        name: 'Yoga Flow',
        sessions: 10,
        duration: 60,
        price: 10000,
        description: '10 เซสชั่น Yoga + Meditation',
        isRecommended: true
      }
    ],
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    userId: 4,
    firstName: 'แอนนา',
    lastName: 'ฟิต',
    displayName: 'แอนนา ฟิต',
    email: 'anna@example.com',
    phone: '084-567-8901',
    bio: 'CrossFit และ Functional Training เทรนเนอร์ประสบการณ์ 4 ปี',
    specialties: ['CrossFit', 'Functional Training', 'Strength'],
    certifications: ['CrossFit Level 1', 'Functional Movement Screen'],
    experience: 4,
    hourlyRate: 1300,
    city: 'ภูเก็ต',
    province: 'ภูเก็ต',
    serviceAreas: ['ภูเก็ต', 'พังงา'],
    rating: 4.6,
    totalReviews: 93,
    totalSessions: 276,
    profilePicture: 'https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=400&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=600&h=600&fit=crop'
    ],
    isVerified: true,
    isFeatured: true,
    isActive: true,
    workingHours: {
      monday: ['06:00-09:00', '16:00-19:00'],
      tuesday: ['06:00-09:00', '16:00-19:00'],
      wednesday: ['06:00-09:00', '16:00-19:00'],
      thursday: ['06:00-09:00', '16:00-19:00'],
      friday: ['06:00-09:00', '16:00-19:00'],
      saturday: ['07:00-12:00'],
      sunday: ['off']
    },
    packages: [
      {
        id: 5,
        name: 'CrossFit Power',
        sessions: 15,
        duration: 45,
        price: 19500,
        description: '15 เซสชั่น CrossFit + Functional Training',
        isRecommended: true
      }
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
];

// Helper functions
const formatTrainerResponse = (trainer) => {
  return {
    id: trainer.id,
    firstName: trainer.firstName,
    lastName: trainer.lastName,
    displayName: trainer.displayName,
    bio: trainer.bio,
    specialties: trainer.specialties,
    certifications: trainer.certifications,
    experience: trainer.experience,
    hourlyRate: trainer.hourlyRate,
    city: trainer.city,
    province: trainer.province,
    serviceAreas: trainer.serviceAreas,
    rating: trainer.rating,
    totalReviews: trainer.totalReviews,
    totalSessions: trainer.totalSessions,
    profilePicture: trainer.profilePicture,
    gallery: trainer.gallery,
    isVerified: trainer.isVerified,
    isFeatured: trainer.isFeatured,
    workingHours: trainer.workingHours,
    packages: trainer.packages,
    createdAt: trainer.createdAt
  };
};

// @route   GET /api/trainers
// @desc    Get all trainers with filtering and pagination
// @access  Public
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      specialty,
      city,
      province,
      minRating,
      maxPrice,
      minPrice,
      featured,
      verified,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    let filteredTrainers = trainers.filter(trainer => trainer.isActive);

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTrainers = filteredTrainers.filter(trainer =>
        trainer.displayName.toLowerCase().includes(searchLower) ||
        trainer.bio.toLowerCase().includes(searchLower) ||
        trainer.specialties.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    if (specialty) {
      filteredTrainers = filteredTrainers.filter(trainer =>
        trainer.specialties.some(s => 
          s.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    }

    if (city) {
      filteredTrainers = filteredTrainers.filter(trainer =>
        trainer.city.toLowerCase().includes(city.toLowerCase()) ||
        trainer.serviceAreas.some(area => 
          area.toLowerCase().includes(city.toLowerCase())
        )
      );
    }

    if (province) {
      filteredTrainers = filteredTrainers.filter(trainer =>
        trainer.province.toLowerCase().includes(province.toLowerCase())
      );
    }

    if (minRating) {
      filteredTrainers = filteredTrainers.filter(trainer =>
        trainer.rating >= parseFloat(minRating)
      );
    }

    if (minPrice) {
      filteredTrainers = filteredTrainers.filter(trainer =>
        trainer.hourlyRate >= parseInt(minPrice)
      );
    }

    if (maxPrice) {
      filteredTrainers = filteredTrainers.filter(trainer =>
        trainer.hourlyRate <= parseInt(maxPrice)
      );
    }

    if (featured === 'true') {
      filteredTrainers = filteredTrainers.filter(trainer => trainer.isFeatured);
    }

    if (verified === 'true') {
      filteredTrainers = filteredTrainers.filter(trainer => trainer.isVerified);
    }

    // Sorting
    filteredTrainers.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'name') {
        aValue = a.displayName;
        bValue = b.displayName;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedTrainers = filteredTrainers.slice(startIndex, endIndex);

    // Format response
    const formattedTrainers = paginatedTrainers.map(formatTrainerResponse);

    res.json({
      success: true,
      data: formattedTrainers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredTrainers.length / parseInt(limit)),
        total: filteredTrainers.length,
        hasNext: endIndex < filteredTrainers.length,
        hasPrev: startIndex > 0
      }
    });

  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเทรนเนอร์'
    });
  }
});

// @route   GET /api/trainers/featured
// @desc    Get featured trainers
// @access  Public
router.get('/featured', (req, res) => {
  try {
    const { limit = 4 } = req.query;

    const featuredTrainers = trainers
      .filter(trainer => trainer.isActive && trainer.isFeatured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, parseInt(limit))
      .map(formatTrainerResponse);

    res.json({
      success: true,
      data: featuredTrainers,
      total: featuredTrainers.length
    });

  } catch (error) {
    console.error('Get featured trainers error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเทรนเนอร์แนะนำ'
    });
  }
});

// @route   GET /api/trainers/:id
// @desc    Get single trainer by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const trainerId = parseInt(req.params.id);
    
    const trainer = trainers.find(t => t.id === trainerId && t.isActive);
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเทรนเนอร์ที่ระบุ'
      });
    }

    // Include additional details for single trainer view
    const trainerDetail = {
      ...formatTrainerResponse(trainer),
      email: trainer.email,
      phone: trainer.phone,
      // Add more detailed info that's not shown in list view
      detailedBio: trainer.bio,
      achievements: trainer.achievements || [],
      languages: trainer.languages || ['ไทย'],
      education: trainer.education || []
    };

    res.json({
      success: true,
      data: trainerDetail
    });

  } catch (error) {
    console.error('Get trainer detail error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเทรนเนอร์'
    });
  }
});

// @route   POST /api/trainers/:id/view
// @desc    Record trainer profile view
// @access  Public
router.post('/:id/view', (req, res) => {
  try {
    const trainerId = parseInt(req.params.id);
    const { timestamp, source, searchParams } = req.body;
    
    const trainer = trainers.find(t => t.id === trainerId);
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเทรนเนอร์ที่ระบุ'
      });
    }

    // In a real app, you'd save this to a views/analytics table
    console.log('Trainer view recorded:', {
      trainerId,
      timestamp,
      source,
      searchParams
    });

    // Increment view count (in memory for demo)
    if (!trainer.viewCount) trainer.viewCount = 0;
    trainer.viewCount++;

    res.json({
      success: true,
      message: 'บันทึกการเข้าชมเรียบร้อยแล้ว'
    });

  } catch (error) {
    console.error('Record trainer view error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกการเข้าชม'
    });
  }
});

// @route   GET /api/trainers/:id/packages
// @desc    Get trainer packages
// @access  Public
router.get('/:id/packages', (req, res) => {
  try {
    const trainerId = parseInt(req.params.id);
    
    const trainer = trainers.find(t => t.id === trainerId && t.isActive);
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเทรนเนอร์ที่ระบุ'
      });
    }

    res.json({
      success: true,
      data: trainer.packages || [],
      trainerId: trainer.id,
      trainerName: trainer.displayName
    });

  } catch (error) {
    console.error('Get trainer packages error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแพคเกจ'
    });
  }
});

// @route   GET /api/trainers/:id/reviews
// @desc    Get trainer reviews
// @access  Public
router.get('/:id/reviews', (req, res) => {
  try {
    const trainerId = parseInt(req.params.id);
    const { page = 1, limit = 10 } = req.query;
    
    const trainer = trainers.find(t => t.id === trainerId && t.isActive);
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเทรนเนอร์ที่ระบุ'
      });
    }

    // Mock reviews data
    const mockReviews = [
      {
        id: 1,
        clientName: 'สมศรี ใจดี',
        rating: 5,
        comment: 'เทรนเนอร์ดีมาก อธิบายชัดเจน ผลลัพธ์ดีเกินคาด',
        date: '2024-01-15T00:00:00Z',
        verifiedPurchase: true
      },
      {
        id: 2,
        clientName: 'ธนากร มีสุข',
        rating: 5,
        comment: 'ประทับใจมาก แนะนำเลยครับ',
        date: '2024-01-10T00:00:00Z',
        verifiedPurchase: true
      }
    ];

    res.json({
      success: true,
      data: mockReviews,
      pagination: {
        current: parseInt(page),
        pages: 1,
        total: mockReviews.length
      }
    });

  } catch (error) {
    console.error('Get trainer reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว'
    });
  }
});

// @route   GET /api/trainers/:id/availability
// @desc    Get trainer availability
// @access  Public
router.get('/:id/availability', (req, res) => {
  try {
    const trainerId = parseInt(req.params.id);
    const { date, week } = req.query;
    
    const trainer = trainers.find(t => t.id === trainerId && t.isActive);
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเทรนเนอร์ที่ระบุ'
      });
    }

    // Mock availability data
    const availability = {
      workingHours: trainer.workingHours,
      bookedSlots: [
        // Mock some booked slots
        { date: '2024-07-26', time: '09:00-10:00' },
        { date: '2024-07-26', time: '14:00-15:00' }
      ],
      availableSlots: [
        { date: '2024-07-26', time: '10:00-11:00' },
        { date: '2024-07-26', time: '11:00-12:00' },
        { date: '2024-07-26', time: '15:00-16:00' }
      ]
    };

    res.json({
      success: true,
      data: availability
    });

  } catch (error) {
    console.error('Get trainer availability error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลตารางเวลา'
    });
  }
});

module.exports = router;
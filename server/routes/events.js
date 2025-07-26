// server/routes/events.js
const express = require('express');
const router = express.Router();

// Mock events database
let events = [
  {
    id: 1,
    title: 'Marathon Bangkok 2024',
    slug: 'marathon-bangkok-2024',
    description: 'การแข่งขันวิ่งมาราธอนประจำปี 2024 ที่ใหญ่ที่สุดในเอเชียตะวันออกเฉียงใต้',
    location: 'ลุมพินี พาร์ค, กรุงเทพฯ',
    address: '123 ถนนราชดำริ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330',
    eventDate: '2024-02-15T06:00:00Z',
    registrationStart: '2024-01-01T00:00:00Z',
    registrationEnd: '2024-02-10T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop'
    ],
    categories: ['วิ่ง', 'มาราธอน', 'กีฬา'],
    organizer: {
      name: 'Bangkok Marathon Organization',
      contact: 'info@bangkokmarathon.com',
      phone: '02-123-4567'
    },
    registrationFee: 1500,
    maxParticipants: 10000,
    currentParticipants: 8543,
    distances: ['5K', '10K', '21K', '42K'],
    ageGroups: ['18-29', '30-39', '40-49', '50-59', '60+'],
    prizes: [
      { position: '1st Place', prize: '50,000 บาท + ถ้วยรางวัล' },
      { position: '2nd Place', prize: '30,000 บาท + เหรียญทอง' },
      { position: '3rd Place', prize: '20,000 บาท + เหรียญเงิน' }
    ],
    schedule: [
      { time: '05:30', activity: 'เปิดลงทะเบียน' },
      { time: '06:00', activity: 'เริ่มการแข่งขัน 42K' },
      { time: '06:30', activity: 'เริ่มการแข่งขัน 21K' },
      { time: '07:00', activity: 'เริ่มการแข่งขัน 10K & 5K' },
      { time: '12:00', activity: 'พิธีมอบรางวัล' }
    ],
    requirements: [
      'อายุ 18 ปีขึ้นไป',
      'ใบรับรองแพทย์ (สำหรับระยะ 21K และ 42K)',
      'ประกันอุบัติเหตุ',
      'เสื้อผ้าและรองเท้าที่เหมาะสม'
    ],
    includedItems: [
      'เสื้อการแข่งขัน',
      'เบอร์วิ่ง',
      'เหรียญที่ระลึก',
      'ของขวัญในกระเป๋า',
      'อาหารและเครื่องดื่มฟรี'
    ],
    status: 'open',
    isFeatured: true,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Yoga Festival 2024',
    slug: 'yoga-festival-2024',
    description: 'เทศกาลโยคะใหญ่ที่สุดในประเทศไทย มาร่วมฝึกโยคะกับครูโยคะชื่อดังจากทั่วโลก',
    location: 'Central World, กรุงเทพฯ',
    address: '999/9 ถนนราชดำริ แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330',
    eventDate: '2024-03-20T09:00:00Z',
    registrationStart: '2024-02-01T00:00:00Z',
    registrationEnd: '2024-03-15T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop'
    ],
    categories: ['โยคะ', 'ผ่อนคลาย', 'สุขภาพ'],
    organizer: {
      name: 'Thailand Yoga Association',
      contact: 'info@yogathailand.com',
      phone: '02-234-5678'
    },
    registrationFee: 800,
    maxParticipants: 500,
    currentParticipants: 324,
    levels: ['เริ่มต้น', 'กลาง', 'สูง'],
    instructors: [
      'ครูอุมา - Hatha Yoga Master',
      'ครูสุดา - Vinyasa Specialist',
      'ครูมานะ - Meditation Expert'
    ],
    schedule: [
      { time: '09:00', activity: 'ลงทะเบียน' },
      { time: '10:00', activity: 'Morning Flow Session' },
      { time: '12:00', activity: 'อาหารกลางวันแบบเจ' },
      { time: '14:00', activity: 'Workshop Sessions' },
      { time: '16:00', activity: 'Meditation & Closing' }
    ],
    includedItems: [
      'เสื่อโยคะ',
      'น้ำดื่มและของว่างเพื่อสุขภาพ',
      'ของที่ระลึก',
      'ใบประกาศนียบัตร'
    ],
    status: 'open',
    isFeatured: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
];

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status = 'open',
      featured,
      upcoming = 'true'
    } = req.query;

    let filteredEvents = [...events];

    // Filter by status
    if (status !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.status === status);
    }

    // Filter upcoming events
    if (upcoming === 'true') {
      const now = new Date();
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.eventDate) > now
      );
    }

    // Apply other filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
    }

    if (category) {
      filteredEvents = filteredEvents.filter(event =>
        event.categories.some(cat => 
          cat.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    if (featured === 'true') {
      filteredEvents = filteredEvents.filter(event => event.isFeatured);
    }

    // Sort by event date
    filteredEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedEvents,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredEvents.length / parseInt(limit)),
        total: filteredEvents.length,
        hasNext: endIndex < filteredEvents.length,
        hasPrev: startIndex > 0
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลอีเว้นท์'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบอีเว้นท์ที่ระบุ'
      });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Get event detail error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลอีเว้นท์'
    });
  }
});

module.exports = router;
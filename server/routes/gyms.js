const express2 = require('express');
const router2 = express2.Router();

// Mock gyms database
let gyms = [
  {
    id: 1,
    name: 'Fitness First',
    description: 'ฟิตเนสเซ็นเตอร์ระดับพรีเมียมที่ให้บริการครบครัน',
    address: '123 ถนนสาทร แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
    district: 'สีลม',
    province: 'กรุงเทพมหานคร',
    phone: '02-123-4567',
    email: 'info@fitnessfirst-sathorn.com',
    website: 'https://www.fitnessfirst.co.th',
    coordinates: {
      lat: 13.7256,
      lng: 100.5316
    },
    rating: 4.5,
    reviewCount: 324,
    priceRange: '$$',
    openingHours: {
      monday: '05:00-23:00',
      tuesday: '05:00-23:00',
      wednesday: '05:00-23:00',
      thursday: '05:00-23:00',
      friday: '05:00-23:00',
      saturday: '06:00-22:00',
      sunday: '06:00-22:00'
    },
    facilities: [
      'Weight Training Area',
      'Cardio Zone',
      'Group Exercise Studio',
      'Swimming Pool',
      'Sauna & Steam',
      'Personal Training',
      'Locker Rooms',
      'Parking'
    ],
    classes: [
      'Yoga', 'Pilates', 'Zumba', 'Body Combat', 'Spinning'
    ],
    membershipPlans: [
      {
        name: 'Basic',
        price: 2500,
        duration: 'เดือน',
        features: ['Gym Access', 'Basic Classes']
      },
      {
        name: 'Premium',
        price: 4500,
        duration: 'เดือน',
        features: ['Full Access', 'All Classes', 'Pool', 'Personal Trainer 2 sessions']
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop'
    ],
    amenities: ['Wi-Fi', 'Air Conditioning', 'Towel Service', 'Protein Bar'],
    isVerified: true,
    isFeatured: true,
    createdAt: '2023-12-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Virgin Active',
    description: 'โรงยิมสมัยใหม่พร้อมเครื่องออกกำลังกายล้ำสมัย',
    address: '456 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110',
    district: 'สุขุมวิท',
    province: 'กรุงเทพมหานคร',
    phone: '02-234-5678',
    email: 'info@virginactive-sukhumvit.com',
    website: 'https://www.virginactive.co.th',
    coordinates: {
      lat: 13.7398,
      lng: 100.5608
    },
    rating: 4.7,
    reviewCount: 189,
    priceRange: '$$$',
    openingHours: {
      monday: '06:00-22:00',
      tuesday: '06:00-22:00',
      wednesday: '06:00-22:00',
      thursday: '06:00-22:00',
      friday: '06:00-22:00',
      saturday: '07:00-21:00',
      sunday: '07:00-21:00'
    },
    facilities: [
      'Modern Gym Equipment',
      'Functional Training Area',
      'Virtual Reality Fitness',
      'Spa & Wellness Center',
      'Juice Bar',
      'Kids Club'
    ],
    classes: [
      'CrossFit', 'HIIT', 'Barre', 'Aqua Fitness', 'Boxing'
    ],
    membershipPlans: [
      {
        name: 'Standard',
        price: 3200,
        duration: 'เดือน',
        features: ['Gym Access', 'Group Classes', 'Spa Access']
      },
      {
        name: 'VIP',
        price: 5500,
        duration: 'เดือน',
        features: ['Full Access', 'Personal Training', 'Nutrition Consultation', 'Guest Passes']
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop'
    ],
    amenities: ['Valet Parking', 'Concierge', 'Massage', 'Childcare'],
    isVerified: true,
    isFeatured: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// @route   GET /api/gyms
// @desc    Get all gyms
// @access  Public
router2.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      district,
      province,
      priceRange,
      facilities,
      featured
    } = req.query;

    let filteredGyms = [...gyms];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredGyms = filteredGyms.filter(gym =>
        gym.name.toLowerCase().includes(searchLower) ||
        gym.description.toLowerCase().includes(searchLower) ||
        gym.district.toLowerCase().includes(searchLower)
      );
    }

    if (district) {
      filteredGyms = filteredGyms.filter(gym =>
        gym.district.toLowerCase().includes(district.toLowerCase())
      );
    }

    if (province) {
      filteredGyms = filteredGyms.filter(gym =>
        gym.province.toLowerCase().includes(province.toLowerCase())
      );
    }

    if (priceRange) {
      filteredGyms = filteredGyms.filter(gym => gym.priceRange === priceRange);
    }

    if (facilities) {
      const facilityList = facilities.split(',');
      filteredGyms = filteredGyms.filter(gym =>
        facilityList.some(facility =>
          gym.facilities.some(f =>
            f.toLowerCase().includes(facility.toLowerCase())
          )
        )
      );
    }

    if (featured === 'true') {
      filteredGyms = filteredGyms.filter(gym => gym.isFeatured);
    }

    // Sort by rating
    filteredGyms.sort((a, b) => b.rating - a.rating);

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedGyms = filteredGyms.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedGyms,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredGyms.length / parseInt(limit)),
        total: filteredGyms.length
      }
    });

  } catch (error) {
    console.error('Get gyms error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลยิม'
    });
  }
});

// @route   GET /api/gyms/:id
// @desc    Get single gym
// @access  Public
router2.get('/:id', (req, res) => {
  try {
    const gymId = parseInt(req.params.id);
    const gym = gyms.find(g => g.id === gymId);

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบยิมที่ระบุ'
      });
    }

    res.json({
      success: true,
      data: gym
    });

  } catch (error) {
    console.error('Get gym detail error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลยิม'
    });
  }
});

module.exports = router2;
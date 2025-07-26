const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://absolutdee.github.io'] 
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Static files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
}

// Import routes
const authRoutes = require('./routes/auth');
const trainerRoutes = require('./routes/trainers');
const clientRoutes = require('./routes/clients');
const sessionRoutes = require('./routes/sessions');
const packageRoutes = require('./routes/packages');
const reviewRoutes = require('./routes/reviews');
const articleRoutes = require('./routes/articles');
const eventRoutes = require('./routes/events');
const gymRoutes = require('./routes/gyms');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'FitConnect Backend is running!', 
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gyms', gymRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Newsletter endpoint
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email, source = 'website' } = req.body;
  
  console.log('📰 Newsletter subscription:', {
    email,
    source,
    timestamp: new Date().toISOString()
  });

  // TODO: Save to database
  // For now, just simulate success
  res.json({ 
    success: true, 
    message: 'สมัครรับข่าวสารเรียบร้อยแล้ว!',
    data: { email, subscribed_at: new Date().toISOString() }
  });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  console.log('📧 Contact form submission:', {
    name, email, subject, message,
    timestamp: new Date().toISOString()
  });

  // TODO: Send email or save to database
  
  res.json({ 
    success: true, 
    message: 'ข้อความของคุณถูกส่งเรียบร้อยแล้ว เราจะติดต่อกลับในเร็วๆ นี้',
    data: { submitted_at: new Date().toISOString() }
  });
});

// ===============================
// API Routes สำหรับ FitConnect
// ===============================

// Trainers API
app.get('/api/trainers', (req, res) => {
  const { search, specialty, location, rating } = req.query;
  
  // Mock data สำหรับ demo
  const mockTrainers = [
    {
      id: 1,
      name: 'จอห์น ทรัพย์สิน',
      specialty: 'Weight Training',
      location: 'กรุงเทพมหานคร',
      rating: 4.8,
      reviews: 125,
      price: 1500,
      image: '/images/trainers/trainer1.jpg',
      featured: true,
      experience: 5,
      certifications: ['ACSM', 'NASM']
    },
    {
      id: 2,
      name: 'เจน ฟิตเนส',
      specialty: 'Cardio & HIIT',
      location: 'กรุงเทพมหานคร',
      rating: 4.9,
      reviews: 89,
      price: 1200,
      image: '/images/trainers/trainer2.jpg',
      featured: false,
      experience: 3,
      certifications: ['ACE', 'HIIT Certified']
    },
    {
      id: 3,
      name: 'ไมค์ โยคะ',
      specialty: 'Yoga & Pilates',
      location: 'เชียงใหม่',
      rating: 4.7,
      reviews: 67,
      price: 1000,
      image: '/images/trainers/trainer3.jpg',
      featured: true,
      experience: 7,
      certifications: ['RYT-200', 'Pilates Mat']
    }
  ];

  let filteredTrainers = mockTrainers;

  // Apply filters
  if (search) {
    filteredTrainers = filteredTrainers.filter(trainer => 
      trainer.name.toLowerCase().includes(search.toLowerCase()) ||
      trainer.specialty.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (specialty) {
    filteredTrainers = filteredTrainers.filter(trainer => 
      trainer.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
  }

  if (location) {
    filteredTrainers = filteredTrainers.filter(trainer => 
      trainer.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (rating) {
    filteredTrainers = filteredTrainers.filter(trainer => 
      trainer.rating >= parseFloat(rating)
    );
  }

  res.json({ 
    trainers: filteredTrainers,
    total: filteredTrainers.length,
    page: 1,
    limit: 10
  });
});

// Get single trainer
app.get('/api/trainers/:id', (req, res) => {
  const trainerId = parseInt(req.params.id);
  
  // Mock trainer detail
  const trainerDetail = {
    id: trainerId,
    name: 'จอห์น ทรัพย์สิน',
    specialty: 'Weight Training & Muscle Building',
    location: 'กรุงเทพมหานคร',
    rating: 4.8,
    reviews: 125,
    price: 1500,
    image: '/images/trainers/trainer1.jpg',
    gallery: [
      '/images/trainers/trainer1-1.jpg',
      '/images/trainers/trainer1-2.jpg',
      '/images/trainers/trainer1-3.jpg'
    ],
    bio: 'มีประสบการณ์ในการเป็นเทรนเนอร์มากกว่า 5 ปี เชี่ยวชาญในการสร้างกล้ามเนื้อและลดน้ำหนัก',
    experience: 5,
    certifications: ['ACSM', 'NASM', 'Nutrition Specialist'],
    packages: [
      {
        id: 1,
        name: 'Basic Package',
        sessions: 8,
        duration: '1 เดือน',
        price: 12000,
        features: ['8 เซสชั่นฝึกซ้อม', 'แผนการออกกำลังกาย', 'คำปรึกษาพื้นฐาน'],
        recommended: false
      },
      {
        id: 2,
        name: 'Premium Package',
        sessions: 16,
        duration: '2 เดือน',
        price: 20000,
        features: ['16 เซสชั่นฝึกซ้อม', 'แผนการออกกำลังกาย', 'แผนโภชนาการ', 'การติดตาม 24/7'],
        recommended: true
      },
      {
        id: 3,
        name: 'VIP Package',
        sessions: 24,
        duration: '3 เดือน',
        price: 30000,
        features: ['24 เซสชั่นฝึกซ้อม', 'แผนการออกกำลังกายแบบส่วนตัว', 'แผนโภชนาการครบวงจร', 'การติดตาม 24/7', 'ของขวัญพิเศษ'],
        recommended: false
      }
    ],
    schedule: {
      monday: ['09:00-11:00', '14:00-16:00', '18:00-20:00'],
      tuesday: ['09:00-11:00', '14:00-16:00'],
      wednesday: ['09:00-11:00', '14:00-16:00', '18:00-20:00'],
      thursday: ['09:00-11:00', '14:00-16:00'],
      friday: ['09:00-11:00', '18:00-20:00'],
      saturday: ['09:00-12:00'],
      sunday: ['วันหยุด']
    }
  };

  res.json(trainerDetail);
});

// Customers API
app.get('/api/customers', (req, res) => {
  res.json({ 
    customers: [],
    message: 'Customer endpoints coming soon'
  });
});

// Gyms API
app.get('/api/gyms', (req, res) => {
  const mockGyms = [
    {
      id: 1,
      name: 'Fitness First',
      location: 'สาทร, กรุงเทพฯ',
      rating: 4.5,
      image: '/images/gyms/gym1.jpg',
      facilities: ['Weight Training', 'Cardio', 'Group Classes']
    },
    {
      id: 2,
      name: 'Virgin Active',
      location: 'สุขุมวิท, กรุงเทพฯ',
      rating: 4.7,
      image: '/images/gyms/gym2.jpg',
      facilities: ['Swimming Pool', 'Spa', 'Personal Training']
    }
  ];

  res.json({ gyms: mockGyms });
});

// Articles API
app.get('/api/articles', (req, res) => {
  const mockArticles = [
    {
      id: 1,
      title: '5 เทคนิคการออกกำลังกายที่มีประสิทธิภาพ',
      excerpt: 'เรียนรู้เทคนิคการออกกำลังกายที่จะช่วยให้คุณได้ผลลัพธ์ที่ดีที่สุด',
      image: '/images/articles/article1.jpg',
      author: 'ทีมงาน FitConnect',
      publishDate: '2024-01-15',
      category: 'การออกกำลังกาย'
    },
    {
      id: 2,
      title: 'โภชนาการที่ถูกต้องสำหรับนักกีฬา',
      excerpt: 'แนวทางการรับประทานอาหารที่เหมาะสมสำหรับคนที่ออกกำลังกายอย่างสม่ำเสมอ',
      image: '/images/articles/article2.jpg',
      author: 'นักโภชนาการ อันดา',
      publishDate: '2024-01-10',
      category: 'โภชนาการ'
    }
  ];

  res.json({ articles: mockArticles });
});

// Events API
app.get('/api/events', (req, res) => {
  const mockEvents = [
    {
      id: 1,
      title: 'Marathon Bangkok 2024',
      date: '2024-02-15',
      location: 'ลุมพินี พาร์ค',
      image: '/images/events/event1.jpg',
      description: 'การแข่งขันวิ่งมาราธอนประจำปี 2024'
    }
  ];

  res.json({ events: mockEvents });
});

// Contact API
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  console.log('📧 Contact form submission:', {
    name, email, subject, message,
    timestamp: new Date().toISOString()
  });

  // TODO: Send email or save to database
  
  res.json({ 
    success: true, 
    message: 'ข้อความของคุณถูกส่งเรียบร้อยแล้ว เราจะติดต่อกลับในเร็วๆ นี้' 
  });
});

// Newsletter subscription
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  
  console.log('📰 Newsletter subscription:', email);
  
  // TODO: Add to newsletter database
  
  res.json({ 
    success: true, 
    message: 'สมัครรับข่าวสารเรียบร้อยแล้ว!' 
  });
});

// ===============================
// Error handling
// ===============================
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Serve React app for production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

// Start server
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 FitConnect Server running on http://localhost:${PORT}`);
  console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use`);
    console.log(`💡 Try running: npx kill-port ${PORT}`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app;
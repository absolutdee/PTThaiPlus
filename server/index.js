// server/index.js - Quick Backend Server for FitConnect
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'FitConnect Backend is running! 🚀',
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mock data
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
    certifications: ['ACSM', 'NASM'],
    bio: 'เทรนเนอร์มืออาชีพด้วยประสบการณ์ 5 ปี เชี่ยวชาญด้าน Weight Training และ Strength Building'
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
    certifications: ['ACE', 'HIIT Certified'],
    bio: 'ผู้เชี่ยวชาญด้าน Cardio และ HIIT ที่จะช่วยให้คุณเผาผลาญไขมันได้อย่างมีประสิทธิภาพ'
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
    certifications: ['RYT-200', 'Pilates Mat Certified'],
    bio: 'ครูโยคะและพิลาทิสที่จะช่วยเพิ่มความยืดหยุ่นและความแข็งแรงของกล้ามเนื้อแกนกลาง'
  },
  {
    id: 4,
    name: 'แซม ฟิตเนส',
    specialty: 'Functional Training',
    location: 'ภูเก็ต',
    rating: 4.6,
    reviews: 95,
    price: 1300,
    image: '/images/trainers/trainer4.jpg',
    featured: false,
    experience: 4,
    certifications: ['NASM', 'FMS'],
    bio: 'เชี่ยวชาญด้าน Functional Training เพื่อการเคลื่อนไหวที่ดีขึ้นในชีวิตประจำวัน'
  }
];

const mockArticles = [
  {
    id: 1,
    title: '5 ท่าออกกำลังกายง่ายๆ ที่บ้าน',
    excerpt: 'ท่าออกกำลังกายที่ไม่ต้องใช้อุปกรณ์ สามารถทำได้ที่บ้าน เหมาะสำหรับผู้เริ่มต้น',
    content: 'เนื้อหาบทความเกี่ยวกับการออกกำลังกายที่บ้าน...',
    image: '/images/articles/article1.jpg',
    author: 'ทีมงาน FitConnect',
    publishedAt: '2024-07-26T10:00:00Z',
    category: 'exercise',
    tags: ['ออกกำลังกาย', 'ที่บ้าน', 'ผู้เริ่มต้น'],
    readTime: 5
  },
  {
    id: 2,
    title: 'โภชนาการสำหรับนักกีฬา',
    excerpt: 'อาหารที่ควรทานก่อนและหลังออกกำลังกาย เพื่อประสิทธิภาพสูงสุด',
    content: 'เนื้อหาบทความเกี่ยวกับโภชนาการ...',
    image: '/images/articles/article2.jpg',
    author: 'นักโภชนาการ สมใจ',
    publishedAt: '2024-07-25T14:30:00Z',
    category: 'nutrition',
    tags: ['โภชนาการ', 'นักกีฬา', 'อาหาร'],
    readTime: 8
  },
  {
    id: 3,
    title: 'การพักผ่อนและการฟื้นฟูกล้ามเนื้อ',
    excerpt: 'ความสำคัญของการพักผ่อนและวิธีการฟื้นฟูกล้ามเนื้อหลังออกกำลังกาย',
    content: 'เนื้อหาบทความเกี่ยวกับการฟื้นฟู...',
    image: '/images/articles/article3.jpg',
    author: 'ดร.สุขภาพ',
    publishedAt: '2024-07-24T16:15:00Z',
    category: 'recovery',
    tags: ['การพักผ่อน', 'ฟื้นฟู', 'กล้ามเนื้อ'],
    readTime: 6
  }
];

const mockEvents = [
  {
    id: 1,
    title: 'FitConnect Marathon 2024',
    description: 'งานวิ่งมาราธอนประจำปี รวมพลคนรักสุขภาพ',
    date: '2024-12-15T06:00:00Z',
    location: 'สวนลุมพินี กรุงเทพมหานคร',
    image: '/images/events/marathon.jpg',
    price: 500,
    category: 'running',
    participants: 250,
    maxParticipants: 500
  },
  {
    id: 2,
    title: 'Yoga in the Park',
    description: 'เซสชั่นโยคะในสวนสาธารณะ ผ่อนคลายกับธรรมชาติ',
    date: '2024-08-10T07:00:00Z',
    location: 'สวนจตุจักร กรุงเทพมหานคร',
    image: '/images/events/yoga-park.jpg',
    price: 0,
    category: 'yoga',
    participants: 45,
    maxParticipants: 100
  }
];

const mockGyms = [
  {
    id: 1,
    name: 'FitZone Gym',
    address: '123 ถนนสุขุมวิท กรุงเทพมหานคร',
    phone: '02-123-4567',
    rating: 4.5,
    amenities: ['Weight Training', 'Cardio', 'Swimming Pool', 'Sauna'],
    openingHours: '05:00 - 23:00',
    priceRange: '1500-3000',
    image: '/images/gyms/fitzone.jpg',
    latitude: 13.7563,
    longitude: 100.5018
  },
  {
    id: 2,
    name: 'PowerHouse Fitness',
    address: '456 ถนนพระราม 4 กรุงเทพมหานคร',
    phone: '02-234-5678',
    rating: 4.7,
    amenities: ['CrossFit', 'Functional Training', 'Personal Training'],
    openingHours: '06:00 - 22:00',
    priceRange: '2000-4000',
    image: '/images/gyms/powerhouse.jpg',
    latitude: 13.7441,
    longitude: 100.5389
  }
];

// API Routes
app.get('/api/trainers', (req, res) => {
  const { search, specialty, location, featured } = req.query;
  let filteredTrainers = [...mockTrainers];

  if (search) {
    filteredTrainers = filteredTrainers.filter(trainer => 
      trainer.name.includes(search) || 
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
      trainer.location.includes(location)
    );
  }

  if (featured === 'true') {
    filteredTrainers = filteredTrainers.filter(trainer => trainer.featured);
  }

  res.json({
    success: true,
    data: filteredTrainers,
    total: filteredTrainers.length
  });
});

app.get('/api/trainers/featured', (req, res) => {
  const featuredTrainers = mockTrainers.filter(trainer => trainer.featured);
  res.json({
    success: true,
    data: featuredTrainers
  });
});

app.get('/api/trainers/:id', (req, res) => {
  const trainer = mockTrainers.find(t => t.id === parseInt(req.params.id));
  if (!trainer) {
    return res.status(404).json({
      success: false,
      message: 'Trainer not found'
    });
  }
  res.json({
    success: true,
    data: trainer
  });
});

app.get('/api/articles', (req, res) => {
  const { category, search } = req.query;
  let filteredArticles = [...mockArticles];

  if (category) {
    filteredArticles = filteredArticles.filter(article => article.category === category);
  }

  if (search) {
    filteredArticles = filteredArticles.filter(article => 
      article.title.includes(search) || 
      article.excerpt.includes(search)
    );
  }

  res.json({
    success: true,
    data: filteredArticles,
    total: filteredArticles.length
  });
});

app.get('/api/articles/:id', (req, res) => {
  const article = mockArticles.find(a => a.id === parseInt(req.params.id));
  if (!article) {
    return res.status(404).json({
      success: false,
      message: 'Article not found'
    });
  }
  res.json({
    success: true,
    data: article
  });
});

app.get('/api/events', (req, res) => {
  const { category, upcoming } = req.query;
  let filteredEvents = [...mockEvents];

  if (category) {
    filteredEvents = filteredEvents.filter(event => event.category === category);
  }

  if (upcoming === 'true') {
    const now = new Date();
    filteredEvents = filteredEvents.filter(event => new Date(event.date) > now);
  }

  res.json({
    success: true,
    data: filteredEvents,
    total: filteredEvents.length
  });
});

app.get('/api/gyms', (req, res) => {
  const { search, amenity } = req.query;
  let filteredGyms = [...mockGyms];

  if (search) {
    filteredGyms = filteredGyms.filter(gym => 
      gym.name.includes(search) || 
      gym.address.includes(search)
    );
  }

  if (amenity) {
    filteredGyms = filteredGyms.filter(gym => 
      gym.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
    );
  }

  res.json({
    success: true,
    data: filteredGyms,
    total: filteredGyms.length
  });
});

// Newsletter subscription
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email } = req.body;
  console.log('📧 Newsletter subscription:', email);
  
  res.json({
    success: true,
    message: 'สมัครรับข่าวสารเรียบร้อยแล้ว!'
  });
});

// Contact form
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('📞 Contact form:', { name, email, subject });
  
  res.json({
    success: true,
    message: 'ข้อความของคุณถูกส่งเรียบร้อยแล้ว เราจะติดต่อกลับในเร็วๆ นี้'
  });
});

// 404 handler for API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 =================================');
  console.log(`📱 FitConnect Backend Server Started!`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
  console.log(`👨‍⚕️ Trainers: http://localhost:${PORT}/api/trainers`);
  console.log(`📰 Articles: http://localhost:${PORT}/api/articles`);
  console.log(`🎯 Events: http://localhost:${PORT}/api/events`);
  console.log(`🏋️ Gyms: http://localhost:${PORT}/api/gyms`);
  console.log('🚀 =================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});
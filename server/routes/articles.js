// server/routes/articles.js
const express = require('express');
const router = express.Router();

// Mock articles database
let articles = [
  {
    id: 1,
    title: '5 เทคนิคการออกกำลังกายที่มีประสิทธิภาพ',
    slug: '5-effective-workout-techniques',
    excerpt: 'เรียนรู้เทคนิคการออกกำลังกายที่จะช่วยให้คุณได้ผลลัพธ์ที่ดีที่สุด พร้อมคำแนะนำจากเทรนเนอร์มืออาชีพ',
    content: `
# 5 เทคนิคการออกกำลังกายที่มีประสิทธิภาพ

การออกกำลังกายอย่างมีประสิทธิภาพไม่ได้หมายความถึงการฝึกซ้อมหนักเพียงอย่างเดียว แต่ต้องใช้เทคนิคที่ถูกต้องด้วย

## 1. Progressive Overload (การเพิ่มความหนักแบบค่อยเป็นค่อยไป)

การเพิ่มน้ำหนัก จำนวนครั้ง หรือระยะเวลาในการออกกำลังกายแบบค่อยเป็นค่อยไป เป็นหลักการสำคัญในการพัฒนาความแข็งแรงและสร้างกล้ามเนื้อ

## 2. Compound Movements (การเคลื่อนไหวแบบ Compound)

การออกกำลังกายที่ใช้กล้ามเนื้อหลายกลุ่มพร้อมกัน เช่น Squat, Deadlift, Pull-up จะให้ผลลัพธ์ที่ดีกว่าการออกกำลังกายเฉพาะส่วน

## 3. Mind-Muscle Connection

การมีสมาธิกับกล้ามเนื้อที่กำลังทำงาน จะช่วยเพิ่มประสิทธิภาพการออกกำลังกายและลดการบาดเจ็บ

## 4. Rest and Recovery (การพักผ่อนและฟื้นฟู)

การพักผ่อนที่เพียงพอระหว่างเซต และการนอนหลับที่เพียงพอ เป็นปัจจัยสำคัญในการสร้างกล้ามเนื้อ

## 5. Consistency (ความสม่ำเสมอ)

การออกกำลังกายอย่างสม่ำเสมอ 3-4 วันต่อสัปดาห์ จะให้ผลลัพธ์ที่ดีกว่าการออกกำลังกายหนักแต่ไม่สม่ำเสมอ

## สรุป

การผลมรวมเทคนิคเหล่านี้เข้าด้วยกัน พร้อมกับการได้รับคำแนะนำจากเทรนเนอร์มืออาชีพ จะช่วยให้คุณบรรลุเป้าหมายได้อย่างมีประสิทธิภาพและปลอดภัย
    `,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    category: 'การออกกำลังกาย',
    tags: ['workout', 'techniques', 'fitness', 'training'],
    author: {
      id: 1,
      name: 'ทีมงาน FitConnect',
      bio: 'ทีมผู้เชี่ยวชาญด้านฟิตเนสและสุขภาพ',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    },
    publishedAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    status: 'published',
    isFeatured: true,
    viewCount: 1247,
    likeCount: 89,
    shareCount: 23,
    estimatedReadTime: 5,
    seoTitle: '5 เทคนิคการออกกำลังกายที่มีประสิทธิภาพ | FitConnect',
    seoDescription: 'เรียนรู้เทคนิคการออกกำลังกายที่มีประสิทธิภาพจากเทรนเนอร์มืออาชีพ Progressive Overload, Compound Movements และอีกมากมาย'
  },
  {
    id: 2,
    title: 'โภชนาการที่ถูกต้องสำหรับนักกีฬา',
    slug: 'proper-nutrition-for-athletes',
    excerpt: 'แนวทางการรับประทานอาหารที่เหมาะสมสำหรับคนที่ออกกำลังกายอย่างสม่ำเสมอ พร้อมเมนูแนะนำ',
    content: `
# โภชนาการที่ถูกต้องสำหรับนักกีฬา

การรับประทานอาหารที่ถูกต้องเป็นส่วนสำคัญที่จะช่วยให้การออกกำลังกายมีประสิทธิภาพสูงสุด

## หลักการพื้นฐาน

### 1. Macronutrients (สารอาหารหลัก)

- **โปรตีน**: 1.6-2.2 กรัม ต่อน้ำหนักตัว 1 กิโลกรัม
- **คาร์โบไฮเดรต**: 3-7 กรัม ต่อน้ำหนักตัว 1 กิโลกรัม
- **ไขมัน**: 20-35% ของแคลอรี่ทั้งหมด

### 2. Meal Timing (จังหวะการกิน)

- **ก่อนออกกำลังกาย**: คาร์โบไฮเดรต + โปรตีนเล็กน้อย (1-2 ชั่วโมงก่อน)
- **หลังออกกำลังกาย**: โปรตีน + คาร์โบไฮเดรต (ภายใน 30-60 นาที)

## แนวทางการกิน

### อาหารก่อนออกกำลังกาย
- กล้วย + อัลมอนด์
- ข้าวโอ๊ต + เบอร์รี่
- ขนมปังโฮลเกรน + น้ำผึ้ง

### อาหารหลังออกกำลังกาย
- เวย์โปรตีน + กล้วย
- ไก่ย่าง + ข้าวกล้อง
- ไข่ + โทสต์โฮลเกรน

## การดื่มน้ำ

- ดื่มน้ำ 2-3 ลิตรต่อวัน
- เพิ่มการดื่มน้ำขณะออกกำลังกาย
- เติม electrolytes หากออกกำลังกายเกิน 1 ชั่วโมง

## สรุป

การรับประทานอาหารที่เหมาะสมจะช่วยเพิ่มประสิทธิภาพการออกกำลังกาย เร่งการฟื้นฟู และลดการบาดเจ็บ
    `,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop',
    category: 'โภชนาการ',
    tags: ['nutrition', 'diet', 'sports', 'health'],
    author: {
      id: 2,
      name: 'นักโภชนาการ อันดา',
      bio: 'นักโภชนาการกีฬาประจำทีมชาติ ประสบการณ์ 10 ปี',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop'
    },
    publishedAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    status: 'published',
    isFeatured: true,
    viewCount: 892,
    likeCount: 67,
    shareCount: 34,
    estimatedReadTime: 7,
    seoTitle: 'โภชนาการที่ถูกต้องสำหรับนักกีฬา | คู่มือโภชนาการกีฬา',
    seoDescription: 'เรียนรู้แนวทางการรับประทานอาหารที่เหมาะสมสำหรับนักกีฬา การกิน Macronutrients และ Meal Timing ที่ถูกต้อง'
  },
  {
    id: 3,
    title: 'การพักผ่อนและการฟื้นฟูร่างกาย',
    slug: 'rest-and-recovery-guide',
    excerpt: 'ความสำคัญของการพักผ่อนที่เพียงพอต่อการออกกำลังกายและการสร้างกล้ามเนื้อ',
    content: `
# การพักผ่อนและการฟื้นฟูร่างกาย

การพักผ่อนเป็นส่วนสำคัญของการออกกำลังกายที่หลายคนมองข้าม แต่จริงๆ แล้วเป็นปัจจัยที่สำคัญต่อการได้ผลลัพธ์ที่ดี

## ทำไมการพักผ่อนจึงสำคัญ

### 1. การซ่อมแซมกล้ามเนื้อ
กล้ามเนื้อจะเติบโตในช่วงที่พักผ่อน ไม่ใช่ขณะออกกำลังกาย

### 2. การฟื้นฟูระบบประสาท
ระบบประสาทต้องการเวลาในการฟื้นฟูหลังจากการออกแรงอย่างหนัก

### 3. การป้องกันการบาดเจ็บ
การพักผ่อนที่เพียงพอช่วยลดความเสี่ยงของการบาดเจ็บจาก overtraining

## แนวทางการพักผ่อน

### การนอนหลับ
- นอน 7-9 ชั่วโมงต่อคืน
- เข้านอนและตื่นในเวลาเดียวกันทุกวัน
- หลีกเลี่ยงหน้าจอก่อนนอน 1 ชั่วโมง

### Active Recovery
- เดิน, ยืดเส้น, ว่ายน้ำเบาๆ
- โยคะ หรือ stretching
- นวดหรือ foam rolling

### การจัดการความเครียด
- การทำสมาธิ
- การหายใจลึก
- กิจกรรมที่ทำให้ผ่อนคลาย

## สัญญาณที่ร่างกายต้องการพักผ่อน

- รู้สึกเหนื่อยมากผิดปกติ
- ประสิทธิภาพการออกกำลังกายลดลง
- อารมณ์แปรปรวน
- นอนไม่หลับ
- เจ็บป่วยบ่อย

## สรุป

การพักผ่อนไม่ใช่ความขี้เกียจ แต่เป็นส่วนสำคัญของการออกกำลังกาย การวางแผนการพักผ่อนที่ดีจะช่วยให้คุณได้ผลลัพธ์ที่ดีขึ้น
    `,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
    category: 'สุขภาพ',
    tags: ['recovery', 'rest', 'sleep', 'health'],
    author: {
      id: 3,
      name: 'ดร.สมชาย ใสใจ',
      bio: 'แพทย์กีฬา ผู้เชี่ยวชาญด้านการฟื้นฟูร่างกาย',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop'
    },
    publishedAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    status: 'published',
    isFeatured: false,
    viewCount: 564,
    likeCount: 45,
    shareCount: 12,
    estimatedReadTime: 6,
    seoTitle: 'การพักผ่อนและการฟื้นฟูร่างกาย | คู่มือสุขภาพ',
    seoDescription: 'เรียนรู้ความสำคัญของการพักผ่อนและการฟื้นฟูร่างกายสำหรับนักกีฬา วิธีการนอนหลับที่ดี และ Active Recovery'
  }
];

// Categories
const categories = [
  { id: 1, name: 'การออกกำลังกาย', slug: 'workout', count: 15 },
  { id: 2, name: 'โภชนาการ', slug: 'nutrition', count: 12 },
  { id: 3, name: 'สุขภาพ', slug: 'health', count: 8 },
  { id: 4, name: 'วิทยาศาสตร์กีฬา', slug: 'sports-science', count: 6 },
  { id: 5, name: 'ไลฟ์สไตล์', slug: 'lifestyle', count: 10 }
];

// Helper functions
const formatArticleResponse = (article, includeContent = false) => {
  const response = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    image: article.image,
    category: article.category,
    tags: article.tags,
    author: article.author,
    publishedAt: article.publishedAt,
    status: article.status,
    isFeatured: article.isFeatured,
    viewCount: article.viewCount,
    likeCount: article.likeCount,
    shareCount: article.shareCount,
    estimatedReadTime: article.estimatedReadTime
  };

  if (includeContent) {
    response.content = article.content;
    response.seoTitle = article.seoTitle;
    response.seoDescription = article.seoDescription;
  }

  return response;
};

// @route   GET /api/articles
// @desc    Get all articles with filtering and pagination
// @access  Public
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      tag,
      author,
      featured,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    let filteredArticles = articles.filter(article => article.status === 'published');

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (category) {
      filteredArticles = filteredArticles.filter(article =>
        article.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (tag) {
      filteredArticles = filteredArticles.filter(article =>
        article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }

    if (author) {
      filteredArticles = filteredArticles.filter(article =>
        article.author.name.toLowerCase().includes(author.toLowerCase())
      );
    }

    if (featured === 'true') {
      filteredArticles = filteredArticles.filter(article => article.isFeatured);
    }

    // Sorting
    filteredArticles.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'publishedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
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
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    // Format response
    const formattedArticles = paginatedArticles.map(article => formatArticleResponse(article));

    res.json({
      success: true,
      data: formattedArticles,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredArticles.length / parseInt(limit)),
        total: filteredArticles.length,
        hasNext: endIndex < filteredArticles.length,
        hasPrev: startIndex > 0
      },
      categories: categories
    });

  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบทความ'
    });
  }
});

// @route   GET /api/articles/featured
// @desc    Get featured articles
// @access  Public
router.get('/featured', (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const featuredArticles = articles
      .filter(article => article.status === 'published' && article.isFeatured)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, parseInt(limit))
      .map(article => formatArticleResponse(article));

    res.json({
      success: true,
      data: featuredArticles,
      total: featuredArticles.length
    });

  } catch (error) {
    console.error('Get featured articles error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบทความแนะนำ'
    });
  }
});

// @route   GET /api/articles/categories
// @desc    Get article categories
// @access  Public
router.get('/categories', (req, res) => {
  try {
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่'
    });
  }
});

// @route   GET /api/articles/:id
// @desc    Get single article by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    
    const article = articles.find(a => a.id === articleId && a.status === 'published');
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบบทความที่ระบุ'
      });
    }

    // Increment view count
    article.viewCount++;

    // Get related articles
    const relatedArticles = articles
      .filter(a => 
        a.id !== articleId && 
        a.status === 'published' && 
        (a.category === article.category || 
         a.tags.some(tag => article.tags.includes(tag)))
      )
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 3)
      .map(a => formatArticleResponse(a));

    res.json({
      success: true,
      data: formatArticleResponse(article, true),
      related: relatedArticles
    });

  } catch (error) {
    console.error('Get article detail error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบทความ'
    });
  }
});

// @route   GET /api/articles/:id/related
// @desc    Get related articles
// @access  Public
router.get('/:id/related', (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const { limit = 3 } = req.query;
    
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบบทความที่ระบุ'
      });
    }

    const relatedArticles = articles
      .filter(a => 
        a.id !== articleId && 
        a.status === 'published' && 
        (a.category === article.category || 
         a.tags.some(tag => article.tags.includes(tag)))
      )
      .sort((a, b) => {
        // Score by relevance
        let scoreA = 0;
        let scoreB = 0;
        
        if (a.category === article.category) scoreA += 2;
        if (b.category === article.category) scoreB += 2;
        
        scoreA += a.tags.filter(tag => article.tags.includes(tag)).length;
        scoreB += b.tags.filter(tag => article.tags.includes(tag)).length;
        
        return scoreB - scoreA;
      })
      .slice(0, parseInt(limit))
      .map(a => formatArticleResponse(a));

    res.json({
      success: true,
      data: relatedArticles
    });

  } catch (error) {
    console.error('Get related articles error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบทความที่เกี่ยวข้อง'
    });
  }
});

// @route   POST /api/articles/:id/like
// @desc    Like an article
// @access  Public
router.post('/:id/like', (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบบทความที่ระบุ'
      });
    }

    // In a real app, you'd check if user already liked this article
    article.likeCount++;

    res.json({
      success: true,
      message: 'ถูกใจบทความแล้ว',
      likeCount: article.likeCount
    });

  } catch (error) {
    console.error('Like article error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการถูกใจบทความ'
    });
  }
});

// @route   POST /api/articles/:id/share
// @desc    Record article share
// @access  Public
router.post('/:id/share', (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const { platform } = req.body;
    
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบบทความที่ระบุ'
      });
    }

    // Increment share count
    article.shareCount++;

    // Log share analytics
    console.log('Article shared:', {
      articleId,
      title: article.title,
      platform,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'บันทึกการแชร์แล้ว',
      shareCount: article.shareCount
    });

  } catch (error) {
    console.error('Share article error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกการแชร์'
    });
  }
});

module.exports = router;
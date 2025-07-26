// server/routes/reviews.js
const express = require('express');
const router = express.Router();

// Mock reviews database
let reviews = [
  {
    id: 1,
    trainerId: 1,
    trainerName: 'จอห์น ทรัพย์สิน',
    clientId: 1,
    clientName: 'สมศรี ใจดี',
    sessionId: 2,
    rating: 5,
    comment: 'เทรนเนอร์ดีมาก สอนใส่ใจ ติดตามผลงานอย่างใกล้ชิด แนะนำเลยค่ะ',
    pros: ['สอนชัดเจน', 'ใส่ใจรายละเอียด', 'ให้กำลังใจ'],
    cons: [],
    wouldRecommend: true,
    isVerified: true,
    isPublished: true,
    adminNotes: '',
    createdAt: '2024-07-25T16:00:00Z',
    updatedAt: '2024-07-25T16:00:00Z',
    publishedAt: '2024-07-25T17:00:00Z'
  },
  {
    id: 2,
    trainerId: 1,
    trainerName: 'จอห์น ทรัพย์สิน',
    clientId: 2,
    clientName: 'วิทยา สุขใส',
    sessionId: null,
    rating: 4,
    comment: 'เทรนเนอร์มีความรู้ดี แต่บางครั้งมาช้านิดหน่อย โดยรวมพอใจค่ะ',
    pros: ['มีความรู้', 'แนะนำดี'],
    cons: ['มาช้าบางครั้ง'],
    wouldRecommend: true,
    isVerified: true,
    isPublished: true,
    adminNotes: '',
    createdAt: '2024-07-20T14:30:00Z',
    updatedAt: '2024-07-20T14:30:00Z',
    publishedAt: '2024-07-20T15:00:00Z'
  },
  {
    id: 3,
    trainerId: 2,
    trainerName: 'เจน ฟิตเนส',
    clientId: 3,
    clientName: 'สมพงษ์ แข็งแรง',
    sessionId: null,
    rating: 5,
    comment: 'เทรนเนอร์เจนสุดยอดมาก! ทำให้ผมรักการออกกำลังกายมากขึ้น',
    pros: ['มีพลัง', 'สร้างแรงบันดาลใจ', 'ผลลัพธ์ดี'],
    cons: [],
    wouldRecommend: true,
    isVerified: false,
    isPublished: false,
    adminNotes: 'รอการตรวจสอบ',
    createdAt: '2024-07-26T10:15:00Z',
    updatedAt: '2024-07-26T10:15:00Z'
  }
];

// Rating categories for detailed feedback
const RATING_CATEGORIES = [
  'knowledge', // ความรู้
  'communication', // การสื่อสาร
  'motivation', // การให้กำลังใจ
  'punctuality', // ความตรงเวลา
  'professionalism', // ความเป็นมืออาชีพ
  'results' // ผลลัพธ์
];

// @route   GET /api/reviews
// @desc    Get all reviews (with filters)
// @access  Public
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      trainerId,
      clientId,
      rating,
      isPublished = 'true',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let filteredReviews = [...reviews];

    // Apply filters
    if (trainerId) {
      filteredReviews = filteredReviews.filter(r => r.trainerId === parseInt(trainerId));
    }

    if (clientId) {
      filteredReviews = filteredReviews.filter(r => r.clientId === parseInt(clientId));
    }

    if (rating) {
      filteredReviews = filteredReviews.filter(r => r.rating === parseInt(rating));
    }

    if (isPublished === 'true') {
      filteredReviews = filteredReviews.filter(r => r.isPublished);
    } else if (isPublished === 'false') {
      filteredReviews = filteredReviews.filter(r => !r.isPublished);
    }

    // Sort reviews
    filteredReviews.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'trainerName':
          aValue = a.trainerName;
          bValue = b.trainerName;
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
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: filteredReviews.length,
      averageRating: filteredReviews.length > 0 
        ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
        : 0,
      ratingDistribution: {
        5: filteredReviews.filter(r => r.rating === 5).length,
        4: filteredReviews.filter(r => r.rating === 4).length,
        3: filteredReviews.filter(r => r.rating === 3).length,
        2: filteredReviews.filter(r => r.rating === 2).length,
        1: filteredReviews.filter(r => r.rating === 1).length
      },
      pending: reviews.filter(r => !r.isPublished).length,
      verified: reviews.filter(r => r.isVerified).length
    };

    res.json({
      success: true,
      data: paginatedReviews,
      stats,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredReviews.length / parseInt(limit)),
        total: filteredReviews.length
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว'
    });
  }
});

// @route   GET /api/reviews/:id
// @desc    Get single review
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบรีวิวที่ระบุ'
      });
    }

    res.json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('Get review detail error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว'
    });
  }
});

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private (Client)
router.post('/', (req, res) => {
  try {
    const {
      trainerId,
      sessionId,
      rating,
      comment,
      pros = [],
      cons = [],
      wouldRecommend = true,
      categories = {}
    } = req.body;

    // Validation
    if (!trainerId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน (เทรนเนอร์, คะแนน, ความคิดเห็น)'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'คะแนนต้องอยู่ระหว่าง 1-5'
      });
    }

    if (comment.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'ความคิดเห็นต้องมีความยาวอย่างน้อย 10 ตัวอักษร'
      });
    }

    // In real app, get client info from authenticated user
    const clientId = 1; // Mock client ID

    // Check if client already reviewed this trainer
    const existingReview = reviews.find(r => 
      r.trainerId === parseInt(trainerId) && r.clientId === clientId
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'คุณได้รีวิวเทรนเนอร์นี้แล้ว'
      });
    }

    // Validate category ratings
    const categoryRatings = {};
    if (categories && typeof categories === 'object') {
      RATING_CATEGORIES.forEach(category => {
        if (categories[category] && 
            categories[category] >= 1 && 
            categories[category] <= 5) {
          categoryRatings[category] = parseInt(categories[category]);
        }
      });
    }

    const newReview = {
      id: reviews.length + 1,
      trainerId: parseInt(trainerId),
      trainerName: 'เทรนเนอร์', // In real app, get from database
      clientId,
      clientName: 'ลูกค้า', // In real app, get from database
      sessionId: sessionId ? parseInt(sessionId) : null,
      rating: parseInt(rating),
      comment: comment.trim(),
      pros: Array.isArray(pros) ? pros.map(p => p.trim()).filter(p => p) : [],
      cons: Array.isArray(cons) ? cons.map(c => c.trim()).filter(c => c) : [],
      wouldRecommend: Boolean(wouldRecommend),
      categories: categoryRatings,
      isVerified: false, // Admin needs to verify
      isPublished: false, // Admin needs to publish
      adminNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reviews.push(newReview);

    res.status(201).json({
      success: true,
      message: 'สร้างรีวิวสำเร็จ รอการตรวจสอบจากผู้ดูแลระบบ',
      data: newReview
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างรีวิว'
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review (Client only, within 24 hours)
// @access  Private (Client)
router.put('/:id', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบรีวิวที่ระบุ'
      });
    }

    const review = reviews[reviewIndex];

    // Check if review belongs to current user (mock check)
    const currentUserId = 1; // Mock user ID
    if (review.clientId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์แก้ไขรีวิวนี้'
      });
    }

    // Check if review is within edit time limit (24 hours)
    const createdAt = new Date(review.createdAt);
    const now = new Date();
    const hoursSinceCreated = (now - createdAt) / (1000 * 60 * 60);

    if (hoursSinceCreated > 24) {
      return res.status(400).json({
        success: false,
        message: 'ไม่สามารถแก้ไขรีวิวได้หลังจากผ่านไป 24 ชั่วโมง'
      });
    }

    const {
      rating,
      comment,
      pros = [],
      cons = [],
      wouldRecommend,
      categories = {}
    } = req.body;

    // Update review fields
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'คะแนนต้องอยู่ระหว่าง 1-5'
        });
      }
      reviews[reviewIndex].rating = parseInt(rating);
    }

    if (comment !== undefined) {
      if (comment.length < 10) {
        return res.status(400).json({
          success: false,
          message: 'ความคิดเห็นต้องมีความยาวอย่างน้อย 10 ตัวอักษร'
        });
      }
      reviews[reviewIndex].comment = comment.trim();
    }

    if (pros) reviews[reviewIndex].pros = Array.isArray(pros) ? pros.map(p => p.trim()).filter(p => p) : [];
    if (cons) reviews[reviewIndex].cons = Array.isArray(cons) ? cons.map(c => c.trim()).filter(c => c) : [];
    if (wouldRecommend !== undefined) reviews[reviewIndex].wouldRecommend = Boolean(wouldRecommend);

    // Update category ratings
    if (categories && typeof categories === 'object') {
      const categoryRatings = {};
      RATING_CATEGORIES.forEach(category => {
        if (categories[category] && 
            categories[category] >= 1 && 
            categories[category] <= 5) {
          categoryRatings[category] = parseInt(categories[category]);
        }
      });
      reviews[reviewIndex].categories = categoryRatings;
    }

    reviews[reviewIndex].updatedAt = new Date().toISOString();
    
    // Reset verification status if content changed
    reviews[reviewIndex].isVerified = false;
    reviews[reviewIndex].isPublished = false;

    res.json({
      success: true,
      message: 'อัพเดทรีวิวสำเร็จ รอการตรวจสอบใหม่',
      data: reviews[reviewIndex]
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทรีวิว'
    });
  }
});

// @route   POST /api/reviews/:id/publish
// @desc    Publish review (Admin only)
// @access  Private (Admin)
router.post('/:id/publish', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบรีวิวที่ระบุ'
      });
    }

    const { adminNotes = '' } = req.body;

    reviews[reviewIndex].isVerified = true;
    reviews[reviewIndex].isPublished = true;
    reviews[reviewIndex].publishedAt = new Date().toISOString();
    reviews[reviewIndex].adminNotes = adminNotes;
    reviews[reviewIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'เผยแพร่รีวิวสำเร็จ',
      data: reviews[reviewIndex]
    });

  } catch (error) {
    console.error('Publish review error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเผยแพร่รีวิว'
    });
  }
});

// @route   POST /api/reviews/:id/reject
// @desc    Reject review (Admin only)
// @access  Private (Admin)
router.post('/:id/reject', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบรีวิวที่ระบุ'
      });
    }

    const { adminNotes = '', reason = '' } = req.body;

    reviews[reviewIndex].isVerified = false;
    reviews[reviewIndex].isPublished = false;
    reviews[reviewIndex].rejectedAt = new Date().toISOString();
    reviews[reviewIndex].rejectionReason = reason;
    reviews[reviewIndex].adminNotes = adminNotes;
    reviews[reviewIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'ปฏิเสธรีวิวสำเร็จ',
      data: reviews[reviewIndex]
    });

  } catch (error) {
    console.error('Reject review error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการปฏิเสธรีวิว'
    });
  }
});

// @route   GET /api/reviews/trainer/:trainerId/stats
// @desc    Get trainer review statistics
// @access  Public
router.get('/trainer/:trainerId/stats', (req, res) => {
  try {
    const trainerId = parseInt(req.params.trainerId);
    const trainerReviews = reviews.filter(r => 
      r.trainerId === trainerId && r.isPublished
    );

    if (trainerReviews.length === 0) {
      return res.json({
        success: true,
        data: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          categoryAverages: {},
          recommendationRate: 0,
          recentReviews: []
        }
      });
    }

    // Calculate basic stats
    const totalReviews = trainerReviews.length;
    const averageRating = (trainerReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);
    
    const ratingDistribution = {
      5: trainerReviews.filter(r => r.rating === 5).length,
      4: trainerReviews.filter(r => r.rating === 4).length,
      3: trainerReviews.filter(r => r.rating === 3).length,
      2: trainerReviews.filter(r => r.rating === 2).length,
      1: trainerReviews.filter(r => r.rating === 1).length
    };

    // Calculate category averages
    const categoryAverages = {};
    RATING_CATEGORIES.forEach(category => {
      const categoryReviews = trainerReviews.filter(r => r.categories && r.categories[category]);
      if (categoryReviews.length > 0) {
        categoryAverages[category] = (
          categoryReviews.reduce((sum, r) => sum + r.categories[category], 0) / categoryReviews.length
        ).toFixed(1);
      }
    });

    // Calculate recommendation rate
    const recommendCount = trainerReviews.filter(r => r.wouldRecommend).length;
    const recommendationRate = ((recommendCount / totalReviews) * 100).toFixed(1);

    // Get recent reviews (last 5)
    const recentReviews = trainerReviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment.substring(0, 100) + (r.comment.length > 100 ? '...' : ''),
        clientName: r.clientName,
        createdAt: r.createdAt
      }));

    const stats = {
      totalReviews,
      averageRating: parseFloat(averageRating),
      ratingDistribution,
      categoryAverages,
      recommendationRate: parseFloat(recommendationRate),
      recentReviews
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get trainer review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติรีวิว'
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review (Admin only)
// @access  Private (Admin)
router.delete('/:id', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบรีวิวที่ระบุ'
      });
    }

    const { reason = '' } = req.body;

    // Log deletion for audit
    console.log('Review deleted:', {
      reviewId,
      reason,
      deletedBy: 'admin', // In real app, get from authenticated user
      deletedAt: new Date().toISOString()
    });

    reviews.splice(reviewIndex, 1);

    res.json({
      success: true,
      message: 'ลบรีวิวสำเร็จ'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบรีวิว'
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Trainer, User, Review, Package, TrainerImage } = require('../models');

// @route   GET /api/trainers
// @desc    Get all trainers with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      specialty,
      location,
      priceMin,
      priceMax,
      rating,
      featured,
      verified
    } = req.query;

    const offset = (page - 1) * parseInt(limit);
    const where = { isAvailable: true };
    const include = [
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'displayName', 'profilePicture'],
        where: { isActive: true }
      },
      {
        model: TrainerImage,
        as: 'images',
        where: { isActive: true },
        required: false,
        limit: 5
      },
      {
        model: Package,
        as: 'packages',
        where: { isActive: true },
        required: false,
        attributes: ['id', 'name', 'price', 'sessionsCount', 'isRecommended']
      }
    ];

    // Search filters
    if (search) {
      include[0].where = {
        ...include[0].where,
        [Op.or]: [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { displayName: { [Op.like]: `%${search}%` } }
        ]
      };
      
      where[Op.or] = [
        { bio: { [Op.like]: `%${search}%` } },
        { specialties: { [Op.like]: `%${search}%` } }
      ];
    }

    // Specialty filter
    if (specialty) {
      where.specialties = { [Op.contains]: [specialty] };
    }

    // Location filter
    if (location) {
      where.serviceAreas = { [Op.contains]: [location] };
    }

    // Price range filter
    if (priceMin || priceMax) {
      where.basePrice = {};
      if (priceMin) where.basePrice[Op.gte] = priceMin;
      if (priceMax) where.basePrice[Op.lte] = priceMax;
    }

    // Rating filter
    if (rating) {
      where.rating = { [Op.gte]: rating };
    }

    // Featured filter
    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Verified filter
    if (verified === 'true') {
      where.isVerified = true;
    }

    const { count, rows } = await Trainer.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset,
      order: [
        ['isFeatured', 'DESC'],
        ['isVerified', 'DESC'],
        ['rating', 'DESC'],
        ['totalReviews', 'DESC']
      ],
      distinct: true
    });

    res.json({
      success: true,
      data: {
        trainers: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          hasNext: offset + rows.length < count,
          hasPrev: page > 1
        }
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
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const trainers = await Trainer.findAll({
      where: {
        isFeatured: true,
        isVerified: true,
        isAvailable: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'displayName', 'profilePicture']
        },
        {
          model: TrainerImage,
          as: 'images',
          where: { 
            imageType: 'profile',
            isActive: true 
          },
          required: false,
          limit: 1
        }
      ],
      limit: parseInt(limit),
      order: [
        ['rating', 'DESC'],
        ['totalReviews', 'DESC']
      ]
    });

    res.json({
      success: true,
      data: trainers
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
// @desc    Get trainer by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const trainerId = req.params.id;

    const trainer = await Trainer.findByPk(trainerId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'displayName', 'profilePicture', 'phone', 'email']
        },
        {
          model: TrainerImage,
          as: 'images',
          where: { isActive: true },
          required: false,
          order: [['sortOrder', 'ASC']]
        },
        {
          model: Package,
          as: 'packages',
          where: { isActive: true },
          required: false,
          order: [['isRecommended', 'DESC'], ['sortOrder', 'ASC']]
        },
        {
          model: Review,
          as: 'reviews',
          where: { isApproved: true },
          required: false,
          include: [
            {
              model: User,
              as: 'customer',
              through: { model: 'Customer' },
              attributes: ['firstName', 'lastName', 'displayName']
            }
          ],
          order: [['createdAt', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเทรนเนอร์ที่ระบุ'
      });
    }

    res.json({
      success: true,
      data: trainer
    });

  } catch (error) {
    console.error('Get trainer error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเทรนเนอร์'
    });
  }
});

// @route   GET /api/trainers/:id/reviews
// @desc    Get trainer reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id: trainerId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    const offset = (page - 1) * parseInt(limit);
    const where = { trainerId, isApproved: true };

    if (rating) {
      where.rating = rating;
    }

    const { count, rows } = await Review.findAndCountAll({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'displayName']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    // Get rating summary
    const ratingSummary = await Review.findAll({
      where: { trainerId, isApproved: true },
      attributes: [
        'rating',
        [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
      ],
      group: ['rating'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        reviews: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit))
        },
        ratingSummary
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

module.exports = router;
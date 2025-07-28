const express = require('express');
const router = express.Router();
const { models } = require('../models');

// @route   GET /api/trainers
// @desc    Get all trainers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit, featured, verified } = req.query;
    
    const options = {
      available: true,
      limit: limit ? parseInt(limit) : null,
      verified: verified === 'true'
    };

    const trainers = await models.Trainer.findAll(options);

    res.json({
      success: true,
      data: {
        trainers,
        total: trainers.length
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
    const trainers = await models.Trainer.findAll({
      available: true,
      verified: true,
      limit: 6
    });

    const featuredTrainers = trainers.filter(t => t.is_featured);

    res.json({
      success: true,
      data: featuredTrainers
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

    const trainer = await models.Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเทรนเนอร์ที่ระบุ'
      });
    }

    // Get trainer packages
    const packages = await models.Package.findByTrainerId(trainerId);

    res.json({
      success: true,
      data: {
        ...trainer,
        packages
      }
    });

  } catch (error) {
    console.error('Get trainer error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเทรนเนอร์'
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { protect } = require('../middleware/authMiddleware');

router.get('/status', protect, membershipController.getMembershipStatus);

module.exports = router;

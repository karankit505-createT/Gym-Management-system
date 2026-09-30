const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, upload.single('photo'), userController.updateProfile);
router.put('/change-password', protect, userController.changePassword);

module.exports = router;

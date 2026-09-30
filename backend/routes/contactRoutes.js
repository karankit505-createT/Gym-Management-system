const express = require('express');
const router = express.Router();
const { 
  submitInquiry, 
  getInquiries, 
  updateInquiryStatus, 
  deleteInquiry 
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route: Submit contact form inquiry
router.post('/submit', submitInquiry);

// Admin-protected routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getInquiries);
router.patch('/:id', updateInquiryStatus);
router.delete('/:id', deleteInquiry);

module.exports = router;

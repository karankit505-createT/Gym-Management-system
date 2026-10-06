const express = require('express');
const router = express.Router();
const { 
  submitInquiry, 
  getInquiries, 
  updateInquiryStatus, 
  assignInquiry,
  deleteInquiry,
  getInquiryStats
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route: Submit contact form inquiry
router.post('/submit', submitInquiry);
router.post('/', submitInquiry);

// Protected routes (Admin & Staff)
router.use(protect);

// Stats - Admin Only
router.get('/stats', authorize('admin'), getInquiryStats);

// List inquiries - Admin & Staff
router.get('/', authorize('admin', 'staff'), getInquiries);

// Update status & notes - Admin & Staff
router.put('/:id', authorize('admin', 'staff'), updateInquiryStatus);
router.patch('/:id', authorize('admin', 'staff'), updateInquiryStatus);

// Assign staff - Admin Only
router.put('/:id/assign', authorize('admin'), assignInquiry);

// Delete inquiry - Admin Only (Staff receives 403 Forbidden)
router.delete('/:id', authorize('admin'), deleteInquiry);

module.exports = router;

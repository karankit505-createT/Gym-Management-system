const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All admin/staff management routes require authentication
router.use(protect);

// Dashboard Stats (Admin & Staff)
router.get('/dashboard-stats', authorize('admin', 'staff'), adminController.getDashboardStats);

// Member Management (Admin & Staff)
router.get('/members/export', authorize('admin', 'staff'), adminController.exportMembersCsv);
router.get('/members', authorize('admin', 'staff'), adminController.getMembers);
router.get('/members/:id', authorize('admin', 'staff'), adminController.getMemberById);
router.put('/members/:id', authorize('admin', 'staff'), adminController.updateMember);
router.put('/members/:id/membership', authorize('admin', 'staff'), adminController.updateMemberMembership);
router.delete('/members/:id', authorize('admin'), adminController.deleteMember);

// Staff Management
router.get('/staff/export', authorize('admin', 'staff'), adminController.exportStaffCsv);
router.get('/staff', authorize('admin', 'staff'), adminController.getStaffList);
router.post('/staff', authorize('admin'), upload.single('photo'), adminController.addStaff);
router.put('/staff/:id', authorize('admin'), adminController.updateStaff);
router.delete('/staff/:id', authorize('admin'), adminController.deleteStaff);

// Payment Records / Reports
router.get('/payments/export', authorize('admin', 'staff'), adminController.getPaymentReports);
router.get('/payments', authorize('admin', 'staff'), adminController.getPaymentReports);

// Announcements
router.post('/announcements', authorize('admin', 'staff'), adminController.createAnnouncement);
router.delete('/announcements/:id', authorize('admin'), adminController.deleteAnnouncement);

module.exports = router;

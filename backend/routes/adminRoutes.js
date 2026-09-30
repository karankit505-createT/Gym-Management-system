const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All admin routes require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard Stats
router.get('/dashboard-stats', adminController.getDashboardStats);

// Member Management
router.get('/members', adminController.getMembers);
router.get('/members/:id', adminController.getMemberById);
router.put('/members/:id', adminController.updateMember);
router.put('/members/:id/membership', adminController.updateMemberMembership);
router.delete('/members/:id', adminController.deleteMember);

// Staff Management
router.get('/staff', adminController.getStaffList);
router.post('/staff', upload.single('photo'), adminController.addStaff);
router.put('/staff/:id', adminController.updateStaff);
router.delete('/staff/:id', adminController.deleteStaff);

// Payment Records / Reports
router.get('/payments', adminController.getPaymentReports);

// Announcement
router.post('/announcements', adminController.createAnnouncement);
router.delete('/announcements/:id', adminController.deleteAnnouncement);

module.exports = router;

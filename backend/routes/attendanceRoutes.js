const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Staff and Admin can mark attendance & view logs
router.post('/mark', protect, authorize('staff', 'admin'), attendanceController.markAttendance);
router.get('/logs', protect, authorize('staff', 'admin'), attendanceController.getAttendanceLogs);

module.exports = router;

const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to view plans
router.get('/', planController.getPlans);

// Admin route to get all plans
router.get('/admin', protect, authorize('admin'), planController.getAllPlansAdmin);

// Admin CRUD routes
router.post('/', protect, authorize('admin'), planController.createPlan);
router.put('/:id', protect, authorize('admin'), planController.updatePlan);
router.delete('/:id', protect, authorize('admin'), planController.deletePlan);

module.exports = router;

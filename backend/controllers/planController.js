const { Plan } = require('../models');

// Public - Get active plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll({
      where: { is_active: true },
      order: [['price', 'ASC']]
    });
    return res.status(200).json({ success: true, count: plans.length, plans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin - Get all plans including inactive
exports.getAllPlansAdmin = async (req, res) => {
  try {
    const plans = await Plan.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ success: true, count: plans.length, plans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin - Create plan
exports.createPlan = async (req, res) => {
  try {
    const { name, duration_days, price, description, is_active } = req.body;
    if (!name || !duration_days || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, duration (days), and price are required' });
    }

    const newPlan = await Plan.create({
      name,
      duration_days: parseInt(duration_days),
      price: parseFloat(price),
      description: description || '',
      is_active: is_active !== undefined ? is_active : true
    });

    return res.status(201).json({ success: true, message: 'Membership plan created successfully', plan: newPlan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin - Update plan
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration_days, price, description, is_active } = req.body;

    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    if (name) plan.name = name;
    if (duration_days) plan.duration_days = parseInt(duration_days);
    if (price !== undefined) plan.price = parseFloat(price);
    if (description !== undefined) plan.description = description;
    if (is_active !== undefined) plan.is_active = is_active;

    await plan.save();

    return res.status(200).json({ success: true, message: 'Plan updated successfully', plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin - Delete / Deactivate plan
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    try {
      // Try hard delete first
      await plan.destroy();
      return res.status(200).json({ success: true, message: 'Plan permanently deleted successfully' });
    } catch (err) {
      // If plan is referenced in existing member records/payments, soft delete (deactivate)
      plan.is_active = false;
      await plan.save();
      return res.status(200).json({
        success: true,
        message: 'Plan is linked to member subscription history, so it was set to INACTIVE.'
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

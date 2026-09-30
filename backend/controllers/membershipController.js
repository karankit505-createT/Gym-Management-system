const { Membership, Plan, Announcement } = require('../models');
const { Op } = require('sequelize');

exports.getMembershipStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch latest active or most recent membership
    const activeMembership = await Membership.findOne({
      where: {
        user_id: userId,
        status: 'active'
      },
      include: [{ model: Plan }],
      order: [['end_date', 'DESC']]
    });

    const now = new Date();
    const announcements = await Announcement.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    if (!activeMembership) {
      return res.status(200).json({
        success: true,
        status: 'not_member',
        message: 'No active membership found.',
        membership: null,
        announcements
      });
    }

    const endDate = new Date(activeMembership.end_date);
    const diffTime = endDate - now;
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) {
      activeMembership.status = 'expired';
      await activeMembership.save();
      return res.status(200).json({
        success: true,
        status: 'expired',
        message: 'Your membership has expired.',
        membership: activeMembership,
        daysRemaining: 0,
        announcements
      });
    }

    const expiringSoon = daysRemaining <= 7;

    return res.status(200).json({
      success: true,
      status: 'active',
      membership: activeMembership,
      daysRemaining,
      expiringSoon,
      announcements
    });
  } catch (error) {
    console.error('Membership Status Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

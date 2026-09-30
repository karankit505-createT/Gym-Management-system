const { Attendance, User } = require('../models');
const { Op } = require('sequelize');

// Mark attendance (check-in / check-out)
exports.markAttendance = async (req, res) => {
  try {
    const { user_id, action } = req.body; // action: 'check_in' or 'check_out'
    const today = new Date().toISOString().split('T')[0];

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    let record = await Attendance.findOne({
      where: {
        user_id,
        date: today
      }
    });

    const currentTime = new Date().toTimeString().split(' ')[0];

    if (!record) {
      if (action === 'check_out') {
        return res.status(400).json({ success: false, message: 'Cannot check-out without prior check-in today' });
      }
      record = await Attendance.create({
        user_id,
        date: today,
        check_in: currentTime
      });
      return res.status(200).json({ success: true, message: `Check-in recorded at ${currentTime} for ${user.name}`, record });
    } else {
      if (action === 'check_in') {
        record.check_in = currentTime;
        await record.save();
        return res.status(200).json({ success: true, message: `Check-in updated at ${currentTime} for ${user.name}`, record });
      } else {
        record.check_out = currentTime;
        await record.save();
        return res.status(200).json({ success: true, message: `Check-out recorded at ${currentTime} for ${user.name}`, record });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Attendance History
exports.getAttendanceLogs = async (req, res) => {
  try {
    const { date, user_id } = req.query;
    const whereClause = {};

    if (date) whereClause.date = date;
    if (user_id) whereClause.user_id = user_id;

    const logs = await Attendance.findAll({
      where: whereClause,
      include: [{ model: User, attributes: ['id', 'name', 'email', 'phone', 'photo'] }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    return res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Parser } = require('json2csv');
const { User, Plan, Membership, Payment, Staff, Announcement, Attendance, OtpVerification, ContactInquiry } = require('../models');
const { syncToMongo } = require('../utils/mongoSync');

// 1. Admin Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });

    const totalActiveMembers = await Membership.count({ where: { status: 'active' } });
    const totalExpiredMembers = await Membership.count({ where: { status: 'expired' } });

    // Members expiring in next 7 days
    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(now.getDate() + 7);

    const expiringSoonMemberships = await Membership.findAll({
      where: {
        status: 'active',
        end_date: {
          [Op.between]: [now.toISOString().split('T')[0], in7Days.toISOString().split('T')[0]]
        }
      },
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'phone', 'photo'] },
        { model: Plan, attributes: ['id', 'name', 'price'] }
      ]
    });

    // New registrations this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newSignupsThisMonth = await User.count({
      where: {
        role: 'user',
        createdAt: { [Op.gte]: startOfMonth }
      }
    });

    // Total Revenue Collected
    const successfulPayments = await Payment.findAll({
      where: { payment_status: 'success' },
      include: [{ model: Plan, attributes: ['id', 'name'] }]
    });

    let totalRevenue = 0;
    let monthlyRevenue = 0;
    const planBreakdown = {};

    successfulPayments.forEach(p => {
      const amt = parseFloat(p.amount);
      totalRevenue += amt;

      const paymentDate = new Date(p.createdAt);
      if (paymentDate >= startOfMonth) {
        monthlyRevenue += amt;
      }

      const planName = p.Plan ? p.Plan.name : 'Unknown';
      planBreakdown[planName] = (planBreakdown[planName] || 0) + amt;
    });

    // Monthly revenue trend data for last 6 months
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthLabel = d.toLocaleString('default', { month: 'short', year: '2-digit' });

      const monthPayments = successfulPayments.filter(p => {
        const pDate = new Date(p.createdAt);
        return pDate >= d && pDate < nextD;
      });

      const rev = monthPayments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
      monthlyTrend.push({ month: monthLabel, revenue: rev, transactions: monthPayments.length });
    }

    // Inquiry Statistics Calculation
    const allInquiries = await ContactInquiry.findAll();
    let totalInquiriesThisMonth = 0;
    let newInquiriesCount = 0;
    let joinedInquiriesCount = 0;
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
    let pendingFollowUpCount = 0;

    allInquiries.forEach(inq => {
      const created = new Date(inq.createdAt);
      const updated = new Date(inq.updatedAt || inq.createdAt);
      const st = inq.status || 'New';

      if (created >= startOfMonth) totalInquiriesThisMonth++;
      if (st === 'New') newInquiriesCount++;
      if (st === 'Joined') joinedInquiriesCount++;

      if (st !== 'Joined' && st !== 'Not Interested' && updated <= threeDaysAgo) {
        pendingFollowUpCount++;
      }
    });

    const inquiryConversionRate = allInquiries.length > 0 
      ? parseFloat(((joinedInquiriesCount / allInquiries.length) * 100).toFixed(1)) 
      : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalActiveMembers,
        totalExpiredMembers,
        expiringSoonCount: expiringSoonMemberships.length,
        expiringSoonMemberships,
        newSignupsThisMonth,
        totalRevenue,
        monthlyRevenue,
        planBreakdown,
        monthlyTrend,
        // Inquiry Stats
        totalInquiries: allInquiries.length,
        totalInquiriesThisMonth,
        newInquiriesCount,
        inquiryConversionRate,
        pendingFollowUpCount
      }
    });
  } catch (error) {
    console.error('Admin Dashboard Stats Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Member Management - View all members (with search & status filter)
exports.getMembers = async (req, res) => {
  try {
    const { search, status } = req.query;

    const whereUser = { role: 'user' };
    if (search) {
      whereUser[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const members = await User.findAll({
      where: whereUser,
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Membership,
          include: [{ model: Plan }],
          order: [['end_date', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Process status filtering in-memory for flexibility
    let filtered = members;
    if (status) {
      const nowStr = new Date().toISOString().split('T')[0];
      const in7DaysStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      filtered = members.filter(m => {
        const latestMem = m.Memberships && m.Memberships[0];
        if (status === 'active') {
          return latestMem && latestMem.status === 'active' && latestMem.end_date >= nowStr;
        } else if (status === 'expired') {
          return !latestMem || latestMem.status === 'expired' || latestMem.end_date < nowStr;
        } else if (status === 'expiring_soon') {
          return latestMem && latestMem.status === 'active' && latestMem.end_date >= nowStr && latestMem.end_date <= in7DaysStr;
        }
        return true;
      });
    }

    return res.status(200).json({ success: true, count: filtered.length, members: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. View individual member details
exports.getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Membership, include: [{ model: Plan }] },
        { model: Payment, include: [{ model: Plan }] },
        { model: Attendance }
      ]
    });

    if (!member || member.role !== 'user') {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    return res.status(200).json({ success: true, member });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Manually activate / extend / deactivate membership
exports.updateMemberMembership = async (req, res) => {
  try {
    const { id } = req.params; // user_id
    const { plan_id, extension_days, action, end_date } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (action === 'deactivate') {
      await Membership.update({ status: 'expired' }, { where: { user_id: id } });
      const deactivatedMems = await Membership.findAll({ where: { user_id: id } });
      for (const dm of deactivatedMems) {
        syncToMongo('memberships', dm).catch(err => console.error(err));
      }
      return res.status(200).json({ success: true, message: 'Membership deactivated successfully' });
    }

    let activeMem = await Membership.findOne({
      where: { user_id: id, status: 'active' },
      order: [['end_date', 'DESC']]
    });

    if (action === 'extend' && activeMem) {
      const currentEnd = new Date(activeMem.end_date);
      currentEnd.setDate(currentEnd.getDate() + parseInt(extension_days || 30));
      activeMem.end_date = currentEnd.toISOString().split('T')[0];
      await activeMem.save();
      syncToMongo('memberships', activeMem).catch(err => console.error(err));
      return res.status(200).json({ success: true, message: 'Membership extended successfully', membership: activeMem });
    }

    // Manual Activation with new/selected plan
    const plan = await Plan.findByPk(plan_id || 1);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const startObj = new Date();
    const endObj = end_date ? new Date(end_date) : new Date(Date.now() + (plan.duration_days * 86400000));

    // Deactivate previous
    await Membership.update({ status: 'expired' }, { where: { user_id: id } });

    const newMembership = await Membership.create({
      user_id: id,
      plan_id: plan.id,
      start_date: startObj.toISOString().split('T')[0],
      end_date: endObj.toISOString().split('T')[0],
      status: 'active'
    });
    syncToMongo('memberships', newMembership).catch(err => console.error(err));

    return res.status(200).json({ success: true, message: 'Membership manually activated!', membership: newMembership });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete member account
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid member ID' });
    }

    // Prevent self-deletion
    if (req.user && parseInt(req.user.id) === parseInt(id)) {
      return res.status(403).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found or already deleted.' });
    }

    // Prevent deleting the last remaining admin account
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(403).json({ success: false, message: 'Cannot delete the last remaining admin account.' });
      }
    }

    // Clean up dependent records in strict FK order: Payment -> Membership -> Attendance -> Otp -> Staff -> Announcement
    await Payment.destroy({ where: { user_id: id } });
    await Membership.destroy({ where: { user_id: id } });
    await Attendance.destroy({ where: { user_id: id } });
    await OtpVerification.destroy({ where: { user_id: id } });
    await Staff.update({ added_by_admin_id: null }, { where: { added_by_admin_id: id } });
    await Staff.destroy({ where: { user_id: id } });
    await Announcement.destroy({ where: { created_by: id } });

    await user.destroy();

    // Clean up MongoDB documents
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.db) {
      const numericId = parseInt(id);
      mongoose.connection.db.collection('users').deleteOne({ $or: [{ mysql_id: numericId }, { email: user.email }] }).catch(() => {});
      mongoose.connection.db.collection('memberships').deleteMany({ user_id: numericId }).catch(() => {});
      mongoose.connection.db.collection('payments').deleteMany({ user_id: numericId }).catch(() => {});
    }

    return res.status(200).json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete Member Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete member' });
  }
};

// 5b. Update member details (Name, Email, Phone, etc.)
exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, gender, address } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    if (email && email.trim().toLowerCase() !== user.email) {
      const existingEmail = await User.findOne({ where: { email: email.trim().toLowerCase() } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already in use by another user' });
      }
      user.email = email.trim().toLowerCase();
    }

    if (phone && phone.trim() !== user.phone) {
      const existingPhone = await User.findOne({ where: { phone: phone.trim() } });
      if (existingPhone) {
        return res.status(400).json({ success: false, message: 'Phone already in use by another user' });
      }
      user.phone = phone.trim();
    }

    if (name) user.name = name.trim();
    if (gender) user.gender = gender;
    if (address !== undefined) user.address = address;

    await user.save();
    return res.status(200).json({ success: true, message: 'Member updated successfully', user });
  } catch (error) {
    console.error('Update Member Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Staff Management - Add Staff
exports.addStaff = async (req, res) => {
  try {
    const { name, email, phone, password, designation, permissions } = req.body;

    if (!name || !email || !phone || !password || !designation) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, password, and designation are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    const existing = await User.findOne({ where: { [Op.or]: [{ email: trimmedEmail }, { phone: trimmedPhone }] } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email or phone already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const photo = req.file ? req.file.filename : null;

    const user = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      phone: trimmedPhone,
      password_hash,
      role: 'staff',
      is_verified: true,
      photo
    });

    const staff = await Staff.create({
      user_id: user.id,
      designation: designation.trim(),
      permissions: permissions || 'attendance,members_view',
      added_by_admin_id: req.user ? req.user.id : null
    });

    await syncToMongo('users', {
      mysql_id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_verified: true,
      designation: designation.trim()
    });

    return res.status(201).json({ success: true, message: 'Staff member added successfully', staff, user });
  } catch (error) {
    console.error('Add Staff Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6b. Update Staff
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params; // staff id
    const { name, email, phone, password, designation, permissions } = req.body;

    let staff = await Staff.findByPk(id);
    if (!staff) {
      staff = await Staff.findOne({ where: { user_id: id } });
    }

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    const user = await User.findByPk(staff.user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Associated User account not found' });
    }

    if (email && email.trim().toLowerCase() !== user.email) {
      const existingEmail = await User.findOne({ where: { email: email.trim().toLowerCase() } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email.trim().toLowerCase();
    }

    if (phone && phone.trim() !== user.phone) {
      const existingPhone = await User.findOne({ where: { phone: phone.trim() } });
      if (existingPhone) {
        return res.status(400).json({ success: false, message: 'Phone already in use' });
      }
      user.phone = phone.trim();
    }

    if (name) user.name = name.trim();
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(password.trim(), salt);
    }

    await user.save();

    if (designation) staff.designation = designation.trim();
    if (permissions) staff.permissions = permissions;
    await staff.save();

    return res.status(200).json({ success: true, message: 'Staff updated successfully', staff, user });
  } catch (error) {
    console.error('Update Staff Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Get Staff List
exports.getStaffList = async (req, res) => {
  try {
    const staffMembers = await Staff.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'phone', 'photo', 'createdAt'] },
        { model: User, as: 'Admin', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ success: true, count: staffMembers.length, staff: staffMembers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Delete / Remove Staff
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params; // staff id or user id

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid staff ID' });
    }

    let staff = await Staff.findByPk(id);
    if (!staff) {
      staff = await Staff.findOne({ where: { user_id: id } });
    }

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found or already deleted.' });
    }

    const userId = staff.user_id;

    // Prevent self-deletion if logged in admin is this staff user
    if (req.user && parseInt(req.user.id) === parseInt(userId)) {
      return res.status(403).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    // 1. Delete Staff record first to remove FK constraint
    await staff.destroy();

    // 2. Clean up associated User and dependent records if user exists
    if (userId) {
      await Payment.destroy({ where: { user_id: userId } });
      await Membership.destroy({ where: { user_id: userId } });
      await Attendance.destroy({ where: { user_id: userId } });
      await Announcement.destroy({ where: { created_by: userId } });
      await OtpVerification.destroy({ where: { user_id: userId } });
      await Staff.update({ added_by_admin_id: null }, { where: { added_by_admin_id: userId } });

      const user = await User.findByPk(userId);
      if (user) {
        await user.destroy();
      }
    }

    return res.status(200).json({ success: true, message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Delete Staff Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete staff member' });
  }
};

// 9. Payment Records & CSV Export
exports.getPaymentReports = async (req, res) => {
  try {
    const { plan_id, status, exportCsv, startDate, endDate } = req.query;

    const wherePayment = {};
    if (status) wherePayment.payment_status = status;
    if (plan_id) wherePayment.plan_id = plan_id;

    if (startDate && endDate) {
      wherePayment.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const payments = await Payment.findAll({
      where: wherePayment,
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'phone'] },
        { model: Plan, attributes: ['id', 'name', 'price'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (exportCsv === 'true' || req.path.endsWith('/export')) {
      const fields = ['id', 'TransactionID', 'MemberName', 'MemberEmail', 'Plan', 'Amount', 'Status', 'PaymentMethod', 'Date'];
      const data = payments.map(p => ({
        id: p.id,
        TransactionID: p.transaction_id,
        MemberName: p.User ? p.User.name : 'N/A',
        MemberEmail: p.User ? p.User.email : 'N/A',
        Plan: p.Plan ? p.Plan.name : 'N/A',
        Amount: p.amount,
        Status: p.payment_status,
        PaymentMethod: p.payment_method,
        Date: new Date(p.createdAt).toLocaleString()
      }));

      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(data);

      const dateStr = new Date().toISOString().split('T')[0];
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=payments_report_${dateStr}.csv`);
      return res.status(200).send(csv);
    }

    return res.status(200).json({ success: true, count: payments.length, payments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9b. Export Members CSV
exports.exportMembersCsv = async (req, res) => {
  try {
    const { search, status } = req.query;

    const whereUser = { role: 'user' };
    if (search) {
      whereUser[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const members = await User.findAll({
      where: whereUser,
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Membership,
          include: [{ model: Plan }],
          order: [['end_date', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    let filtered = members;
    if (status) {
      const nowStr = new Date().toISOString().split('T')[0];
      const in7DaysStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      filtered = members.filter(m => {
        const latestMem = m.Memberships && m.Memberships[0];
        if (status === 'active') {
          return latestMem && latestMem.status === 'active' && latestMem.end_date >= nowStr;
        } else if (status === 'expired') {
          return !latestMem || latestMem.status === 'expired' || latestMem.end_date < nowStr;
        } else if (status === 'expiring_soon') {
          return latestMem && latestMem.status === 'active' && latestMem.end_date >= nowStr && latestMem.end_date <= in7DaysStr;
        }
        return true;
      });
    }

    const fields = ['MemberID', 'Name', 'Email', 'Phone', 'Gender', 'PlanName', 'StartDate', 'EndDate', 'Status', 'AmountPaid'];
    const data = filtered.map(m => {
      const latestMem = m.Memberships && m.Memberships[0];
      const isActive = latestMem && latestMem.status === 'active';
      return {
        MemberID: m.id,
        Name: m.name,
        Email: m.email,
        Phone: m.phone || 'N/A',
        Gender: m.gender || 'N/A',
        PlanName: latestMem && latestMem.Plan ? latestMem.Plan.name : 'No Plan',
        StartDate: latestMem ? latestMem.start_date : 'N/A',
        EndDate: latestMem ? latestMem.end_date : 'N/A',
        Status: isActive ? 'Active' : 'Expired',
        AmountPaid: latestMem ? latestMem.amount_paid : 0
      };
    });

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=members_report_${dateStr}.csv`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Export Members CSV Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9c. Export Staff CSV
exports.exportStaffCsv = async (req, res) => {
  try {
    const { search } = req.query;

    const staffMembers = await Staff.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'phone', 'photo', 'createdAt'] },
        { model: User, as: 'Admin', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    let filtered = staffMembers;
    if (search) {
      const q = search.toLowerCase();
      filtered = staffMembers.filter(st => {
        const u = st.User;
        return (
          (u && u.name && u.name.toLowerCase().includes(q)) ||
          (u && u.email && u.email.toLowerCase().includes(q)) ||
          (u && u.phone && u.phone.includes(q)) ||
          (st.designation && st.designation.toLowerCase().includes(q))
        );
      });
    }

    const fields = ['StaffID', 'Name', 'Email', 'Phone', 'Designation', 'Permissions', 'DateAdded'];
    const data = filtered.map(st => ({
      StaffID: st.id,
      Name: st.User ? st.User.name : 'N/A',
      Email: st.User ? st.User.email : 'N/A',
      Phone: st.User ? st.User.phone : 'N/A',
      Designation: st.designation || 'N/A',
      Permissions: st.permissions || 'N/A',
      DateAdded: st.createdAt ? new Date(st.createdAt).toISOString().split('T')[0] : 'N/A'
    }));

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=staff_report_${dateStr}.csv`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Export Staff CSV Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 10. Announcement CRUD
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const announcement = await Announcement.create({
      title,
      message,
      created_by: req.user.id
    });

    return res.status(201).json({ success: true, message: 'Announcement posted!', announcement });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const ann = await Announcement.findByPk(id);
    if (!ann) return res.status(404).json({ success: false, message: 'Announcement not found' });

    await ann.destroy();
    return res.status(200).json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

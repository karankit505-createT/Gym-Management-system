const { ContactInquiry, User } = require('../models');
const { Op } = require('sequelize');
const { syncToMongo } = require('../utils/mongoSync');

// 1. Submit a new contact inquiry (Public)
// POST /api/contact/submit or POST /api/inquiries/submit
const submitInquiry = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Phone, Email, Message).'
      });
    }

    const inquiry = await ContactInquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      status: 'New'
    });

    // Auto sync lead to MongoDB Atlas 'leads' and 'contact_inquiries' collections
    syncToMongo('leads', {
      mysql_id: inquiry.id,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      message: inquiry.message,
      status: inquiry.status
    }).catch(err => console.error(err.message));

    syncToMongo('contact_inquiries', {
      mysql_id: inquiry.id,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      message: inquiry.message,
      status: inquiry.status
    }).catch(err => console.error(err.message));

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been saved. Our team will get back to you within 2 hours.',
      inquiry
    });
  } catch (error) {
    console.error('Submit contact inquiry error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while submitting your inquiry. Please try again later.'
    });
  }
};

// 2. Get all contact inquiries (Admin & Staff)
// GET /api/inquiries or GET /api/contact
const getInquiries = async (req, res) => {
  try {
    const { status, search, startDate, endDate, assigned_to } = req.query;

    const whereClause = {};

    // Status filter
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    // Assigned staff filter
    if (assigned_to) {
      whereClause.assigned_to = assigned_to;
    }

    // Date filter
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.createdAt = { [Op.gte]: new Date(startDate) };
    }

    // Search filter
    if (search && search.trim() !== '') {
      const q = search.trim();
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { phone: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { message: { [Op.like]: `%${q}%` } }
      ];
    }

    const inquiries = await ContactInquiry.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'AssignedStaff',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries
    });
  } catch (error) {
    console.error('Get contact inquiries error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching inquiries.'
    });
  }
};

// 3. Update inquiry status & notes (Admin & Staff)
// PUT /api/inquiries/:id or PATCH /api/contact/:id
const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const inquiry = await ContactInquiry.findByPk(id, {
      include: [
        {
          model: User,
          as: 'AssignedStaff',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.'
      });
    }

    const allowedStatuses = ['New', 'Contacted', 'Visited', 'Joined', 'Not Interested', 'Pending', 'Resolved'];
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status '${status}'. Must be one of: ${allowedStatuses.join(', ')}`
        });
      }
      inquiry.status = status;
    }

    if (notes !== undefined) {
      inquiry.notes = notes;
    }

    await inquiry.save();

    // Auto sync to Mongo
    syncToMongo('contact_inquiries', inquiry).catch(err => console.error(err.message));

    return res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully.',
      inquiry
    });
  } catch (error) {
    console.error('Update contact inquiry error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating inquiry.'
    });
  }
};

// 4. Assign inquiry to Staff (Admin Only)
// PUT /api/inquiries/:id/assign
const assignInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to } = req.body; // Staff User ID or null

    const inquiry = await ContactInquiry.findByPk(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.'
      });
    }

    if (assigned_to) {
      const staffUser = await User.findByPk(assigned_to);
      if (!staffUser) {
        return res.status(404).json({
          success: false,
          message: 'Target staff member not found.'
        });
      }
      inquiry.assigned_to = assigned_to;
    } else {
      inquiry.assigned_to = null;
    }

    await inquiry.save();

    const updatedInquiry = await ContactInquiry.findByPk(id, {
      include: [
        {
          model: User,
          as: 'AssignedStaff',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    syncToMongo('contact_inquiries', updatedInquiry).catch(err => console.error(err.message));

    return res.status(200).json({
      success: true,
      message: assigned_to ? 'Inquiry assigned to staff member successfully.' : 'Inquiry unassigned successfully.',
      inquiry: updatedInquiry
    });
  } catch (error) {
    console.error('Assign inquiry error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while assigning inquiry.'
    });
  }
};

// 5. Delete contact inquiry (Admin Only)
// DELETE /api/inquiries/:id
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await ContactInquiry.findByPk(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.'
      });
    }

    await inquiry.destroy();

    // Clean up Mongo
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.db) {
      const numericId = parseInt(id);
      mongoose.connection.db.collection('contact_inquiries').deleteOne({ $or: [{ mysql_id: numericId }, { _id: id }] }).catch(() => {});
      mongoose.connection.db.collection('leads').deleteOne({ $or: [{ mysql_id: numericId }, { _id: id }] }).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.'
    });
  } catch (error) {
    console.error('Delete contact inquiry error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting inquiry.'
    });
  }
};

// 6. Inquiry Analytics & Stats (Admin Only)
// GET /api/inquiries/stats
const getInquiryStats = async (req, res) => {
  try {
    const allInquiries = await ContactInquiry.findAll({
      include: [
        {
          model: User,
          as: 'AssignedStaff',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalThisWeek = 0;
    let totalThisMonth = 0;
    let newCount = 0;
    let contactedCount = 0;
    let visitedCount = 0;
    let joinedCount = 0;
    let notInterestedCount = 0;

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(now.getDate() - 3);

    const pendingFollowUps = [];

    allInquiries.forEach(inq => {
      const created = new Date(inq.createdAt);
      const updated = new Date(inq.updatedAt || inq.createdAt);

      if (created >= sevenDaysAgo) totalThisWeek++;
      if (created >= startOfMonth) totalThisMonth++;

      const st = inq.status || 'New';
      if (st === 'New') newCount++;
      else if (st === 'Contacted') contactedCount++;
      else if (st === 'Visited') visitedCount++;
      else if (st === 'Joined') joinedCount++;
      else if (st === 'Not Interested') notInterestedCount++;

      // Pending follow up: status != 'Joined' and status != 'Not Interested' and updated 3+ days ago
      if (st !== 'Joined' && st !== 'Not Interested' && updated <= threeDaysAgo) {
        pendingFollowUps.push(inq);
      }
    });

    const totalInquiries = allInquiries.length;
    const conversionRate = totalInquiries > 0 ? parseFloat(((joinedCount / totalInquiries) * 100).toFixed(1)) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalInquiries,
        totalThisWeek,
        totalThisMonth,
        newCount,
        contactedCount,
        visitedCount,
        joinedCount,
        notInterestedCount,
        conversionRate,
        pendingFollowUpCount: pendingFollowUps.length,
        pendingFollowUps,
        statusCounts: {
          New: newCount,
          Contacted: contactedCount,
          Visited: visitedCount,
          Joined: joinedCount,
          'Not Interested': notInterestedCount
        }
      }
    });
  } catch (error) {
    console.error('Get inquiry stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching inquiry stats.'
    });
  }
};

module.exports = {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  assignInquiry,
  deleteInquiry,
  getInquiryStats
};

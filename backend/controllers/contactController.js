const { ContactInquiry } = require('../models');

// @desc    Submit a new contact inquiry (Public)
// @route   POST /api/contact/submit
// @access  Public
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
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been saved. Our team will get back to you within 2 hours.',
      inquiry
    });
  } catch (error) {
    console.error('Submit contact inquiry error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while submitting your inquiry. Please try again later.'
    });
  }
};

// @desc    Get all contact inquiries (Admin Only)
// @route   GET /api/contact
// @access  Private/Admin
const getInquiries = async (req, res) => {
  try {
    const inquiries = await ContactInquiry.findAll({
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

// @desc    Update inquiry status & notes (Admin Only)
// @route   PATCH /api/contact/:id
// @access  Private/Admin
const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const inquiry = await ContactInquiry.findByPk(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.'
      });
    }

    if (status) inquiry.status = status;
    if (notes !== undefined) inquiry.notes = notes;

    await inquiry.save();

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

// @desc    Delete contact inquiry (Admin Only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
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

module.exports = {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
};

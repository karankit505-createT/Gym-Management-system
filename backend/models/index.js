const User = require('./User');
const Plan = require('./Plan');
const Membership = require('./Membership');
const Payment = require('./Payment');
const Staff = require('./Staff');
const Attendance = require('./Attendance');
const Announcement = require('./Announcement');
const OtpVerification = require('./OtpVerification');

// Associations

// User & Membership
User.hasMany(Membership, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Membership.belongsTo(User, { foreignKey: 'user_id' });

// Plan & Membership
Plan.hasMany(Membership, { foreignKey: 'plan_id', onDelete: 'RESTRICT' });
Membership.belongsTo(Plan, { foreignKey: 'plan_id' });

// User & Payment
User.hasMany(Payment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

// Membership & Payment
Membership.hasMany(Payment, { foreignKey: 'membership_id' });
Payment.belongsTo(Membership, { foreignKey: 'membership_id' });

// Plan & Payment
Plan.hasMany(Payment, { foreignKey: 'plan_id' });
Payment.belongsTo(Plan, { foreignKey: 'plan_id' });

// User & Staff
User.hasOne(Staff, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Staff.belongsTo(User, { foreignKey: 'user_id' });

Staff.belongsTo(User, { as: 'Admin', foreignKey: 'added_by_admin_id' });

// User & Attendance
User.hasMany(Attendance, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Attendance.belongsTo(User, { foreignKey: 'user_id' });

const ContactInquiry = require('./ContactInquiry');

// User & ContactInquiry (Assigned Staff)
ContactInquiry.belongsTo(User, { as: 'AssignedStaff', foreignKey: 'assigned_to' });
User.hasMany(ContactInquiry, { foreignKey: 'assigned_to' });

// User & Announcement
User.hasMany(Announcement, { foreignKey: 'created_by', onDelete: 'CASCADE' });
Announcement.belongsTo(User, { as: 'Author', foreignKey: 'created_by' });

module.exports = {
  User,
  Plan,
  Membership,
  Payment,
  Staff,
  Attendance,
  Announcement,
  OtpVerification,
  ContactInquiry
};


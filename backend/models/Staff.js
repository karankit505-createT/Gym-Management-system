const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permissions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  added_by_admin_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'staff',
  timestamps: true
});

module.exports = Staff;

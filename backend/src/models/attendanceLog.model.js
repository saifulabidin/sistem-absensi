const { DataTypes } = require('sequelize');
const db = require('../config/database');

const AttendanceLog = db.define('attendance_logs', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  clock_in: {
    type: DataTypes.DATE,
    allowNull: false
  },
  clock_out: {
    type: DataTypes.DATE,
    allowNull: true
  },
  work_hours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('present', 'late', 'absent'),
    defaultValue: 'present'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location_lat: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  location_long: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = AttendanceLog;
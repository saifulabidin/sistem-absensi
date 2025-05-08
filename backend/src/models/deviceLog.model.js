const { DataTypes } = require('sequelize');
const db = require('../config/database');

const DeviceLog = db.define('device_logs', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  device_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  device_model: {
    type: DataTypes.STRING,
    allowNull: true
  },
  login_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  logout_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING,
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

module.exports = DeviceLog;
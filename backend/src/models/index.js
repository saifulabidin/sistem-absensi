const User = require('./user.model');
const Position = require('./position.model');
const Department = require('./department.model');
const AttendanceLog = require('./attendanceLog.model');
const DeviceLog = require('./deviceLog.model');

// Define associations
Position.hasMany(User, { foreignKey: 'position_id' });
User.belongsTo(Position, { foreignKey: 'position_id' });

Department.hasMany(User, { foreignKey: 'dept_id' });
User.belongsTo(Department, { foreignKey: 'dept_id' });

User.hasMany(AttendanceLog, { foreignKey: 'user_id' });
AttendanceLog.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(DeviceLog, { foreignKey: 'user_id' });
DeviceLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  User,
  Position,
  Department,
  AttendanceLog,
  DeviceLog
};
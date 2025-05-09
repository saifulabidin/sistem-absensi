const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('./src/config/database');
const { User, Position, Department } = require('./src/models');

async function initializeDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models with database - use force:true with caution as it drops existing tables
    await sequelize.sync({ force: true });
    console.log('Database & tables created!');

    // Create default positions
    const managerPosition = await Position.create({
      name: 'Manager',
      level: 1
    });

    const staffPosition = await Position.create({
      name: 'Staff',
      level: 2
    });

    console.log('Default positions created.');

    // Create default departments
    const hrDept = await Department.create({
      name: 'Human Resources'
    });

    const itDept = await Department.create({
      name: 'Information Technology'
    });

    console.log('Default departments created.');

    // Create admin user - Don't hash the password manually, let the model hooks handle it
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // Password will be automatically hashed by the User model hooks
      role: 'admin',
      position_id: managerPosition.id,
      dept_id: hrDept.id
    });

    // Create employee user
    const employee = await User.create({
      name: 'Employee User',
      email: 'employee@example.com',
      password: 'employee123', // Password will be automatically hashed by the User model hooks
      role: 'employee',
      position_id: staffPosition.id,
      dept_id: itDept.id
    });

    console.log('Default users created.');
    console.log('Admin credentials: admin@example.com / admin123');
    console.log('Employee credentials: employee@example.com / employee123');

    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the function
initializeDatabase();

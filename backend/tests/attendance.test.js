const request = require('supertest');
const app = require('../src/index');
const { User, AttendanceLog } = require('../src/models');
const sequelize = require('../src/config/database');
const jwt = require('jsonwebtoken');

// Test user credentials
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

const employeeUser = {
  name: 'Employee User',
  email: 'employee@example.com',
  password: 'employee123',
  role: 'employee'
};

// Tokens for authentication
let adminToken;
let employeeToken;
let adminId;
let employeeId;
let attendanceId;

// Setup before tests
beforeAll(async () => {
  // Sync database in test mode - force true will drop tables and recreate
  await sequelize.sync({ force: true });
  
  // Create test users
  const createdAdmin = await User.create(adminUser);
  const createdEmployee = await User.create(employeeUser);
  
  adminId = createdAdmin.id;
  employeeId = createdEmployee.id;
  
  // Create tokens
  adminToken = jwt.sign(
    { id: createdAdmin.id, role: createdAdmin.role },
    process.env.JWT_SECRET || 'your-default-secret',
    { expiresIn: '24h' }
  );
  
  employeeToken = jwt.sign(
    { id: createdEmployee.id, role: createdEmployee.role },
    process.env.JWT_SECRET || 'your-default-secret',
    { expiresIn: '24h' }
  );
});

// Cleanup after tests
afterAll(async () => {
  await sequelize.close();
});

describe('Attendance API Endpoints', () => {
  // Test clock-in endpoint
  describe('POST /api/attendance/clock-in', () => {
    it('should allow employee to clock in', async () => {
      const res = await request(app)
        .post('/api/attendance/clock-in')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          notes: 'Working from office'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'Clock-in successful');
      expect(res.body.data).toHaveProperty('user_id', employeeId);
      expect(res.body.data).toHaveProperty('clock_in');
      expect(res.body.data).toHaveProperty('status');
      
      // Save attendance ID for later tests
      attendanceId = res.body.data.id;
    });

    it('should prevent duplicate clock-in on the same day', async () => {
      const res = await request(app)
        .post('/api/attendance/clock-in')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          notes: 'Duplicate clock-in'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'You have already clocked in today');
    });
  });

  // Test get attendance logs endpoint
  describe('GET /api/attendance', () => {
    it('should allow admin to see all attendance records', async () => {
      const res = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should restrict employee to see only their own records', async () => {
      const res = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${employeeToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      
      // All returned records should belong to the employee
      res.body.forEach(record => {
        expect(record.user_id).toEqual(employeeId);
      });
    });
  });

  // Test get attendance by ID endpoint
  describe('GET /api/attendance/:id', () => {
    it('should allow access to attendance record by ID', async () => {
      const res = await request(app)
        .get(`/api/attendance/${attendanceId}`)
        .set('Authorization', `Bearer ${employeeToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', attendanceId);
      expect(res.body).toHaveProperty('user_id', employeeId);
    });

    it('should return 404 for non-existent attendance record', async () => {
      const nonExistentId = '00000000-0000-4000-a000-000000000000'; // Random UUID
      
      const res = await request(app)
        .get(`/api/attendance/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });

  // Test clock-out endpoint
  describe('PUT /api/attendance/clock-out', () => {
    it('should allow employee to clock out', async () => {
      const res = await request(app)
        .put('/api/attendance/clock-out')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          notes: 'Day completed'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Clock-out successful');
      expect(res.body.data).toHaveProperty('user_id', employeeId);
      expect(res.body.data).toHaveProperty('clock_in');
      expect(res.body.data).toHaveProperty('clock_out');
      expect(res.body.data).toHaveProperty('work_hours');
    });

    it('should prevent clock-out without prior clock-in', async () => {
      // First, insert a mock attendance for admin
      await AttendanceLog.create({
        user_id: adminId,
        clock_in: new Date(),
        status: 'present'
      });
      
      // Clock out for admin
      await request(app)
        .put('/api/attendance/clock-out')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      
      // Try to clock out again
      const res = await request(app)
        .put('/api/attendance/clock-out')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'No active clock-in found for today');
    });
  });

  // Test attendance report endpoint
  describe('GET /api/attendance/report', () => {
    it('should allow admin to generate attendance report', async () => {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const res = await request(app)
        .get('/api/attendance/report')
        .query({
          startDate: weekAgo.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        })
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('dateRange');
      expect(res.body).toHaveProperty('statistics');
      expect(res.body).toHaveProperty('logs');
      expect(Array.isArray(res.body.logs)).toBeTruthy();
    });

    it('should reject report requests without date range', async () => {
      const res = await request(app)
        .get('/api/attendance/report')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Start and end dates are required');
    });

    it('should prevent non-admin from accessing reports', async () => {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const res = await request(app)
        .get('/api/attendance/report')
        .query({
          startDate: weekAgo.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        })
        .set('Authorization', `Bearer ${employeeToken}`);
      
      expect(res.statusCode).toEqual(403);
    });
  });
});
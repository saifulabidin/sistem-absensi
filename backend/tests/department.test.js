const request = require('supertest');
const app = require('../src/index');
const { User, Department } = require('../src/models');
const sequelize = require('../src/config/database');
const bcrypt = require('bcrypt');

let testUser;
let adminToken;
let testDepartment;

// Setup before tests
beforeAll(async () => {
  // Sync database in test mode - force true will drop tables and recreate
  await sequelize.sync({ force: true });

  // Create a test admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  testUser = await User.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: hashedPassword,
    role: 'admin'
  });

  // Login to get admin token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@test.com',
      password: 'admin123'
    });

  adminToken = loginRes.body.token;

  // Create a test department
  testDepartment = await Department.create({
    name: 'Test Department'
  });
});

// Cleanup after tests
afterAll(async () => {
  // Delete test data
  if (testUser) {
    await User.destroy({ where: { id: testUser.id } });
  }
  if (testDepartment) {
    await Department.destroy({ where: { id: testDepartment.id } });
  }
  await sequelize.close();
});

describe('Department Endpoints', () => {
  describe('GET /api/departments', () => {
    it('should get all departments with valid token', async () => {
      const res = await request(app)
        .get('/api/departments')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return 401 with no token', async () => {
      const res = await request(app)
        .get('/api/departments');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/departments/:id', () => {
    it('should get department by ID with valid token', async () => {
      const res = await request(app)
        .get(`/api/departments/${testDepartment.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', testDepartment.id);
      expect(res.body).toHaveProperty('name', 'Test Department');
    });

    it('should return 404 for non-existent department ID', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .get(`/api/departments/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /api/departments', () => {
    it('should create a new department with valid data', async () => {
      const res = await request(app)
        .post('/api/departments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Engineering'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Engineering');
    });

    it('should return 400 for duplicate department name', async () => {
      const res = await request(app)
        .post('/api/departments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Department'  // Same name as the test department
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/departments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/departments/:id', () => {
    it('should update an existing department', async () => {
      const res = await request(app)
        .put(`/api/departments/${testDepartment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Department'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', testDepartment.id);
      expect(res.body).toHaveProperty('name', 'Updated Department');
    });

    it('should return 404 for non-existent department ID', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .put(`/api/departments/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Fake Department'
        });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /api/departments/:id', () => {
    it('should create a department and then delete it', async () => {
      // First create a new department for deletion
      const createRes = await request(app)
        .post('/api/departments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Department To Delete'
        });
      
      expect(createRes.statusCode).toEqual(201);
      const departmentId = createRes.body.id;

      // Now delete it
      const deleteRes = await request(app)
        .delete(`/api/departments/${departmentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(deleteRes.statusCode).toEqual(200);
      expect(deleteRes.body).toHaveProperty('message');

      // Verify it's deleted
      const getRes = await request(app)
        .get(`/api/departments/${departmentId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(getRes.statusCode).toEqual(404);
    });

    it('should return 404 for non-existent department ID', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .delete(`/api/departments/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(404);
    });
  });
});
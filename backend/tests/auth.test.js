const request = require('supertest');
const app = require('../src/index');
const { User } = require('../src/models');
const sequelize = require('../src/config/database');
const bcrypt = require('bcrypt');

let testUser;
let adminToken;

// Setup before tests
beforeAll(async () => {
  // Sync database in test mode - force true will drop tables and recreate
  await sequelize.sync({ force: true });

  // Create a test admin user for authentication tests
  const hashedPassword = await bcrypt.hash('admin123', 10);
  testUser = await User.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: hashedPassword,
    role: 'admin'
  });
});

// Cleanup after tests
afterAll(async () => {
  // Delete test user
  if (testUser) {
    await User.destroy({ where: { id: testUser.id } });
  }
  await sequelize.close();
});

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'admin123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Test Admin');
      expect(res.body).toHaveProperty('email', 'admin@test.com');
      expect(res.body).toHaveProperty('role', 'admin');
      
      // Save token for other tests
      adminToken = res.body.token;
    });

    it('should not login with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@test.com',
          password: 'admin123'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return error for missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user info with valid token', async () => {
      // Make sure we have a token from login test
      expect(adminToken).toBeDefined();

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', testUser.id);
      expect(res.body).toHaveProperty('name', 'Test Admin');
      expect(res.body).toHaveProperty('email', 'admin@test.com');
      expect(res.body).toHaveProperty('role', 'admin');
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 with no token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should accept reset password request for valid email', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'admin@test.com'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should accept reset password request for invalid email (for security)', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'nonexistent@test.com'
        });

      // For security, should return 200 even if email doesn't exist
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should return error for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      // Make sure we have a token from login test
      expect(adminToken).toBeDefined();

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Successfully logged out');
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 with no token', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.statusCode).toEqual(401);
    });
  });
});
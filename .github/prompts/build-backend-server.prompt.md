# GitHub Copilot Agent Prompt: Express.js Backend for Attendance System

## Project Overview
I'm building an Express.js backend for an employee attendance system with the following specifications:

- The backend needs to serve both a web-based admin panel and a Flutter mobile app for employees
- The system uses PostgreSQL for data persistence
- JWT authentication is required for secure access control
- Role-based access control (admin vs employee) must be implemented
- The API needs to handle attendance tracking, employee management, and reporting

## Core Requirements

### Authentication & Authorization
- JWT-based authentication system
- Role-based middleware for access control
- Token refresh mechanism
- Password hashing and secure storage
- Password reset functionality

### Database Integration
- PostgreSQL connection setup with Sequelize or Knex.js
- Database migration scripts
- Seed data for initial setup
- Transaction support for critical operations
- Database models with proper relationships

### API Endpoints

#### Authentication
- User login endpoint for both admin and employees
- Token refresh endpoint
- Password reset endpoints
- Logout functionality

#### Employee Management (Admin only)
- CRUD operations for employee records
- Bulk upload functionality
- Employee status management (active/inactive)
- Password reset for employees

#### Attendance System
- Clock-in endpoint with geolocation validation (employee)
- Clock-out endpoint with geolocation and working hours calculation (employee)
- Attendance status verification (admin)
- Attendance report generation (admin)

#### System Settings (Admin only)
- Working hours configuration
- Late tolerance settings
- Department and position management
- Holiday calendar management

### Security Features
- Input validation and sanitization
- Protection against common vulnerabilities (XSS, CSRF, SQL Injection)
- Rate limiting for sensitive endpoints
- Logging and monitoring
- Secure headers implementation
- Device verification for mobile app

## Technical Implementation Details

### Project Structure
```
/src
  /config           # Configuration files
  /controllers      # Request handlers
  /middlewares      # Custom middlewares
  /models           # Database models
  /routes           # API routes
  /services         # Business logic
  /utils            # Helper functions
  /validation       # Input validation schemas
  /db               # Database migrations and seeders
  server.js         # Application entry point
```

### Authentication Implementation
Based on the provided middleware code:

```javascript
// Middleware for JWT token verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak: Token tidak ditemukan' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Akses ditolak: Token tidak valid' });
  }
};

// Middleware for admin-only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Akses ditolak: Memerlukan hak akses admin' });
  }
};

// Middleware for employee-only access
const employeeOnly = (req, res, next) => {
  if (req.user && req.user.role === 'employee') {
    next();
  } else {
    return res.status(403).json({ message: 'Akses ditolak: Memerlukan hak akses karyawan' });
  }
};
```

### Database Models

#### User/Employee Model
```javascript
const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'employee'),
    defaultValue: 'employee'
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departmentId: {
    type: DataTypes.UUID,
    references: {
      model: 'Departments',
      key: 'id'
    }
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE
  }
});
```

#### Attendance Model
```javascript
const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.UUID,
    references: {
      model: 'Employees',
      key: 'id'
    },
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  clockIn: {
    type: DataTypes.DATE,
    allowNull: false
  },
  clockInLocation: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false
  },
  clockOut: {
    type: DataTypes.DATE
  },
  clockOutLocation: {
    type: DataTypes.GEOMETRY('POINT')
  },
  workingHours: {
    type: DataTypes.FLOAT
  },
  status: {
    type: DataTypes.ENUM('present', 'late', 'absent'),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  },
  deviceInfo: {
    type: DataTypes.JSONB
  }
});
```

#### Department Model
```javascript
const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  }
});
```

#### Settings Model
```javascript
const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  workStartTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  workEndTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  lateTolerance: {
    type: DataTypes.INTEGER, // Minutes
    allowNull: false,
    defaultValue: 15
  },
  geoFenceRadius: {
    type: DataTypes.INTEGER, // Meters
    allowNull: false,
    defaultValue: 100
  },
  officeLocation: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false
  }
});
```

#### Holiday Model
```javascript
const Holiday = sequelize.define('Holiday', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  }
});
```

### API Route Implementation

```javascript
// Auth routes
router.post('/auth/login', authController.login);
router.post('/auth/refresh-token', authController.refreshToken);
router.post('/auth/logout', verifyToken, authController.logout);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

// Employee routes (admin only)
router.get('/employees', verifyToken, adminOnly, employeeController.getAllEmployees);
router.get('/employees/:id', verifyToken, adminOnly, employeeController.getEmployeeById);
router.post('/employees', verifyToken, adminOnly, employeeController.createEmployee);
router.put('/employees/:id', verifyToken, adminOnly, employeeController.updateEmployee);
router.delete('/employees/:id', verifyToken, adminOnly, employeeController.deleteEmployee);
router.post('/employees/bulk-upload', verifyToken, adminOnly, employeeController.bulkUpload);
router.put('/employees/:id/reset-password', verifyToken, adminOnly, employeeController.resetPassword);
router.put('/employees/:id/status', verifyToken, adminOnly, employeeController.updateStatus);

// Employee profile (employee access)
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile/change-password', verifyToken, userController.changePassword);

// Attendance routes (employee)
router.post('/attendance/clock-in', verifyToken, employeeOnly, attendanceController.clockIn);
router.post('/attendance/clock-out', verifyToken, employeeOnly, attendanceController.clockOut);
router.get('/attendance/history', verifyToken, attendanceController.getPersonalHistory);
router.get('/attendance/today', verifyToken, attendanceController.getTodayStatus);

// Attendance routes (admin)
router.get('/attendance/report', verifyToken, adminOnly, attendanceController.getReport);
router.get('/attendance/stats', verifyToken, adminOnly, attendanceController.getStats);
router.get('/attendance/employees/:id', verifyToken, adminOnly, attendanceController.getEmployeeAttendance);

// Department routes (admin only)
router.get('/departments', verifyToken, adminOnly, departmentController.getAllDepartments);
router.post('/departments', verifyToken, adminOnly, departmentController.createDepartment);
router.put('/departments/:id', verifyToken, adminOnly, departmentController.updateDepartment);
router.delete('/departments/:id', verifyToken, adminOnly, departmentController.deleteDepartment);

// Settings routes (admin only)
router.get('/settings', verifyToken, adminOnly, settingsController.getSettings);
router.put('/settings', verifyToken, adminOnly, settingsController.updateSettings);

// Holiday routes (admin only)
router.get('/holidays', verifyToken, adminOnly, holidayController.getAllHolidays);
router.post('/holidays', verifyToken, adminOnly, holidayController.createHoliday);
router.delete('/holidays/:id', verifyToken, adminOnly, holidayController.deleteHoliday);
```

### Security Implementation

#### Password Handling
According to the documentation:
- Admin passwords must be at least 8 characters with uppercase, lowercase, numbers, and symbols
- Employee passwords must be at least 6 characters with letters and numbers

```javascript
// Password validation middleware
const validateAdminPassword = (req, res, next) => {
  const { password } = req.body;
  
  // Password validation for admin
  const adminPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  if (!adminPasswordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, angka, dan simbol'
    });
  }
  
  next();
};

// Password validation middleware for employees
const validateEmployeePassword = (req, res, next) => {
  const { password } = req.body;
  
  // Password validation for employees
  const employeePasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  
  if (!employeePasswordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password harus minimal 6 karakter dan mengandung huruf dan angka'
    });
  }
  
  next();
};
```

#### Security Middleware
```javascript
// Apply security middleware to the app
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Security middleware
app.use(helmet()); // Set security headers
app.use(xss()); // Sanitize inputs
app.use(hpp()); // Protect against HTTP Parameter Pollution

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/auth', limiter); // Apply rate limiting to auth endpoints

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'https://admin.yourdomain.com'],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));
```

#### Mobile Security Verification
```javascript
// Middleware to detect suspicious devices
const verifyDevice = (req, res, next) => {
  const { deviceInfo } = req.body;
  
  // Check for fake GPS, root, emulator, etc.
  if (deviceInfo.isFakeGps || deviceInfo.isRooted || deviceInfo.isEmulator || 
      deviceInfo.isShizuku || deviceInfo.isMagisk) {
    return res.status(403).json({
      message: 'Aplikasi tidak dapat digunakan pada perangkat yang telah dimodifikasi'
    });
  }
  
  next();
};

// Apply to mobile app endpoints
router.post('/attendance/clock-in', verifyToken, employeeOnly, verifyDevice, attendanceController.clockIn);
router.post('/attendance/clock-out', verifyToken, employeeOnly, verifyDevice, attendanceController.clockOut);
```

## Controller Implementation Examples

### Auth Controller
```javascript
// Login functionality
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await Employee.findOne({ where: { email, isActive: true } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    
    // Update last login
    await user.update({ lastLogin: new Date() });
    
    // Return tokens and user data
    return res.status(200).json({
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
```

### Employee Controller
```javascript
// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      position,
      departmentId,
      employeeId,
      gender,
      phone,
      address
    } = req.body;
    
    // Check if email already exists
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }
    
    // Generate random password
    const generatedPassword = generatePassword(8);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    
    // Create employee
    const employee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      role: 'employee',
      position,
      departmentId,
      employeeId,
      gender,
      phone,
      address
    });
    
    // Send email with credentials (implementation not shown)
    await sendEmployeeCredentials(email, generatedPassword);
    
    return res.status(201).json({
      message: 'Karyawan berhasil dibuat',
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        position: employee.position,
        employeeId: employee.employeeId
      }
    });
  } catch (error) {
    console.error('Create employee error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
```

### Attendance Controller
```javascript
// Clock-in functionality
exports.clockIn = async (req, res) => {
  try {
    const { latitude, longitude, deviceInfo } = req.body;
    const employeeId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if already clocked in today
    const existingAttendance = await Attendance.findOne({
      where: {
        employeeId,
        date: today
      }
    });
    
    if (existingAttendance) {
      return res.status(400).json({ message: 'Anda sudah melakukan clock in hari ini' });
    }
    
    // Get work settings
    const settings = await Settings.findOne();
    
    // Check office location
    const officeLocation = settings.officeLocation;
    const distance = calculateDistance(
      latitude, 
      longitude, 
      officeLocation.coordinates[1], 
      officeLocation.coordinates[0]
    );
    
    if (distance > settings.geoFenceRadius) {
      return res.status(400).json({ 
        message: 'Anda berada di luar area kantor, tidak dapat melakukan clock in' 
      });
    }
    
    // Determine if late
    const now = new Date();
    const workStartTime = new Date(today);
    const [hours, minutes] = settings.workStartTime.split(':');
    workStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const lateTolerance = settings.lateTolerance * 60 * 1000; // Convert to milliseconds
    const lateThreshold = new Date(workStartTime.getTime() + lateTolerance);
    
    const status = now > lateThreshold ? 'late' : 'present';
    
    // Create attendance record
    const attendance = await Attendance.create({
      employeeId,
      date: today,
      clockIn: now,
      clockInLocation: { type: 'Point', coordinates: [longitude, latitude] },
      status,
      deviceInfo
    });
    
    return res.status(201).json({
      message: 'Clock in berhasil',
      attendance: {
        id: attendance.id,
        date: attendance.date,
        clockIn: attendance.clockIn,
        status: attendance.status
      }
    });
  } catch (error) {
    console.error('Clock in error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
```

## Additional Features

### Excel Import/Export
```javascript
// Import Excel file for bulk employee upload
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');

exports.bulkUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File Excel diperlukan' });
    }
    
    const filePath = req.file.path;
    
    // Convert Excel to JSON
    const excelData = excelToJson({
      sourceFile: filePath,
      sheets: ['Employees'],
      header: {
        rows: 1
      },
      columnToKey: {
        A: 'name',
        B: 'email',
        C: 'position',
        D: 'departmentId',
        E: 'employeeId',
        F: 'gender',
        G: 'phone',
        H: 'address'
      }
    });
    
    // Remove temp file
    fs.unlinkSync(filePath);
    
    if (!excelData.Employees || excelData.Employees.length === 0) {
      return res.status(400).json({ message: 'File Excel tidak memiliki data' });
    }
    
    // Process employees
    const employees = excelData.Employees;
    const results = {
      success: 0,
      failed: 0,
      errors: []
    };
    
    for (const emp of employees) {
      try {
        // Validate required fields
        if (!emp.name || !emp.email || !emp.position || !emp.departmentId || 
            !emp.employeeId || !emp.gender || !emp.phone || !emp.address) {
          results.failed++;
          results.errors.push(`Data tidak lengkap untuk ${emp.name || emp.email || 'Unknown'}`);
          continue;
        }
        
        // Check if email already exists
        const existingEmployee = await Employee.findOne({ where: { email: emp.email } });
        if (existingEmployee) {
          results.failed++;
          results.errors.push(`Email ${emp.email} sudah digunakan`);
          continue;
        }
        
        // Generate random password
        const generatedPassword = generatePassword(8);
        
        // Hash password
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        
        // Create employee
        await Employee.create({
          name: emp.name,
          email: emp.email,
          password: hashedPassword,
          role: 'employee',
          position: emp.position,
          departmentId: emp.departmentId,
          employeeId: emp.employeeId,
          gender: emp.gender,
          phone: emp.phone,
          address: emp.address
        });
        
        // Send email with credentials (implementation not shown)
        await sendEmployeeCredentials(emp.email, generatedPassword);
        
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Error untuk ${emp.name || emp.email || 'Unknown'}: ${error.message}`);
      }
    }
    
    return res.status(200).json({
      message: 'Bulk upload selesai',
      results
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
```

### Report Generation
```javascript
// Generate attendance report
exports.getReport = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      departmentId, 
      employeeId, 
      status,
      page = 1,
      limit = 10
    } = req.query;
    
    // Build filter object
    const whereClause = {};
    
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.date = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.date = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    // Employee filters
    const employeeWhereClause = {};
    
    if (employeeId) {
      employeeWhereClause.id = employeeId;
    }
    
    if (departmentId) {
      employeeWhereClause.departmentId = departmentId;
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get attendance records
    const { count, rows } = await Attendance.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'name', 'email', 'employeeId', 'position'],
          where: employeeWhereClause,
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['date', 'DESC'], ['clockIn', 'DESC']],
      limit,
      offset
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(count / limit);
    
    return res.status(200).json({
      message: 'Laporan absensi berhasil diambil',
      data: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get report error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
```

## Testing and Documentation

### API Documentation Setup
```javascript
// Swagger documentation setup
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Attendance System API',
      version: '1.0.0',
      description: 'API Documentation for Attendance System'
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
```

### Unit Testing Setup
```javascript
// Employee controller test example
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

describe('Employee Controller', () => {
  let token;
  let adminId;
  
  beforeAll(async () => {
    // Create admin user for testing
    const admin = await Employee.create({
      name: 'Admin Test',
      email: 'admin.test@example.com',
      password: await bcrypt.hash('Password123!', 10),
      role: 'admin',
      position: 'Administrator',
      departmentId: '550e8400-e29b-41d4-a716-446655440000',
      employeeId: 'ADM001',
      gender: 'male',
      phone: '123456789',
      address: 'Test Address'
    });
    
    adminId = admin.id;
    
    // Generate token
    token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });
  
  afterAll(async () => {
    // Clean up test data
    await Employee.destroy({ where: { id: adminId } });
  });
  
  describe('GET /api/employees', () => {
    it('should get all employees', async () => {
      const res = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });
    
    it('should return 401 if no token provided', async () => {
      const res = await request(app)
        .get('/api/employees');
      
      expect(res.statusCode).toEqual(401);
    });
  });
  
  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const employeeData = {
        name: 'Test Employee',
        email: 'test.employee@example.com',
        position: 'Developer',
        departmentId: '550e8400-e29b-41d4-a716-446655440000',
        employeeId: 'DEV001',
        gender: 'male',
        phone: '123456789',
        address: 'Test Address'
      };
      
      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send(employeeData);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'Karyawan berhasil dibuat');
      expect(res.body).toHaveProperty('employee');
      expect(res.body.employee).toHaveProperty('email', employeeData.email);
      
      // Clean up
      await Employee.destroy({ where: { email: employeeData.email } });
    });
  });
});
```

## Performance Optimization Tips

1. **Implement caching**:
   - Use Redis for caching frequently accessed data
   - Cache attendance reports and dashboard statistics

2. **Database optimization**:
   - Add proper indexes to frequently queried fields
   - Use database connection pooling
   - Implement query optimization

3. **Application optimization**:
   - Use compression middleware
   - Implement pagination for large datasets
   - Use PM2 for process management
   - Implement horizontal scaling

4. **Monitoring**:
   - Set up logging with Winston
   - Implement error tracking
   - Performance monitoring with New Relic or similar tools

5. **Security hardening**:
   - Regular security audits
   - Implement request validation
   - Use parameterized queries to prevent SQL injection
   - Set up secure headers

This prompt provides comprehensive guidance for GitHub Copilot to assist you in building a robust, secure, and scalable Express.js backend for your attendance system, following best practices and implementing all the required features outlined in your documentation.
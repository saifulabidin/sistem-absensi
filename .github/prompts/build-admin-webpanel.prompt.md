# GitHub Copilot Agent Prompt: Admin Panel for Attendance System

## Project Overview
I'm building an admin panel web application for an employee attendance system with the following specifications:

- The admin panel is for administrators to manage employee data and attendance reports
- The system has a separate mobile app (Flutter) for employees to clock in/out
- The backend is built with Node.js and uses PostgreSQL for the database
- JWT authentication is used for access control
- JWT tokens are stored in HTTP-only cookies for security

## Core Requirements

### Authentication & Authorization
- Login page for admin users
- JWT-based authentication with role verification
- Middleware for controlling access to admin-only routes
- Session management and token refresh mechanism

### Dashboard
- Real-time attendance monitoring dashboard
- Summary statistics showing:
  - Total employees
  - Present today count
  - Absent today count
  - Late arrivals count
- Charts and graphs for attendance visualization
- Filter options by department, date range, and attendance status

### Employee Management
- Complete CRUD operations for employee records
- Bulk upload feature using Excel spreadsheets
- Employee profile page with personal details
- Password reset functionality
- Account suspension/deactivation options

### Attendance Reports
- Comprehensive attendance report table with filtering and pagination
- Export functionality to Excel
- Date range selection
- Department and employee filtering
- Status filtering (present, absent, late)

### System Settings
- Working hours configuration
- Late tolerance settings
- Department and position management
- Holiday calendar management

## Technical Details

### Frontend
- Use React.js with TypeScript
- Implement responsive design using Tailwind CSS
- Component-based architecture for reusability
- State management with Redux or Context API
- Form handling with React Hook Form or Formik
- Form validation with Yup or Zod
- React Query for data fetching and caching
- Recharts or Chart.js for visualization components

### API Integration
- RESTful API consumption
- Axios for HTTP requests
- JWT token handling with Axios interceptors
- Error handling and retry mechanisms

### Security Features
- Input sanitization
- XSS protection
- CSRF protection
- Rate limiting
- Password strength validation
- Secure HTTP headers

## User Interface Requirements

### General Layout
- Side navigation menu with collapsible sections
- Top header with user profile and notifications
- Breadcrumb navigation
- Consistent theming and styling
- Light/dark mode toggle
- Mobile-responsive design

### Tables and Data Display
- Sortable columns
- Pagination
- Bulk actions
- Advanced filtering
- Row selection
- Search functionality
- Loading states and error handling

### Forms
- Multi-step forms for complex workflows
- Form validation with error messages
- Auto-save functionality
- Field masking for formatted inputs
- Date pickers and time selectors
- Dropdowns and multi-selects
- File upload with preview

## Implementation Guidance

### File Structure
Please organize the project with a clear separation of concerns:
```
/src
  /assets          # Images, icons, fonts
  /components      # Reusable UI components
  /contexts        # React contexts
  /hooks           # Custom React hooks
  /layouts         # Page layouts
  /pages           # Route components
  /redux           # State management
  /services        # API and external services
  /styles          # Global styles
  /types           # TypeScript types
  /utils           # Helper functions
```

### Coding Standards
- Follow AirBnB style guide for React
- Use functional components with hooks
- Implement proper error handling
- Add JSDoc comments for functions
- Use TypeScript interfaces for data models
- Write unit tests for critical components
- Follow best practices for accessibility (WCAG)

## Specific Component Requirements

### Login Page
- Email and password fields
- Password visibility toggle
- Remember me option
- Forgot password link
- Form validation
- Error handling for failed login attempts

### Employee Form
- Personal information section (name, email, gender, phone)
- Employment details section (NIK National ID, position, department)
- Address information
- Password generation or reset
- Account status toggle

### Attendance Report
- Date range selector
- Department filter
- Employee search
- Status filter (present, absent, late)
- Export button for Excel download
- Detailed view modal for individual records

### Dashboard Widgets
- Attendance summary cards
- Weekly attendance chart
- Department attendance comparison
- Late arrivals trend
- Recent activity log

## API Endpoints to Integrate

```javascript
// Authentication
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout

// Employee Management
GET /api/employees
GET /api/employees/:id
POST /api/employees
PUT /api/employees/:id
DELETE /api/employees/:id
POST /api/employees/bulk-upload
PUT /api/employees/:id/reset-password
PUT /api/employees/:id/status

// Attendance
GET /api/attendance/report
GET /api/attendance/stats
GET /api/attendance/employees/:id

// Settings
GET /api/settings
PUT /api/settings
GET /api/departments
POST /api/departments
PUT /api/departments/:id
DELETE /api/departments/:id
GET /api/holidays
POST /api/holidays
DELETE /api/holidays/:id
```

## Security Implementation Details
Based on the provided middleware code:

```javascript
// Authentication middleware
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

// Admin authorization middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Akses ditolak: Memerlukan hak akses admin' });
  }
};
```

## Password Requirements
According to the documentation:
- Admin passwords must be at least 8 characters
- Must contain uppercase, lowercase, numbers, and symbols
- Implement client-side and server-side validation

This prompt provides comprehensive guidance for GitHub Copilot to assist in building a complete admin panel for the attendance system based on the provided documentation.
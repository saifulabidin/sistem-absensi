// Global variables
const API_URL = 'http://localhost:5000/api';
let employeesData = [];
let departmentsData = [];
let positionsData = [];
let attendanceData = [];
let currentDepartmentFilter = '';
let currentDateFilter = '';

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    setupEventListeners();
    loadDashboardData();
});

// Check if user is authenticated
function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
    }
}

// Set up event listeners
function setupEventListeners() {
    document.getElementById('filterDepartment').addEventListener('change', filterAttendance);
    document.getElementById('filterDate').addEventListener('change', filterAttendance);
    document.getElementById('btnRefresh').addEventListener('click', loadDashboardData);
}

// Load all dashboard data
async function loadDashboardData() {
    try {
        // Show loading indicators
        document.getElementById('employeesCount').innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        document.getElementById('departmentsCount').innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        document.getElementById('positionsCount').innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="6" class="text-center"><span class="spinner-border"></span></td></tr>';
        
        // Fetch departments for filter dropdown
        await loadDepartments();
        
        // Fetch all data
        await Promise.all([
            loadEmployees(),
            loadPositions(),
            loadAttendance()
        ]);
        
        updateDashboardCounts();
        updateAttendanceChart();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showAlert('Failed to load dashboard data', 'danger');
    }
}

// Load departments data
async function loadDepartments() {
    try {
        const response = await fetchWithAuth(`${API_URL}/departments`);
        departmentsData = await response.json();
        
        // Update department filter dropdown
        const filterSelect = document.getElementById('filterDepartment');
        filterSelect.innerHTML = '<option value="">All Departments</option>';
        
        departmentsData.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            filterSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error loading departments:', error);
        showAlert('Failed to load departments', 'danger');
    }
}

// Load employees data
async function loadEmployees() {
    try {
        const response = await fetchWithAuth(`${API_URL}/employees`);
        employeesData = await response.json();
    } catch (error) {
        console.error('Error loading employees:', error);
        showAlert('Failed to load employees', 'danger');
    }
}

// Load positions data
async function loadPositions() {
    try {
        const response = await fetchWithAuth(`${API_URL}/positions`);
        positionsData = await response.json();
    } catch (error) {
        console.error('Error loading positions:', error);
        showAlert('Failed to load positions', 'danger');
    }
}

// Load attendance data
async function loadAttendance() {
    try {
        // Create query params for filters
        let queryParams = new URLSearchParams();
        
        if (currentDepartmentFilter) {
            queryParams.append('departmentId', currentDepartmentFilter);
        }
        
        if (currentDateFilter) {
            const [year, month, day] = currentDateFilter.split('-');
            const date = new Date(year, month - 1, day);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            queryParams.append('startDate', currentDateFilter);
            queryParams.append('endDate', nextDay.toISOString().split('T')[0]);
        }
        
        // Fetch attendance data
        const response = await fetchWithAuth(`${API_URL}/attendance?${queryParams}`);
        attendanceData = await response.json();
        
        // Update attendance table
        updateAttendanceTable();
        
    } catch (error) {
        console.error('Error loading attendance:', error);
        showAlert('Failed to load attendance data', 'danger');
    }
}

// Update attendance table
function updateAttendanceTable() {
    const tableBody = document.getElementById('attendanceTableBody');
    tableBody.innerHTML = '';
    
    if (attendanceData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No attendance records found</td></tr>';
        return;
    }
    
    attendanceData.forEach(record => {
        const employee = record.user ? record.user.name : 'Unknown';
        const clockIn = new Date(record.clock_in).toLocaleTimeString();
        const clockOut = record.clock_out ? new Date(record.clock_out).toLocaleTimeString() : '-';
        const workHours = record.work_hours ? record.work_hours.toFixed(2) : '-';
        
        // Create status badge
        let statusBadge = '';
        switch (record.status) {
            case 'present':
                statusBadge = '<span class="badge bg-success">Present</span>';
                break;
            case 'late':
                statusBadge = '<span class="badge bg-warning">Late</span>';
                break;
            case 'absent':
                statusBadge = '<span class="badge bg-danger">Absent</span>';
                break;
            default:
                statusBadge = '<span class="badge bg-secondary">Unknown</span>';
        }
        
        // Add row to table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(record.clock_in).toLocaleDateString()}</td>
            <td>${employee}</td>
            <td>${clockIn}</td>
            <td>${clockOut}</td>
            <td>${workHours}</td>
            <td>${statusBadge}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Update dashboard counts
function updateDashboardCounts() {
    document.getElementById('employeesCount').textContent = employeesData.length;
    document.getElementById('departmentsCount').textContent = departmentsData.length;
    document.getElementById('positionsCount').textContent = positionsData.length;
    
    // Calculate attendance stats
    const presentCount = attendanceData.filter(a => a.status === 'present').length;
    const lateCount = attendanceData.filter(a => a.status === 'late').length;
    const absentCount = attendanceData.filter(a => a.status === 'absent').length;
    
    document.getElementById('presentCount').textContent = presentCount;
    document.getElementById('lateCount').textContent = lateCount;
}

// Update attendance chart
function updateAttendanceChart() {
    // Calculate department-wise attendance
    let deptAttendance = {};
    
    // Initialize counts for each department
    departmentsData.forEach(dept => {
        deptAttendance[dept.name] = { present: 0, late: 0, absent: 0 };
    });
    
    // Count attendance by department
    attendanceData.forEach(record => {
        if (record.user && record.user.department) {
            const deptName = record.user.department.name;
            if (!deptAttendance[deptName]) {
                deptAttendance[deptName] = { present: 0, late: 0, absent: 0 };
            }
            deptAttendance[deptName][record.status]++;
        }
    });
    
    // If you have a chart library, you can initialize it here
    console.log('Department attendance data for chart:', deptAttendance);
}

// Filter attendance by department and date
function filterAttendance() {
    currentDepartmentFilter = document.getElementById('filterDepartment').value;
    currentDateFilter = document.getElementById('filterDate').value;
    
    loadAttendance();
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertsContainer = document.getElementById('alerts');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertsContainer.appendChild(alert);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 150);
    }, 5000);
}
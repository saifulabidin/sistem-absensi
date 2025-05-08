// Initialize the page when document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication before loading data
    const token = localStorage.getItem('token');
    if (token) {
        initializeEmployeesPage();
    }
    
    // Set up event handlers
    document.getElementById('btnSaveEmployee').addEventListener('click', handleAddEmployee);
    document.getElementById('btnUpdateEmployee').addEventListener('click', handleUpdateEmployee);
    document.getElementById('btnDeleteEmployee').addEventListener('click', handleDeleteEmployee);
    document.getElementById('btnSearch').addEventListener('click', loadEmployees);
    
    // Handle sidebar toggle
    const sidebarToggle = document.getElementById('sidebarCollapse');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
    }
});

// Initialize the employees page
function initializeEmployeesPage() {
    loadEmployees();
    loadDepartments();
    loadPositions();
}

// Load all employees
function loadEmployees() {
    // Get filter values
    const searchQuery = document.getElementById('searchInput').value.trim();
    const departmentId = document.getElementById('departmentFilter').value;
    const positionId = document.getElementById('positionFilter').value;
    
    // Build query string
    let queryParams = [];
    if (searchQuery) queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
    if (departmentId) queryParams.push(`dept_id=${encodeURIComponent(departmentId)}`);
    if (positionId) queryParams.push(`position_id=${encodeURIComponent(positionId)}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    // Fetch employees
    fetchWithAuth(`${API_URL}/employees${queryString}`)
        .then(response => response.json())
        .then(employees => {
            displayEmployees(employees);
        })
        .catch(error => {
            console.error('Error loading employees:', error);
            alert('Failed to load employees data.');
        });
}

// Display employees in the table
function displayEmployees(employees) {
    const tableBody = document.getElementById('employeesTable');
    tableBody.innerHTML = '';
    
    if (employees.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" class="text-center">No employees found</td>';
        tableBody.appendChild(row);
        return;
    }
    
    employees.forEach(employee => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.department ? employee.department.name : 'Not assigned'}</td>
            <td>${employee.position ? employee.position.name : 'Not assigned'}</td>
            <td>${employee.role === 'admin' ? 
                '<span class="badge bg-danger">Admin</span>' : 
                '<span class="badge bg-primary">Employee</span>'}
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 btn-edit" data-id="${employee.id}">
                    Edit
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${employee.id}">
                    Delete
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', () => openEditModal(button.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', () => openDeleteModal(button.getAttribute('data-id')));
    });
}

// Load departments for dropdowns
function loadDepartments() {
    fetchWithAuth(`${API_URL}/departments`)
        .then(response => response.json())
        .then(departments => {
            populateDepartmentDropdowns(departments);
        })
        .catch(error => {
            console.error('Error loading departments:', error);
        });
}

// Load positions for dropdowns
function loadPositions() {
    fetchWithAuth(`${API_URL}/positions`)
        .then(response => response.json())
        .then(positions => {
            populatePositionDropdowns(positions);
        })
        .catch(error => {
            console.error('Error loading positions:', error);
        });
}

// Populate department dropdowns
function populateDepartmentDropdowns(departments) {
    const dropdowns = [
        document.getElementById('department'),
        document.getElementById('editDepartment'),
        document.getElementById('departmentFilter')
    ];
    
    dropdowns.forEach(dropdown => {
        if (!dropdown) return;
        
        // Keep the first option (placeholder)
        const firstOption = dropdown.options[0];
        dropdown.innerHTML = '';
        dropdown.appendChild(firstOption);
        
        // Add department options
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            dropdown.appendChild(option);
        });
    });
}

// Populate position dropdowns
function populatePositionDropdowns(positions) {
    const dropdowns = [
        document.getElementById('position'),
        document.getElementById('editPosition'),
        document.getElementById('positionFilter')
    ];
    
    dropdowns.forEach(dropdown => {
        if (!dropdown) return;
        
        // Keep the first option (placeholder)
        const firstOption = dropdown.options[0];
        dropdown.innerHTML = '';
        dropdown.appendChild(firstOption);
        
        // Add position options
        positions.forEach(pos => {
            const option = document.createElement('option');
            option.value = pos.id;
            option.textContent = pos.name;
            dropdown.appendChild(option);
        });
    });
}

// Handle adding a new employee
function handleAddEmployee() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const department = document.getElementById('department').value;
    const position = document.getElementById('position').value;
    const role = document.getElementById('role').value;
    const errorElement = document.getElementById('formError');
    
    // Validate required fields
    if (!name || !email || !password) {
        errorElement.textContent = 'Name, email and password are required';
        errorElement.classList.remove('d-none');
        return;
    }
    
    // Reset error message
    errorElement.classList.add('d-none');
    
    const employeeData = {
        name,
        email,
        password,
        role,
        dept_id: department || null,
        position_id: position || null
    };
    
    fetchWithAuth(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message || 'Failed to add employee'); });
        }
        return response.json();
    })
    .then(() => {
        // Close modal and reload employees
        const modal = bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal'));
        modal.hide();
        
        // Clear form
        document.getElementById('addEmployeeForm').reset();
        
        // Reload employees
        loadEmployees();
    })
    .catch(error => {
        errorElement.textContent = error.message;
        errorElement.classList.remove('d-none');
    });
}

// Open the edit modal with employee data
function openEditModal(employeeId) {
    fetchWithAuth(`${API_URL}/employees/${employeeId}`)
        .then(response => response.json())
        .then(employee => {
            // Populate form fields
            document.getElementById('editId').value = employee.id;
            document.getElementById('editName').value = employee.name;
            document.getElementById('editEmail').value = employee.email;
            document.getElementById('editPassword').value = '';  // Don't populate password
            
            if (employee.dept_id) {
                document.getElementById('editDepartment').value = employee.dept_id;
            }
            
            if (employee.position_id) {
                document.getElementById('editPosition').value = employee.position_id;
            }
            
            document.getElementById('editRole').value = employee.role;
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('editEmployeeModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error loading employee details:', error);
            alert('Failed to load employee details.');
        });
}

// Handle updating an employee
function handleUpdateEmployee() {
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const password = document.getElementById('editPassword').value;
    const department = document.getElementById('editDepartment').value;
    const position = document.getElementById('editPosition').value;
    const role = document.getElementById('editRole').value;
    const errorElement = document.getElementById('editFormError');
    
    // Validate required fields
    if (!name || !email) {
        errorElement.textContent = 'Name and email are required';
        errorElement.classList.remove('d-none');
        return;
    }
    
    // Reset error message
    errorElement.classList.add('d-none');
    
    const employeeData = {
        name,
        email,
        role,
        dept_id: department || null,
        position_id: position || null
    };
    
    // Only include password if it was provided
    if (password) {
        employeeData.password = password;
    }
    
    fetchWithAuth(`${API_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message || 'Failed to update employee'); });
        }
        return response.json();
    })
    .then(() => {
        // Close modal and reload employees
        const modal = bootstrap.Modal.getInstance(document.getElementById('editEmployeeModal'));
        modal.hide();
        
        // Reload employees
        loadEmployees();
    })
    .catch(error => {
        errorElement.textContent = error.message;
        errorElement.classList.remove('d-none');
    });
}

// Open the delete confirmation modal
function openDeleteModal(employeeId) {
    document.getElementById('deleteId').value = employeeId;
    const modal = new bootstrap.Modal(document.getElementById('deleteEmployeeModal'));
    modal.show();
}

// Handle deleting an employee
function handleDeleteEmployee() {
    const id = document.getElementById('deleteId').value;
    
    fetchWithAuth(`${API_URL}/employees/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message || 'Failed to delete employee'); });
        }
        return response.json();
    })
    .then(() => {
        // Close modal and reload employees
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteEmployeeModal'));
        modal.hide();
        
        // Reload employees
        loadEmployees();
    })
    .catch(error => {
        console.error('Error deleting employee:', error);
        alert(error.message || 'Failed to delete employee.');
    });
}
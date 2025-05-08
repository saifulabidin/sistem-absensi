// Configuration
const API_URL = 'http://localhost:5000/api';
let currentUser = null;

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        showLoginModal();
    } else {
        // Validate token and get user info
        fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid token');
            }
            return response.json();
        })
        .then(data => {
            currentUser = data;
            updateUI();
        })
        .catch(() => {
            localStorage.removeItem('token');
            showLoginModal();
        });
    }

    // Setup event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('btnLogout').addEventListener('click', handleLogout);
});

// Display login modal
function showLoginModal() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    // Reset error message
    errorElement.classList.add('d-none');
    
    fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid credentials');
        }
        return response.json();
    })
    .then(data => {
        // Store token
        localStorage.setItem('token', data.token);
        
        // Update current user
        currentUser = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role
        };
        
        // Close modal
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        
        // Update UI
        updateUI();
    })
    .catch(error => {
        errorElement.textContent = error.message;
        errorElement.classList.remove('d-none');
    });
}

// Handle logout
function handleLogout() {
    const token = localStorage.getItem('token');
    
    if (token) {
        fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .finally(() => {
            // Clear user data regardless of server response
            localStorage.removeItem('token');
            currentUser = null;
            showLoginModal();
        });
    }
}

// Update UI based on user login status
function updateUI() {
    const usernameElement = document.getElementById('username');
    
    if (currentUser) {
        usernameElement.textContent = currentUser.name;
    } else {
        usernameElement.textContent = 'Guest';
    }
}

// Helper function to make authenticated API requests
function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        showLoginModal();
        return Promise.reject(new Error('Authentication required'));
    }
    
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };
    
    return fetch(url, {
        ...options,
        headers
    }).then(response => {
        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            showLoginModal();
            throw new Error('Authentication failed');
        }
        return response;
    });
}
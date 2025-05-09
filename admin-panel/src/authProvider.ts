import { AuthProvider } from 'react-admin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authProvider: AuthProvider = {
    login: ({ username, password }) => {
        return fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email: username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include', // Important for cookies
        })
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(auth => {
                // Store the token in localStorage
                localStorage.setItem('token', auth.token);
                localStorage.setItem('user', JSON.stringify({
                    id: auth.id,
                    fullName: auth.name,
                    role: auth.role,
                    email: auth.email,
                }));
                // Check if user is admin
                if (auth.role !== 'admin') {
                    throw new Error('Unauthorized: Admin access only');
                }
                return Promise.resolve();
            });
    },

    logout: () => {
        return fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }),
            credentials: 'include',
        })
            .then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return Promise.resolve();
            })
            .catch(() => {
                // Even if the API call fails, clear the local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return Promise.resolve();
            });
    },

    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return Promise.reject({ message: 'Unauthorized or session expired' });
        }
        return Promise.resolve();
    },

    checkAuth: () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token) return Promise.reject({ message: 'Authentication required' });
        if (user.role !== 'admin') return Promise.reject({ message: 'Admin access required' });
        
        // Optional: Verify token with backend
        return fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${token}`,
            }),
            credentials: 'include',
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('User authentication failed');
                }
                return Promise.resolve();
            })
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return Promise.reject({ message: 'Authentication required' });
            });
    },

    getIdentity: () => {
        const persistedUser = localStorage.getItem('user');
        if (!persistedUser) return Promise.reject('User not found');
        
        const user = JSON.parse(persistedUser);
        return Promise.resolve({
            id: user.id,
            fullName: user.fullName,
            avatar: undefined,
            email: user.email,
        });
    },

    getPermissions: () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return Promise.resolve(user.role);
    }
};

export default authProvider;

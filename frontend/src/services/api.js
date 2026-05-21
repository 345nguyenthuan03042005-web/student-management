import axios from 'axios';

const API_BASE_URL = "https://student-management-api-t1sl.onrender.com";

// ================== AXIOS CLIENT ==================
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================== INTERCEPTOR ==================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    console.log(" REQUEST:", config.url);
    console.log(" TOKEN:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(" RESPONSE:", response.config.url);
    return response;
  },
  (error) => {
    console.log(" ERROR:", error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ================== AUTH SERVICE ==================
export const AuthService = {
  login: (credentials) => {
    return apiClient.post('/api/v1/auth/login', credentials);
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};

// ================== STUDENT SERVICE ==================
export const StudentService = {
  getStudents: (params = {}) =>
    apiClient.get('/api/v1/students', { params }),

  getStudent: (id) =>
    apiClient.get(`/api/v1/students/${id}`),

  createStudent: (data) =>
    apiClient.post('/api/v1/students', data),

  updateStudent: (id, data) =>
    apiClient.put(`/api/v1/students/${id}`, data),

  deleteStudent: (id) =>
    apiClient.delete(`/api/v1/students/${id}`)
};

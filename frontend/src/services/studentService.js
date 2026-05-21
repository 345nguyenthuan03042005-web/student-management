import axios from 'axios';

// ================== AXIOS CLIENT ==================
const apiClient = axios.create({
  baseURL: "https://student-management-api-t1sl.onrender.com",
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================== INTERCEPTOR ==================
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ================== AUTH ==================
export const AuthService = {
  login: (credentials) =>
    apiClient.post('/api/v1/auth/login', credentials),

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () =>
    !!localStorage.getItem('access_token'),
};

// ================== STUDENT ==================
export const StudentService = {
  getAll: (params = {}) =>
    apiClient.get('/api/v1/students', { params }),

  getById: (id) =>
    apiClient.get(`/api/v1/students/${id}`),

  create: (data) =>
    apiClient.post('/api/v1/students', data),

  update: (id, data) =>
    apiClient.put(`/api/v1/students/${id}`, data),

  delete: (id) =>
    apiClient.delete(`/api/v1/students/${id}`),

  bulkDelete: (ids) =>
    apiClient.post('/api/v1/students/bulk-delete', {
      student_ids: ids
    }),
};

// ================== CLASS ==================
export const ClassService = {
  getAll: (params = {}) =>
    apiClient.get('/api/v1/classes', { params }),

  getById: (id) =>
    apiClient.get(`/api/v1/classes/${id}`),

  create: (data) =>
    apiClient.post('/api/v1/classes', data),

  update: (id, data) =>
    apiClient.put(`/api/v1/classes/${id}`, data),

  delete: (id) =>
    apiClient.delete(`/api/v1/classes/${id}`),
};

// ================== SUBJECT ==================
export const SubjectService = {
  getAll: (params = {}) =>
    apiClient.get('/api/v1/subjects', { params }),

  getById: (id) =>
    apiClient.get(`/api/v1/subjects/${id}`),

  create: (data) =>
    apiClient.post('/api/v1/subjects', data),

  update: (id, data) =>
    apiClient.put(`/api/v1/subjects/${id}`, data),

  delete: (id) =>
    apiClient.delete(`/api/v1/subjects/${id}`),
};

// ================== TERM ==================
export const AcademicTermService = {
  getAll: (params = {}) =>
    apiClient.get('/api/v1/terms', { params }),

  getById: (id) =>
    apiClient.get(`/api/v1/terms/${id}`),

  create: (data) =>
    apiClient.post('/api/v1/terms', data),

  update: (id, data) =>
    apiClient.put(`/api/v1/terms/${id}`, data),

  delete: (id) =>
    apiClient.delete(`/api/v1/terms/${id}`),
};

// ================== ROOM ==================
export const RoomService = {
  getAll: (params = {}) =>
    apiClient.get('/api/v1/rooms', { params }),

  getById: (id) =>
    apiClient.get(`/api/v1/rooms/${id}`),

  create: (data) =>
    apiClient.post('/api/v1/rooms', data),

  update: (id, data) =>
    apiClient.put(`/api/v1/rooms/${id}`, data),

  delete: (id) =>
    apiClient.delete(`/api/v1/rooms/${id}`),
};

// ================== SCORE ==================
export const ScoreService = {
  getAll: (params = {}) =>
    apiClient.get('/api/v1/scores', { params }),

  getById: (id) =>
    apiClient.get(`/api/v1/scores/${id}`),

  create: (data) =>
    apiClient.post('/api/v1/scores', data),

  update: (id, data) =>
    apiClient.put(`/api/v1/scores/${id}`, data),

  delete: (id) =>
    apiClient.delete(`/api/v1/scores/${id}`),
};

import axios from 'axios';

const API_BASE_URL = "https://student-management-api-t1sl.onrender.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    console.log(" REQUEST:", config.url);
    console.log(" TOKEN:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(" HEADERS:", config.headers);

    return config;
  },
  (error) => {
    console.log(" REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(" RESPONSE:", response.config.url);
    console.log(" DATA:", response.data);

    return response;
  },
  (error) => {
    console.log(" ERROR URL:", error.config?.url);
    console.log(" ERROR STATUS:", error.response?.status);
    console.log(" ERROR DATA:", error.response?.data);

    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;

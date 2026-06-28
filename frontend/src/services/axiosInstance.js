import axios from 'axios';

const axiosInstance = axios.create({
  // 🎯 Vercel Environment Variables-ஐ முறியடிக்க நேரடியாக இங்கே AWS IP-யைக் கொடுத்துள்ளோம்:
  baseURL: 'http://54.173.84.181:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('patient_token') || localStorage.getItem('doctor_token') || localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        
        localStorage.removeItem('patient_token');
        localStorage.removeItem('patient_data');
        localStorage.removeItem('doctor_token');
        localStorage.removeItem('doctor_data');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
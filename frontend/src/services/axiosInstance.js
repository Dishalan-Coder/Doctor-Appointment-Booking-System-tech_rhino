/**
 * Axios 实例配置，自动附加 JWT token
 */
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// 请求拦截器：自动附加 token
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

// 响应拦截器：统一错误处理
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Token 过期或无效，清除本地存储
        localStorage.removeItem('patient_token');
        localStorage.removeItem('patient_data');
        localStorage.removeItem('doctor_token');
        localStorage.removeItem('doctor_data');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        // 避免在登录页循环跳转
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
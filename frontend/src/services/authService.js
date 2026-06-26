/**
 * 认证相关 API 服务
 */
import axiosInstance from './axiosInstance';

/** 患者注册 */
export function registerPatient(data) {
  return axiosInstance.post('/auth/register', data);
}

/** 患者登录 */
export function loginPatient(data) {
  return axiosInstance.post('/auth/login', data);
}

/** 管理员登录 */
export function loginAdmin(email, password) {
  return axiosInstance.post('/auth/admin-login', null, {
    params: { email, password }
  });
}

/** 医生注册 */
export function registerDoctor(data) {
  return axiosInstance.post('/auth/doctor-register', data);
}

/** 医生登录 */
export function loginDoctor(data) {
  return axiosInstance.post('/auth/doctor-login', data);
}
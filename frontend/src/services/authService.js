
import axiosInstance from './axiosInstance';


export function registerPatient(data) {
  return axiosInstance.post('/auth/register', data);
}


export function loginPatient(data) {
  return axiosInstance.post('/auth/login', data);
}

export function loginAdmin(email, password) {
  return axiosInstance.post('/auth/admin-login', null, {
    params: { email, password }
  });
}

export function registerDoctor(data) {
  return axiosInstance.post('/auth/doctor-register', data);
}

export function loginDoctor(data) {
  return axiosInstance.post('/auth/doctor-login', data);
}

import axiosInstance from './axiosInstance';

export function getDoctors(params = {}) {
  return axiosInstance.get('/doctors/', { params });
}

export function getDoctorById(id) {
  return axiosInstance.get(`/doctors/${id}`);
}

export function createDoctor(data) {
  return axiosInstance.post('/doctors/', data);
}

export function updateDoctor(id, data) {
  return axiosInstance.put(`/doctors/${id}`, data);
}

export function deleteDoctor(id) {
  return axiosInstance.delete(`/doctors/${id}`);
}
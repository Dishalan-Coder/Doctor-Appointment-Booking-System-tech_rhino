import axiosInstance from './axiosInstance';


export function getDepartments() {
  return axiosInstance.get('/departments/');
}

export function getDepartmentById(id) {
  return axiosInstance.get(`/departments/${id}`);
}

export function createDepartment(data) {
  return axiosInstance.post('/departments/', data);
}

export function updateDepartment(id, data) {
  return axiosInstance.put(`/departments/${id}`, data);
}

export function deleteDepartment(id) {
  return axiosInstance.delete(`/departments/${id}`);
}
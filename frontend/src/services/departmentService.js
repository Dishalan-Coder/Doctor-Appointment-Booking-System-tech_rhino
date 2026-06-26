/**
 * 科室相关 API 服务
 */
import axiosInstance from './axiosInstance';

/** 获取科室列表 */
export function getDepartments() {
  return axiosInstance.get('/departments/');
}

/** 获取单个科室 */
export function getDepartmentById(id) {
  return axiosInstance.get(`/departments/${id}`);
}

/** 管理员：创建科室 */
export function createDepartment(data) {
  return axiosInstance.post('/departments/', data);
}

/** 管理员：更新科室 */
export function updateDepartment(id, data) {
  return axiosInstance.put(`/departments/${id}`, data);
}

/** 管理员：删除科室 */
export function deleteDepartment(id) {
  return axiosInstance.delete(`/departments/${id}`);
}
/**
 * 医生相关 API 服务
 */
import axiosInstance from './axiosInstance';

/** 获取医生列表 */
export function getDoctors(params = {}) {
  return axiosInstance.get('/doctors/', { params });
}

/** 获取单个医生详情 */
export function getDoctorById(id) {
  return axiosInstance.get(`/doctors/${id}`);
}

/** 管理员：创建医生 */
export function createDoctor(data) {
  return axiosInstance.post('/doctors/', data);
}

/** 管理员：更新医生 */
export function updateDoctor(id, data) {
  return axiosInstance.put(`/doctors/${id}`, data);
}

/** 管理员：删除医生（软删除） */
export function deleteDoctor(id) {
  return axiosInstance.delete(`/doctors/${id}`);
}
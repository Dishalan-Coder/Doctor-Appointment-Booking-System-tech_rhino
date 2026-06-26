/**
 * 预约相关 API 服务
 */
import axiosInstance from './axiosInstance';

/** 获取医生可用时间段 */
export function getAvailableSlots(doctorId, date) {
  return axiosInstance.get('/appointments/slots', {
    params: { doctor_id: doctorId, appointment_date: date }
  });
}

/** 患者创建预约 */
export function createAppointment(data) {
  return axiosInstance.post('/appointments/', data);
}

/** 获取我的预约列表 */
export function getMyAppointments(status = null) {
  const params = {};
  if (status) params.status = status;
  return axiosInstance.get('/appointments/my', { params });
}

/** 患者取消预约 */
export function cancelAppointment(id) {
  return axiosInstance.delete(`/appointments/${id}`);
}

/** 管理员：获取所有预约 */
export function getAllAppointments(params = {}) {
  return axiosInstance.get('/appointments/', { params });
}

/** 管理员：更新预约状态 */
export function updateAppointmentStatus(id, data) {
  return axiosInstance.put(`/appointments/${id}`, data);
}

/** 医生：获取自己的预约列表 */
export function getDoctorAppointments(status = null) {
  const params = {};
  if (status) params.status = status;
  return axiosInstance.get('/appointments/doctor/my', { params });
}

/** 医生：更新预约状态（批准/拒绝） */
export function updateDoctorAppointmentStatus(id, data) {
  return axiosInstance.put(`/appointments/doctor/${id}`, data);
}
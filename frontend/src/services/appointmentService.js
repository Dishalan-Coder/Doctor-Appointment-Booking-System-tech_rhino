
import axiosInstance from './axiosInstance';

export function getAvailableSlots(doctorId, date) {
  return axiosInstance.get('/appointments/slots', {
    params: { doctor_id: doctorId, appointment_date: date }
  });
}

export function createAppointment(data) {
  return axiosInstance.post('/appointments/', data);
}

export function getMyAppointments(status = null) {
  const params = {};
  if (status) params.status = status;
  return axiosInstance.get('/appointments/my', { params });
}

export function cancelAppointment(id) {
  return axiosInstance.delete(`/appointments/${id}`);
}

export function getAllAppointments(params = {}) {
  return axiosInstance.get('/appointments/', { params });
}

export function updateAppointmentStatus(id, data) {
  return axiosInstance.put(`/appointments/${id}`, data);
}

export function getDoctorAppointments(status = null) {
  const params = {};
  if (status) params.status = status;
  return axiosInstance.get('/appointments/doctor/my', { params });
}

export function updateDoctorAppointmentStatus(id, data) {
  return axiosInstance.put(`/appointments/doctor/${id}`, data);
}
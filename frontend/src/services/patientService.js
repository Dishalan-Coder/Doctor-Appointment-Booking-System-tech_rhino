
import axiosInstance from './axiosInstance';

export function getAllPatients(params = {}) {
  return axiosInstance.get('/patients/', { params });
}

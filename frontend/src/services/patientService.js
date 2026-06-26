/**
 * 患者相关 API 服务
 */
import axiosInstance from './axiosInstance';

/** 管理员：获取患者列表 */
export function getAllPatients(params = {}) {
  return axiosInstance.get('/patients/', { params });
}

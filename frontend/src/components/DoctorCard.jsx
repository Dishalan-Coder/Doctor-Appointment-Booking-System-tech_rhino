/**
 * 医生卡片组件 - 列表页使用
 */
import { Link } from 'react-router-dom';
import { MapPin, Clock, Award, Briefcase } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  return (
    <Link to={`/doctors/${doctor.id}`} className="card p-5 flex flex-col h-full group">
      {/* 头像区域 */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shrink-0 group-hover:from-primary-200 group-hover:to-primary-300 transition-all">
          <span className="text-2xl font-display font-bold text-primary-700">
            {doctor.name.replace('Dr. ', '').charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-700 transition-colors">
            {doctor.name}
          </h3>
          <p className="text-sm text-primary-600 font-medium">{doctor.specialization || 'General Physician'}</p>
          <p className="text-xs text-gray-400 mt-0.5">{doctor.qualification}</p>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="space-y-2 flex-1">
        {doctor.department_name && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {doctor.department_name}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
          {doctor.experience_years} years experience
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          {doctor.available_days}
        </div>
      </div>

      {/* 底部 */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          {doctor.status}
        </span>
        <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
          View Profile &rarr;
        </span>
      </div>
    </Link>
  );
}
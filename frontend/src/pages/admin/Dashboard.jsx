/**
 * 管理端仪表盘
 */
import { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { getAllAppointments } from '../../services/appointmentService';
import { formatDateShort, formatTime } from '../../utils/formatDate';
import { STATUS_COLORS } from '../../utils/constants';
import {
  Users, UserCog, Building2, CalendarCheck,
  Clock, TrendingUp, ArrowUpRight
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => {});

    getAllAppointments({ limit: 5 })
      .then(res => setRecentAppointments(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { key: 'total_patients', label: 'Total Patients', icon: Users, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
    { key: 'total_doctors', label: 'Active Doctors', icon: UserCog, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { key: 'total_departments', label: 'Departments', icon: Building2, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600' },
    { key: 'total_appointments', label: 'Total Appointments', icon: CalendarCheck, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your hospital management system</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <div key={card.key} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '-' : (stats?.[card.key] ?? 0)}
                </p>
              </div>
              <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.text}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 待处理和今日预约 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '-' : (stats?.pending_appointments ?? 0)}</p>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: stats?.total_appointments ? `${(stats.pending_appointments / stats.total_appointments) * 100}%` : '0%' }}
            />
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today&apos;s Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '-' : (stats?.today_appointments ?? 0)}</p>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: stats?.total_appointments ? `${(stats.today_appointments / stats.total_appointments) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* 最近预约 */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
          <a href="/admin/appointments" className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recentAppointments.length > 0 ? (
          <div className="space-y-2">
            {recentAppointments.map(apt => (
              <div key={apt.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-sm font-bold text-primary-700 shrink-0">
                  #{apt.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {apt.patient_name} &rarr; {apt.doctor_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateShort(apt.appointment_date)} at {formatTime(apt.time_slot)}
                  </p>
                </div>
                <span className={STATUS_COLORS[apt.status] || 'badge bg-gray-100 text-gray-600'}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No appointments yet.</p>
        )}
      </div>
    </div>
  );
}
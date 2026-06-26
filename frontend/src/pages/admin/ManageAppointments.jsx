/**
 * 管理端 - 预约管理
 */
import { useState, useEffect } from 'react';
import { getAllAppointments, updateAppointmentStatus } from '../../services/appointmentService';
import AppointmentTable from '../../components/AppointmentTable';
import { CalendarCheck } from 'lucide-react';

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAppointments = () => {
    setLoading(true);
    const params = { limit: 50 };
    if (statusFilter) params.status = statusFilter;
    getAllAppointments(params)
      .then(res => setAppointments(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAppointmentStatus(id, { status });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update appointment.');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 mt-1">Review and manage patient appointments</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input !w-auto !py-2"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="card p-5">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-50 animate-pulse" />
            Loading appointments...
          </div>
        ) : (
          <AppointmentTable
            appointments={appointments}
            showPatient
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}

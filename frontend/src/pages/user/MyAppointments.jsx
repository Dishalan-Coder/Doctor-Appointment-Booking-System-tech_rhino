/**
 * 我的预约列表页
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyAppointments, cancelAppointment } from '../../services/appointmentService';
import AppointmentTable from '../../components/AppointmentTable';
import { CalendarCheck, Filter } from 'lucide-react';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAppointments = () => {
    setLoading(true);
    getMyAppointments(statusFilter || null)
      .then(res => setAppointments(res.data || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to cancel appointment.');
    }
  };

  return (
    <div className="page-container">
      {/* 标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="page-title">My Appointments</h1>
            <p className="text-gray-500 text-sm">View and manage your booked appointments</p>
          </div>
        </div>
        <Link to="/doctors" className="btn-primary text-sm !py-2.5 shrink-0">
          Book New Appointment
        </Link>
      </div>

      {/* 筛选栏 */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 font-medium">Filter:</span>
          <div className="flex flex-wrap gap-2">
            {['', 'Pending', 'Approved', 'Cancelled', 'Completed'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 预约表格 */}
      <div className="card p-4">
        {loading ? (
          <div className="py-12 text-center text-gray-400">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading appointments...</p>
          </div>
        ) : (
          <AppointmentTable
            appointments={appointments}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
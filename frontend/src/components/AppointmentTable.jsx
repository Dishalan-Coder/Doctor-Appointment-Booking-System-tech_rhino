/**
 * 预约表格组件 - 管理端和用户端通用
 */
import { formatDateShort, formatTime } from '../utils/formatDate';
import { STATUS_COLORS } from '../utils/constants';
import { Eye, Check, X, Clock } from 'lucide-react';

export default function AppointmentTable({
  appointments,
  showPatient = false,
  onStatusChange,
  onCancel,
  onView
}) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium">No appointments found</p>
        <p className="text-sm mt-1">Appointments will appear here once booked.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
            {showPatient && (
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
            )}
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {appointments.map((apt) => (
            <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 text-sm font-mono text-gray-500">#{apt.id}</td>
              {showPatient && (
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{apt.patient_name}</td>
              )}
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{apt.doctor_name}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{apt.department_name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDateShort(apt.appointment_date)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatTime(apt.time_slot)}</td>
              <td className="px-4 py-3">
                <span className={STATUS_COLORS[apt.status] || 'badge bg-gray-100 text-gray-600'}>
                  {apt.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  {onView && (
                    <button
                      onClick={() => onView(apt)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {onStatusChange && (apt.status === 'Pending' || apt.status === 'Approved') && (
                    <>
                      <button
                        onClick={() => onStatusChange(apt.id, 'Approved')}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onStatusChange(apt.id, 'Cancelled')}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {onCancel && (apt.status === 'Pending' || apt.status === 'Approved') && (
                    <button
                      onClick={() => onCancel(apt.id)}
                      className="btn-danger !py-1.5 !px-3"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
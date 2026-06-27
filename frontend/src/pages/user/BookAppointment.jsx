
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getDoctorById } from '../../services/doctorService';
import { getDepartmentById } from '../../services/departmentService';
import { createAppointment } from '../../services/appointmentService';
import { formatTime, formatDate } from '../../utils/formatDate';
import { AlertCircle, CalendarCheck, CheckCircle, ArrowLeft } from 'lucide-react';

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [department, setDepartment] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const doctorId = searchParams.get('doctor');
  const deptId = searchParams.get('dept');
  const date = searchParams.get('date');
  const slot = searchParams.get('slot');

  useEffect(() => {
    if (!doctorId || !date || !slot) {
      navigate('/doctors');
      return;
    }
    getDoctorById(doctorId).then(res => setDoctor(res.data)).catch(() => {});
    if (deptId) {
      getDepartmentById(deptId).then(res => setDepartment(res.data)).catch(() => {});
    }
  }, [doctorId, deptId, date, slot, navigate]);

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await createAppointment({
        doctor_id: Number(doctorId),
        department_id: Number(deptId),
        appointment_date: date,
        time_slot: slot,
        reason: reason || undefined
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to book appointment. The slot may have been taken.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Appointment Booked!</h1>
          <p className="text-gray-500 mb-6">
            Your appointment request has been submitted. You can check the status in your appointments page.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => navigate('/my-appointments')} className="btn-primary">
              <CalendarCheck className="w-4 h-4" /> View Appointments
            </button>
            <button onClick={() => navigate('/doctors')} className="btn-secondary">
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="page-title mb-8">Book Appointment</h1>

      {error && (
        <div className="flex items-start gap-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-primary-700">
                {doctor?.name?.replace('Dr. ', '').charAt(0) || '?'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{doctor?.name || 'Loading...'}</p>
              <p className="text-sm text-gray-500">{doctor?.specialization || ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Department</p>
              <p className="text-sm font-medium text-gray-800">{department?.name || '-'}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Date</p>
              <p className="text-sm font-medium text-gray-800">{formatDate(date)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Time Slot</p>
              <p className="text-sm font-medium text-gray-800">{formatTime(slot)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <span className="badge-pending">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Reason for Visit (Optional)</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Briefly describe your symptoms or reason for visit..."
          rows={3}
          className="form-input resize-none"
        />
      </div>

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="btn-primary w-full text-base !py-4"
      >
        {loading ? (
          <><span className="spinner" /> Booking...</>
        ) : (
          'Confirm Appointment'
        )}
      </button>
    </div>
  );
}
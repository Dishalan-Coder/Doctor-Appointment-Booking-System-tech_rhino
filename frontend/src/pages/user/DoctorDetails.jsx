/**
 * 医生详情页
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDoctorById } from '../../services/doctorService';
import { getAvailableSlots } from '../../services/appointmentService';
import { formatTime, getMinDate, getMaxDate } from '../../utils/formatDate';
import {
  ArrowLeft, MapPin, Clock, Award, Briefcase,
  Calendar, CheckCircle2
} from 'lucide-react';

export default function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDoctorById(id)
      .then(res => setDoctor(res.data))
      .catch(() => setDoctor(null))
      .finally(() => setLoading(false));
  }, [id]);

  // 当日期改变时获取可用时间段
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    getAvailableSlots(id, selectedDate)
      .then(res => setSlots(res.data || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [id, selectedDate]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="card p-8 animate-pulse">
          <div className="flex items-start gap-6">
            <div className="w-28 h-28 bg-gray-200 rounded-2xl" />
            <div className="flex-1">
              <div className="h-7 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="page-container text-center py-16">
        <p className="text-gray-500 text-lg">Doctor not found.</p>
        <Link to="/doctors" className="text-primary-600 font-semibold mt-2 inline-block">
          &larr; Back to Doctors
        </Link>
      </div>
    );
  }

  const availableDays = doctor.available_days ? doctor.available_days.split(',') : [];

  return (
    <div className="page-container">
      {/* 返回链接 */}
      <Link to="/doctors" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Doctors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：医生信息 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shrink-0">
                <span className="text-4xl font-display font-bold text-primary-700">
                  {doctor.name.replace('Dr. ', '').charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold text-gray-900">{doctor.name}</h1>
                <p className="text-primary-600 font-medium mt-1">{doctor.specialization || 'General Physician'}</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <Award className="w-4 h-4 text-gray-400" /> {doctor.qualification}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <Briefcase className="w-4 h-4 text-gray-400" /> {doctor.experience_years} yrs experience
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-400" /> {doctor.department_name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{doctor.bio || 'No bio available.'}</p>
          </div>

          {/* 可用时间 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" /> Availability
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
                <span
                  key={day}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    availableDays.includes(day)
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'bg-gray-50 text-gray-400 border border-gray-100 line-through'
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Time: {formatTime(doctor.available_from)} - {formatTime(doctor.available_to)}
            </p>
          </div>
        </div>

        {/* 右侧：预约面板 */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" /> Book Appointment
            </h2>

            {/* 日期选择 */}
            <div className="mb-4">
              <label className="form-label">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="form-input text-sm"
              />
            </div>

            {/* 可用时间段 */}
            {selectedDate && (
              <div className="mb-4">
                <label className="form-label">Available Time Slots</label>
                {slotsLoading ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : slots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                    {slots.map(slot => (
                      <Link
                        key={slot}
                        to={`/book-appointment?doctor=${id}&dept=${doctor.department_id}&date=${selectedDate}&slot=${slot}`}
                        className="text-center py-2.5 px-2 text-sm font-medium text-primary-700 bg-primary-50
                                 border border-primary-200 rounded-lg hover:bg-primary-100 hover:border-primary-300 transition-all"
                      >
                        {formatTime(slot)}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No slots available on this date</p>
                    <p className="text-xs mt-1">Try selecting a different date</p>
                  </div>
                )}
              </div>
            )}

            {!selectedDate && (
              <p className="text-sm text-gray-400 text-center py-8">
                Select a date to view available time slots
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
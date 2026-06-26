/**
 * 医生仪表板
 */
import { useAuth } from '../../hooks/useAuth';
import { Calendar, Users, Clock, Stethoscope } from 'lucide-react';

export default function DoctorDashboard() {
  const { doctor, logoutDoctor } = useAuth();

  const handleLogout = () => {
    logoutDoctor();
    window.location.href = '/doctor/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Doctor Portal</h1>
                <p className="text-sm text-gray-500">Welcome, {doctor?.name || 'Doctor'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500">Today's Appointments</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500">Total Patients</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{doctor?.experience_years || 0}</p>
                <p className="text-sm text-gray-500">Years Experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{doctor?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{doctor?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{doctor?.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Specialization</p>
              <p className="font-medium text-gray-900">{doctor?.specialization || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Qualification</p>
              <p className="font-medium text-gray-900">{doctor?.qualification || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department ID</p>
              <p className="font-medium text-gray-900">{doctor?.department_id || 'N/A'}</p>
            </div>
          </div>
          {doctor?.bio && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Bio</p>
              <p className="font-medium text-gray-900">{doctor.bio}</p>
            </div>
          )}
        </div>

        {/* Coming Soon */}
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-teal-50 rounded-xl p-6 border border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">More Features Coming Soon</h3>
          <p className="text-gray-600">We're working on adding appointment management, patient history, and more features for doctors.</p>
        </div>
      </main>
    </div>
  );
}

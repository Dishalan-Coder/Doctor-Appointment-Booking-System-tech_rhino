/**
 * 顶部导航栏 - 用户端
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Stethoscope, Menu, X, User, LogOut,
  CalendarCheck, Home, Building2
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { isPatientLoggedIn, patient, logoutPatient } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutPatient();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center
                          group-hover:bg-primary-700 transition-colors">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gray-900">
              Med<span className="text-primary-600">Book</span>
            </span>
          </Link>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
              Home
            </Link>
            <Link to="/departments" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
              Departments
            </Link>
            <Link to="/doctors" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
              Doctors
            </Link>
          </div>

          {/* 桌面端用户菜单 */}
          <div className="hidden md:flex items-center gap-3">
            {isPatientLoggedIn ? (
              <>
                <Link to="/my-appointments" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                  <CalendarCheck className="w-4 h-4" />
                  My Appointments
                </Link>
                <div className="w-px h-6 bg-gray-200" />
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {patient?.name?.charAt(0) || 'U'}
                  </div>
                  {patient?.name?.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50 rounded-lg transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-4">
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in-up">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/departments" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg">
              <Building2 className="w-4 h-4" /> Departments
            </Link>
            <Link to="/doctors" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg">
              <User className="w-4 h-4" /> Doctors
            </Link>

            {isPatientLoggedIn ? (
              <>
                <div className="border-t border-gray-100 my-2" />
                <Link to="/my-appointments" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg">
                  <CalendarCheck className="w-4 h-4" /> My Appointments
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-100 my-2" />
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-semibold text-primary-600 text-center">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block btn-primary text-sm text-center">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
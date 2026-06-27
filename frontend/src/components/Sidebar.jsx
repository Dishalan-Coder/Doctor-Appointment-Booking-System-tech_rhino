
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ADMIN_MENU } from '../utils/constants';
import {
  Stethoscope, LogOut, LayoutDashboard,
  Building2, UserCog, CalendarCheck, Users
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, Building2, UserCog, CalendarCheck, Users
};

export default function Sidebar() {
  const location = useLocation();
  const { admin, logoutAdmin } = useAuth();

  const handleLogout = () => {
    logoutAdmin();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col shrink-0">
      
      <div className="px-6 py-5 border-b border-gray-100">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-display font-bold text-gray-900">
            Med<span className="text-primary-600">Book</span>
          </span>
        </Link>
        <p className="text-xs text-gray-400 mt-1 ml-11">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {ADMIN_MENU.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{admin?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
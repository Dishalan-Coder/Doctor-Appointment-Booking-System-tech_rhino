/**
 * 简单的认证页面导航栏 - 用于登录/注册页面
 */
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function AuthNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-gray-900">
              Med<span className="text-primary-600">Book</span>
            </span>
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </nav>
  );
}

/**
 * 管理员登录页
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import AuthNavbar from '../../components/AuthNavbar';

export default function AdminLogin() {
  const { loginAsAdmin, isAdminLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: 'admin@hospital.com', password: 'admin123' });

  if (isAdminLoggedIn) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await loginAdmin(form.email, form.password);
      loginAsAdmin(res.data.token, res.data.admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AuthNavbar />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
            <ShieldCheck className="w-8 h-8 text-primary-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 mt-1">Sign in to access the admin dashboard</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent !pr-10"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><span className="spinner" /> Signing In...</> : 'Sign In to Admin'}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Default: admin@hospital.com / admin123
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
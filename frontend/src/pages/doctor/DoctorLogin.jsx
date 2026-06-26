/**
 * 医生登录页
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginDoctor } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { Stethoscope, Eye, EyeOff, AlertCircle } from 'lucide-react';
import AuthNavbar from '../../components/AuthNavbar';

export default function DoctorLogin() {
  const { loginAsDoctor, isDoctorLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  if (isDoctorLoggedIn) {
    navigate('/doctor/dashboard');
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
      const res = await loginDoctor(form);
      loginAsDoctor(res.data.token, res.data.doctor);
      navigate('/doctor/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid doctor credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AuthNavbar />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-teal-50 px-4 py-12">
        <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-7 h-7 text-primary-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Doctor Portal</h1>
          <p className="text-gray-500 mt-1">Sign in to access your dashboard</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="doctor@example.com"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input !pr-10"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="btn-primary w-full !mt-6"
            >
              {loading ? <><span className="spinner" /> Signing In...</> : 'Sign In as Doctor'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <a href="/doctor/register" className="text-primary-600 font-semibold hover:text-primary-700">
            Register
          </a>
        </p>
        </div>
      </div>
    </div>
  );
}

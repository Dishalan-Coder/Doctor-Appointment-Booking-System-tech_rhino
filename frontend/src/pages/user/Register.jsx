
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerPatient } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { GENDERS } from '../../utils/constants';
import { UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Register() {
  const { loginAsPatient } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', gender: '', date_of_birth: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await registerPatient(form);
      loginAsPatient(res.data.token, res.data.patient);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-teal-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-7 h-7 text-primary-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Join MedBook to book appointments easily</p>
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
              <label className="form-label">Full Name *</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="John Doe"
                className="form-input" required
              />
            </div>
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="john@example.com"
                className="form-input" required
              />
            </div>
            <div>
              <label className="form-label">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="form-input !pr-10" required
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="tel" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="+1 555 0000"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="form-input">
                  <option value="">Select</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Date of Birth</label>
              <input
                type="date" name="date_of_birth"
                value={form.date_of_birth} onChange={handleChange}
                className="form-input"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !mt-6">
              {loading ? <><span className="spinner" /> Creating Account...</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
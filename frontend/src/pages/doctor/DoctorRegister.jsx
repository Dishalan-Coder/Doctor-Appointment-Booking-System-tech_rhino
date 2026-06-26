/**
 * 医生注册页
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerDoctor } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { getDepartments } from '../../services/departmentService';
import { UserPlus, Eye, EyeOff, AlertCircle, Stethoscope } from 'lucide-react';
import AuthNavbar from '../../components/AuthNavbar';

export default function DoctorRegister() {
  const { loginAsDoctor } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department_id: '',
    specialization: '',
    qualification: '',
    experience_years: '',
    bio: ''
  });

  useEffect(() => {
    getDepartments().then(res => setDepartments(res.data || []));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.department_id) {
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
      const res = await registerDoctor({
        ...form,
        department_id: parseInt(form.department_id),
        experience_years: parseInt(form.experience_years) || 0
      });
      loginAsDoctor(res.data.token, res.data.doctor);
      navigate('/doctor/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AuthNavbar />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-teal-50 px-4 py-12">
        <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-7 h-7 text-primary-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Doctor Registration</h1>
          <p className="text-gray-500 mt-1">Join our medical team</p>
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
                onChange={handleChange} placeholder="Dr. John Doe"
                className="form-input" required
              />
            </div>
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="doctor@example.com"
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
                <label className="form-label">Department *</label>
                <select name="department_id" value={form.department_id} onChange={handleChange} className="form-input" required>
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Specialization</label>
              <input
                type="text" name="specialization" value={form.specialization}
                onChange={handleChange} placeholder="e.g., Cardiology, Neurology"
                className="form-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Qualification</label>
                <input
                  type="text" name="qualification" value={form.qualification}
                  onChange={handleChange} placeholder="MBBS, MD, etc."
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Experience (Years)</label>
                <input
                  type="number" name="experience_years" value={form.experience_years}
                  onChange={handleChange} placeholder="0"
                  className="form-input"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Bio</label>
              <textarea
                name="bio" value={form.bio}
                onChange={handleChange} placeholder="Tell us about yourself..."
                className="form-input" rows="3"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !mt-6">
              {loading ? <><span className="spinner" /> Creating Account...</> : 'Register as Doctor'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/doctor/login" className="text-primary-600 font-semibold hover:text-primary-700">
            Sign In
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}

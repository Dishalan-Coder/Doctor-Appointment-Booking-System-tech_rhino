
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../services/axiosInstance';
import { GENDERS } from '../../utils/constants';
import { User, Save, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { patient, loginAsPatient } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', gender: '', date_of_birth: ''
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name || '',
        phone: patient.phone || '',
        gender: patient.gender || '',
        date_of_birth: patient.date_of_birth || ''
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.put('/patients/me', form);
      loginAsPatient(
        localStorage.getItem('patient_token'),
        res.data
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-primary-600" />
        </div>
        <h1 className="page-title">My Profile</h1>
      </div>

      <div className="card p-6">
        
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-display font-bold text-primary-700">
              {patient?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{patient?.name}</h2>
            <p className="text-sm text-gray-500">{patient?.email}</p>
            <p className="text-xs text-gray-400 mt-0.5">Member since {patient?.created_at?.split('T')[0]}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text" name="name" value={form.name}
              onChange={handleChange} className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Email (cannot change)</label>
            <input
              type="email" value={patient?.email || ''}
              className="form-input bg-gray-100 !cursor-not-allowed" disabled
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Phone</label>
              <input
                type="tel" name="phone" value={form.phone}
                onChange={handleChange} className="form-input"
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

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <><span className="spinner" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium animate-fade-in-up">
                <CheckCircle className="w-4 h-4" /> Profile updated!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
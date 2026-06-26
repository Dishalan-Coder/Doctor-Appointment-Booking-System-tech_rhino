/**
 * 管理端 - 医生管理
 */
import { useState, useEffect } from 'react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../services/doctorService';
import { getDepartments } from '../../services/departmentService';
import { UserCog, Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  department_id: '',
  specialization: '',
  qualification: '',
  experience_years: 0,
  bio: '',
  available_days: 'Mon,Tue,Wed,Thu,Fri',
  available_from: '09:00',
  available_to: '17:00',
};

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchDoctors = () => {
    setLoading(true);
    getDoctors({ status: 'Active', limit: 100 })
      .then(res => setDoctors(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDoctors();
    getDepartments().then(res => setDepartments(res.data || [])).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...defaultForm, department_id: departments[0]?.id || '' });
    setShowForm(true);
  };

  const openEdit = (doctor) => {
    setEditing(doctor.id);
    setForm({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone || '',
      department_id: doctor.department_id,
      specialization: doctor.specialization || '',
      qualification: doctor.qualification || '',
      experience_years: doctor.experience_years || 0,
      bio: doctor.bio || '',
      available_days: doctor.available_days || 'Mon,Tue,Wed,Thu,Fri',
      available_from: doctor.available_from || '09:00',
      available_to: doctor.available_to || '17:00',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.department_id) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        department_id: Number(form.department_id),
        experience_years: Number(form.experience_years) || 0,
      };
      if (editing) {
        await updateDoctor(editing, payload);
      } else {
        await createDoctor(payload);
      }
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save doctor.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this doctor?')) return;
    try {
      await deleteDoctor(id);
      fetchDoctors();
    } catch {
      alert('Failed to deactivate doctor.');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-500 mt-1">Manage hospital doctors</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 animate-fade-in-up border-2 border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editing ? 'Edit Doctor' : 'New Doctor'}
            </h2>
            <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" required />
            </div>
            <div>
              <label className="form-label">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" required />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Department *</label>
              <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} className="form-input" required>
                <option value="">Select department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Specialization</label>
              <input type="text" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Qualification</label>
              <input type="text" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Experience (years)</label>
              <input type="number" min="0" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Available Days</label>
              <input type="text" value={form.available_days} onChange={(e) => setForm({ ...form, available_days: e.target.value })} className="form-input" placeholder="Mon,Tue,Wed" />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="form-input resize-none" rows={2} />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary text-sm">
                {saving ? <><span className="spinner" /> Saving...</> : <><Check className="w-4 h-4" /> Save</>}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading doctors...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Specialization</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {doctors.map(doctor => (
                <tr key={doctor.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-800">{doctor.name}</p>
                    <p className="text-xs text-gray-400">{doctor.email}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{doctor.department_name}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{doctor.specialization}</td>
                  <td className="px-5 py-3">
                    <span className={doctor.status === 'Active' ? 'badge-approved' : 'badge-cancelled'}>
                      {doctor.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => openEdit(doctor)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(doctor.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Deactivate">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

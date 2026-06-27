
import { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../services/departmentService';
import { Building2, Plus, Pencil, Trash2, X, Check } from 'lucide-react';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: 'stethoscope' });
  const [saving, setSaving] = useState(false);

  const icons = ['stethoscope', 'heart', 'brain', 'bone', 'baby', 'scan', 'eye', 'ear', 'ribbon', 'smile'];

  const fetchDepartments = () => {
    setLoading(true);
    getDepartments().then(res => setDepartments(res.data || []))
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDepartments(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', icon: 'stethoscope' });
    setShowForm(true);
  };

  const openEdit = (dept) => {
    setEditing(dept.id);
    setForm({ name: dept.name, description: dept.description || '', icon: dept.icon || 'stethoscope' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await updateDepartment(editing, form);
      } else {
        await createDepartment(form);
      }
      setShowForm(false);
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save department.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this department?')) return;
    try {
      await deleteDepartment(id);
      fetchDepartments();
    } catch (err) {
      alert('Failed to deactivate department.');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500 mt-1">Manage hospital departments</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 animate-fade-in-up border-2 border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editing ? 'Edit Department' : 'New Department'}
            </h2>
            <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Department Name *</label>
              <input
                type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-input" placeholder="e.g., Cardiology" required
              />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="form-input resize-none" rows={2} placeholder="Brief description..."
              />
            </div>
            <div>
              <label className="form-label">Icon</label>
              <div className="flex flex-wrap gap-2">
                {icons.map(ic => (
                  <button
                    key={ic} type="button"
                    onClick={() => setForm({ ...form, icon: ic })}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium capitalize transition-all ${
                      form.icon === ic
                        ? 'bg-primary-600 text-white ring-2 ring-primary-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
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
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="flex-1"><div className="h-4 bg-gray-200 rounded w-1/3" /></div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Icon</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Doctors</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {departments.map(dept => (
                <tr key={dept.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-800">{dept.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{dept.description}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500 capitalize">{dept.icon}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{dept.doctor_count}</td>
                  <td className="px-5 py-3">
                    <span className={dept.is_active ? 'badge-approved' : 'badge-cancelled'}>
                      {dept.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => openEdit(dept)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(dept.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Deactivate">
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
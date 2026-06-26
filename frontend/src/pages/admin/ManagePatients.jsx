/**
 * 管理端 - 患者管理
 */
import { useState, useEffect } from 'react';
import { getAllPatients } from '../../services/patientService';
import { Users, Search } from 'lucide-react';

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPatients = (query = search) => {
    setLoading(true);
    const params = { limit: 50 };
    if (query.trim()) params.search = query.trim();
    getAllPatients(params)
      .then(res => setPatients(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients(search);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500 mt-1">View registered patients</p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="form-input !py-2.5 !pl-10"
          />
        </form>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No patients found.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Gender</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Appointments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {patients.map(patient => (
                <tr key={patient.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-sm font-medium text-gray-800">{patient.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{patient.email}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{patient.phone || '-'}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{patient.gender || '-'}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{patient.appointment_count ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDoctors } from '../../services/doctorService';
import { getDepartments } from '../../services/departmentService';
import DoctorCard from '../../components/DoctorCard';
import { Search, SlidersHorizontal, X, UserCog } from 'lucide-react';

export default function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('department') || '');

  const fetchDoctors = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (selectedDept) params.department_id = selectedDept;

    getDoctors(params)
      .then(res => setDoctors(res.data || []))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDepartments().then(res => setDepartments(res.data || []));
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [selectedDept]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (selectedDept) params.department = selectedDept;
    setSearchParams(params);
    fetchDoctors();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedDept('');
    setSearchParams({});
    setTimeout(fetchDoctors, 0);
  };

  const hasFilters = search || selectedDept;

  return (
    <div className="page-container">
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <UserCog className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="page-title">Our Doctors</h1>
        </div>
        <p className="text-gray-500 ml-13">
          Find and choose from our team of qualified medical specialists.
        </p>
      </div>

      
      <div className="card p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialization..."
              className="form-input !pl-10 !py-2.5 text-sm"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="form-input !pl-10 !py-2.5 text-sm min-w-[180px]"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary !py-2.5 text-sm shrink-0">
            Search
          </button>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="btn-secondary !py-2.5 text-sm shrink-0">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </form>
      </div>

      
      <p className="text-sm text-gray-500 mb-4">
        Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
        {selectedDept && ` in ${departments.find(d => d.id === Number(selectedDept))?.name || ''}`}
        {search && ` matching "${search}"`}
      </p>

      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map(doc => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      )}

      {!loading && doctors.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <UserCog className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No doctors found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
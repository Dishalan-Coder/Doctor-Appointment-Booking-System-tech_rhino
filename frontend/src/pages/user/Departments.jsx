
import { useState, useEffect } from 'react';
import { getDepartments } from '../../services/departmentService';
import DepartmentCard from '../../components/DepartmentCard';
import { Building2 } from 'lucide-react';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDepartments()
      .then(res => setDepartments(res.data || []))
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="page-title">Departments</h1>
        </div>
        <p className="text-gray-500 ml-13">
          Browse our specialized medical departments and find the right doctor for your needs.
        </p>
      </div>

      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="card p-6 text-center animate-pulse">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-2xl" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {departments.map((dept, i) => (
            <DepartmentCard key={dept.id} department={dept} index={i} />
          ))}
        </div>
      )}

      {!loading && departments.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No departments available</p>
        </div>
      )}
    </div>
  );
}
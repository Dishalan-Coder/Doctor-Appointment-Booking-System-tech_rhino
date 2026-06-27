
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isPatientLoggedIn, isAdminLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAdmin) {
    if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />;
    return children;
  }

  if (!isPatientLoggedIn) return <Navigate to="/login" replace />;
  return children;
}
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

import Home from './pages/user/Home';
import Register from './pages/user/Register';
import Login from './pages/user/Login';
import Departments from './pages/user/Departments';
import Doctors from './pages/user/Doctors';
import DoctorDetails from './pages/user/DoctorDetails';
import BookAppointment from './pages/user/BookAppointment';
import MyAppointments from './pages/user/MyAppointments';
import Profile from './pages/user/Profile';

import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageAppointments from './pages/admin/ManageAppointments';
import ManagePatients from './pages/admin/ManagePatients';

import DoctorLogin from './pages/doctor/DoctorLogin';
import DoctorRegister from './pages/doctor/DoctorRegister';
import DoctorDashboard from './pages/doctor/DoctorDashboard';

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/book-appointment" element={
              <ProtectedRoute><BookAppointment /></ProtectedRoute>
            } />
            <Route path="/my-appointments" element={
              <ProtectedRoute><MyAppointments /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="departments" element={<ManageDepartments />} />
            <Route path="doctors" element={<ManageDoctors />} />
            <Route path="appointments" element={<ManageAppointments />} />
            <Route path="patients" element={<ManagePatients />} />
          </Route>

          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

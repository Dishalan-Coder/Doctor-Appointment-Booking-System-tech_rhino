
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://54.173.84.181:8000';
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00'
];

export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed'
};

export const STATUS_COLORS = {
  Pending: 'badge-pending',
  Approved: 'badge-approved',
  Cancelled: 'badge-cancelled',
  Completed: 'badge-completed'
};

export const GENDERS = ['Male', 'Female', 'Other'];

export const DEPARTMENT_ICONS = {
  heart: 'Heart',
  brain: 'Brain',
  bone: 'Bone',
  baby: 'Baby',
  scan: 'Scan',
  eye: 'Eye',
  ear: 'Ear',
  stethoscope: 'Stethoscope',
  ribbon: 'Ribbon',
  smile: 'Smile'
};

export const ADMIN_MENU = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/admin/departments', label: 'Departments', icon: 'Building2' },
  { path: '/admin/doctors', label: 'Doctors', icon: 'UserCog' },
  { path: '/admin/appointments', label: 'Appointments', icon: 'CalendarCheck' },
  { path: '/admin/patients', label: 'Patients', icon: 'Users' },
];
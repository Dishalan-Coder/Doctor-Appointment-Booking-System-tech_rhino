
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [patient, setPatient] = useState(null);
  const [patientToken, setPatientToken] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [doctorToken, setDoctorToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedPatient = localStorage.getItem('patient_data');
      const savedPToken = localStorage.getItem('patient_token');
      const savedDoctor = localStorage.getItem('doctor_data');
      const savedDToken = localStorage.getItem('doctor_token');
      const savedAdmin = localStorage.getItem('admin_data');
      const savedAToken = localStorage.getItem('admin_token');

      if (savedPatient && savedPToken) {
        setPatient(JSON.parse(savedPatient));
        setPatientToken(savedPToken);
      }
      if (savedDoctor && savedDToken) {
        setDoctor(JSON.parse(savedDoctor));
        setDoctorToken(savedDToken);
      }
      if (savedAdmin && savedAToken) {
        setAdmin(JSON.parse(savedAdmin));
        setAdminToken(savedAToken);
      }
    } catch (e) {
      console.error('Failed to restore auth state:', e);
    }
    setLoading(false);
  }, []);

  const loginAsPatient = (token, patientData) => {
    localStorage.setItem('patient_token', token);
    localStorage.setItem('patient_data', JSON.stringify(patientData));
    setPatientToken(token);
    setPatient(patientData);
  };

  const logoutPatient = () => {
    localStorage.removeItem('patient_token');
    localStorage.removeItem('patient_data');
    setPatientToken(null);
    setPatient(null);
  };

  const loginAsDoctor = (token, doctorData) => {
    localStorage.setItem('doctor_token', token);
    localStorage.setItem('doctor_data', JSON.stringify(doctorData));
    setDoctorToken(token);
    setDoctor(doctorData);
  };

  const logoutDoctor = () => {
    localStorage.removeItem('doctor_token');
    localStorage.removeItem('doctor_data');
    setDoctorToken(null);
    setDoctor(null);
  };

  const loginAsAdmin = (token, adminData) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_data', JSON.stringify(adminData));
    setAdminToken(token);
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    setAdminToken(null);
    setAdmin(null);
  };

  const value = {
    patient,
    patientToken,
    doctor,
    doctorToken,
    admin,
    adminToken,
    loading,
    isPatientLoggedIn: !!patientToken,
    isDoctorLoggedIn: !!doctorToken,
    isAdminLoggedIn: !!adminToken,
    loginAsPatient,
    logoutPatient,
    loginAsDoctor,
    logoutDoctor,
    loginAsAdmin,
    logoutAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
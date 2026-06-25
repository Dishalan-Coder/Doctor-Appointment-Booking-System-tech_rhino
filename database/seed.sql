USE doctor_appointment_db;

-- Departments
INSERT INTO departments (name, description) VALUES
('Cardiology', 'Heart related treatment'),
('Dermatology', 'Skin related treatment'),
('Neurology', 'Brain and nervous system'),
('Orthopedics', 'Bone related treatment');

-- Doctors
INSERT INTO doctors (full_name, specialization, email, phone, schedule, department_id) VALUES
('Dr. John Smith', 'Cardiologist', 'john@example.com', '0771234567', 'Mon-Fri 9AM-5PM', 1),
('Dr. Mary Johnson', 'Dermatologist', 'mary@example.com', '0772345678', 'Mon-Wed 10AM-4PM', 2),
('Dr. David Lee', 'Neurologist', 'david@example.com', '0773456789', 'Tue-Thu 8AM-2PM', 3);

-- Patients
INSERT INTO patients (full_name, email, password, phone, age, gender, role) VALUES
('Kasun Perera', 'kasun@mail.com', '123456', '0771111111', 25, 'Male', 'patient'),
('Nimal Silva', 'nimal@mail.com', '123456', '0772222222', 30, 'Male', 'patient');

-- Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, notes) VALUES
(1, 1, '2026-06-27', '10:00:00', 'Pending', 'Chest pain checkup'),
(2, 2, '2026-06-28', '11:30:00', 'Approved', 'Skin allergy');
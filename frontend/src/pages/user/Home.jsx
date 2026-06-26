/**
 * 首页 - 包含 Hero、科室展示、热门医生
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDepartments } from '../../services/departmentService';
import { getDoctors } from '../../services/doctorService';
import DepartmentCard from '../../components/DepartmentCard';
import DoctorCard from '../../components/DoctorCard';
import {
  Search, ArrowRight, Shield, Clock, Users,
  Star, ChevronRight
} from 'lucide-react';

export default function Home() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getDepartments().then(res => setDepartments(res.data || []));
    getDoctors({ limit: 4 }).then(res => setDoctors(res.data || []));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero 区域 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-teal-600">
        <div className="hero-pattern absolute inset-0 opacity-30" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-teal-400/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-primary-100 mb-6 border border-white/10">
              <Shield className="w-3.5 h-3.5" />
              Serving Kilinochchi & Northern Province
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
              Book Your Doctor
              <span className="block text-primary-200">Appointment Online</span>
            </h1>
            <p className="text-lg text-primary-100/80 leading-relaxed mb-8 max-w-lg">
              Find the right specialist, choose your preferred time, and book an appointment in just a few clicks. Your health, our priority.
            </p>

            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, specialties..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                />
              </div>
              <button type="submit" className="px-6 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shrink-0">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 统计数据条 */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Specialist Doctors', value: '12+' },
              { icon: Shield, label: 'Departments', value: '12' },
              { icon: Clock, label: 'Years of Service', value: '5+' },
              { icon: Star, label: 'Patient Satisfaction', value: '98%' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 科室展示 */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Our Departments</h2>
            <p className="text-gray-500 mt-1">Comprehensive medical services under one roof</p>
          </div>
          <Link to="/departments" className="hidden sm:flex items-center gap-1 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {departments.slice(0, 5).map((dept, i) => (
            <DepartmentCard key={dept.id} department={dept} index={i} />
          ))}
        </div>
        <div className="sm:hidden mt-4 text-center">
          <Link to="/departments" className="text-primary-600 font-semibold text-sm">
            View All Departments &rarr;
          </Link>
        </div>
      </section>

      {/* 热门医生 */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Top Doctors</h2>
            <p className="text-gray-500 mt-1">Meet our experienced medical professionals</p>
          </div>
          <Link to="/doctors" className="hidden sm:flex items-center gap-1 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {doctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="bg-gradient-to-r from-primary-600 to-teal-600 my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
            Ready to Book Your Appointment?
          </h2>
          <p className="text-primary-100 mb-6 max-w-lg mx-auto">
            Join thousands of patients who trust MedBook for their healthcare needs.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/register" className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors">
              Get Started
            </Link>
            <Link to="/doctors" className="px-6 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-colors">
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
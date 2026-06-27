
import { Stethoscope, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-white">
                Med<span className="text-primary-400">Book</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted platform for booking doctor appointments online. Fast, easy, and reliable healthcare access.
            </p>
          </div>

          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/departments" className="hover:text-primary-400 transition-colors">Departments</Link></li>
              <li><Link to="/doctors" className="hover:text-primary-400 transition-colors">Our Doctors</Link></li>
              <li><Link to="/register" className="hover:text-primary-400 transition-colors">Register</Link></li>
              <li><Link to="/doctor/register" className="hover:text-primary-400 transition-colors">Doctor Register</Link></li>
              <li><Link to="/admin/login" className="hover:text-primary-400 transition-colors">Admin Login</Link></li>
            </ul>
          </div>

         
          <div>
            <h4 className="text-white font-semibold mb-4">Departments</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/doctors?department=1" className="hover:text-primary-400 transition-colors">Cardiology</Link></li>
              <li><Link to="/doctors?department=2" className="hover:text-primary-400 transition-colors">Neurology</Link></li>
              <li><Link to="/doctors?department=3" className="hover:text-primary-400 transition-colors">Orthopedics</Link></li>
              <li><Link to="/doctors?department=11" className="hover:text-primary-400 transition-colors">Diabetology</Link></li>
              <li><Link to="/doctors?department=12" className="hover:text-primary-400 transition-colors">Nephrology</Link></li>
            </ul>
          </div>

         
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <span>76, 2nd cross street, Kilinochchi, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <span>077 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <span>medbook@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MedBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
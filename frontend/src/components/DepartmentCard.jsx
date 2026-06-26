/**
 * 科室卡片组件
 */
import { Link } from 'react-router-dom';
import {
  Heart, Brain, Bone, Baby, Scan, Eye,
  Ear, Stethoscope, Ribbon, Smile, Users
} from 'lucide-react';

const iconMap = {
  heart: Heart, brain: Brain, bone: Bone, baby: Baby,
  scan: Scan, eye: Eye, ear: Ear, stethoscope: Stethoscope,
  ribbon: Ribbon, smile: Smile
};

// 不同科室的配色方案
const colorSchemes = [
  'from-rose-50 to-rose-100 text-rose-600',
  'from-violet-50 to-violet-100 text-violet-600',
  'from-amber-50 to-amber-100 text-amber-600',
  'from-sky-50 to-sky-100 text-sky-600',
  'from-emerald-50 to-emerald-100 text-emerald-600',
  'from-cyan-50 to-cyan-100 text-cyan-600',
  'from-orange-50 to-orange-100 text-orange-600',
  'from-teal-50 to-teal-100 text-teal-600',
  'from-pink-50 to-pink-100 text-pink-600',
  'from-indigo-50 to-indigo-100 text-indigo-600',
];

export default function DepartmentCard({ department, index = 0 }) {
  const Icon = iconMap[department.icon] || Stethoscope;
  const colorClass = colorSchemes[index % colorSchemes.length];

  return (
    <Link
      to={`/doctors?department=${department.id}`}
      className="card p-6 text-center group hover:-translate-y-1"
    >
      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${colorClass}
                      flex items-center justify-center
                      group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
        {department.name}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
        {department.description}
      </p>
      <div className="flex items-center justify-center gap-1.5 text-sm text-primary-600 font-medium">
        <Users className="w-3.5 h-3.5" />
        {department.doctor_count} Doctor{department.doctor_count !== 1 ? 's' : ''}
      </div>
    </Link>
  );
}
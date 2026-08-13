'use client';

import React from 'react';
import { PersonalInfo } from '../../../types/cv';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase } from 'lucide-react';

interface PersonalFormProps {
  data: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
}

export const PersonalForm: React.FC<PersonalFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
        <User className="w-4 h-4 text-sky-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-400 font-medium mb-1">Full Name *</label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="e.g. Tanvir Hasan"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-medium mb-1">Professional Title</label>
          <input
            type="text"
            value={data.professionalTitle || ''}
            onChange={(e) => handleChange('professionalTitle', e.target.value)}
            placeholder="e.g. Computer Science Graduate"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
            <Mail className="w-3 h-3 text-amber-400" /> Email Address
          </label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="thasan762@gmail.com"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
            <Phone className="w-3 h-3 text-emerald-400" /> Phone Number
          </label>
          <input
            type="text"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="01521584563"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400" /> Location / Address
          </label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Dhaka, Bangladesh"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
            <Linkedin className="w-3 h-3 text-sky-400" /> LinkedIn URL
          </label>
          <input
            type="text"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/Tanvir-Hasan1"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
            <Github className="w-3 h-3 text-slate-300" /> GitHub URL
          </label>
          <input
            type="text"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="github.com/Tanvir-Hasan1"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3 text-teal-400" /> Portfolio Website
          </label>
          <input
            type="text"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="tanvirhasan.dev"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>
    </div>
  );
};

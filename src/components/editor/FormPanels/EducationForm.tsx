'use client';

import React from 'react';
import { Education } from '../../../types/cv';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

interface EducationFormProps {
  educations: Education[];
  onChange: (updated: Education[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ educations, onChange }) => {
  const handleAdd = () => {
    const newEntry: Education = {
      id: 'edu-' + Date.now(),
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University Name',
      location: 'Dhaka',
      startDate: '2020',
      endDate: '2024',
      gpa: '3.77/4.00',
      relevantCoursework: ['Data Structures & Algorithms', 'Software Engineering'],
    };
    onChange([...educations, newEntry]);
  };

  const handleUpdate = (id: string, field: keyof Education, value: any) => {
    onChange(
      educations.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    );
  };

  const handleDelete = (id: string) => {
    onChange(educations.filter((entry) => entry.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Education</h3>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Degree
        </button>
      </div>

      <div className="space-y-4">
        {educations.map((edu, idx) => (
          <div key={edu.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-900">
              <span className="font-mono text-slate-500">#{idx + 1} {edu.degree}</span>
              <button
                onClick={() => handleDelete(edu.id)}
                className="p-1 text-slate-400 hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Degree / Certification</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">CGPA / Grade</label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => handleUpdate(edu.id, 'gpa', e.target.value)}
                  placeholder="3.77/4.00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Start Date</label>
                <input
                  type="text"
                  value={edu.startDate}
                  onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">End Date</label>
                <input
                  type="text"
                  value={edu.endDate || ''}
                  onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Relevant Coursework (comma separated)
              </label>
              <input
                type="text"
                value={(edu.relevantCoursework || []).join(', ')}
                onChange={(e) =>
                  handleUpdate(
                    edu.id,
                    'relevantCoursework',
                    e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="Data Structures, Algorithms, Software Engineering..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

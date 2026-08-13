'use client';

import React, { useState, useEffect } from 'react';
import { Education } from '../../../types/cv';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

interface EducationFormProps {
  educations: Education[];
  onChange: (updated: Education[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ educations, onChange }) => {
  const [rawTexts, setRawTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const updated: Record<string, string> = {};
    educations.forEach((edu) => {
      const externalStr = (edu.relevantCoursework || []).join(', ');
      const currentParsed = (rawTexts[edu.id] || '').split(',').map((s) => s.trim()).filter(Boolean).join(', ');
      if (currentParsed !== externalStr || rawTexts[edu.id] === undefined) {
        updated[edu.id] = externalStr;
      }
    });
    if (Object.keys(updated).length > 0) {
      setRawTexts((prev) => ({ ...prev, ...updated }));
    }
  }, [educations]);

  const handleAdd = () => {
    const newId = 'edu-' + Date.now();
    const newEntry: Education = {
      id: newId,
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University Name',
      location: 'Dhaka',
      startDate: '2020',
      endDate: '2024',
      gpa: '3.77/4.00',
      relevantCoursework: ['Data Structures & Algorithms', 'Software Engineering'],
    };
    setRawTexts((prev) => ({ ...prev, [newId]: 'Data Structures & Algorithms, Software Engineering' }));
    onChange([...educations, newEntry]);
  };

  const handleUpdate = (id: string, field: keyof Education, value: any) => {
    onChange(
      educations.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    );
  };

  const handleCourseworkChange = (id: string, text: string) => {
    setRawTexts((prev) => ({ ...prev, [id]: text }));
    const parsed = text.split(',').map((s) => s.trim()).filter(Boolean);
    onChange(educations.map((e) => (e.id === id ? { ...e, relevantCoursework: parsed } : e)));
  };

  const handleDelete = (id: string) => {
    setRawTexts((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    onChange(educations.filter((entry) => entry.id !== id));
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-full bg-slate-900">
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
        {educations.map((edu, idx) => {
          const courseworkInputValue = rawTexts[edu.id] !== undefined ? rawTexts[edu.id] : (edu.relevantCoursework || []).join(', ');

          return (
            <div key={edu.id} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-3">
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
                  value={courseworkInputValue}
                  onChange={(e) => handleCourseworkChange(edu.id, e.target.value)}
                  placeholder="Data Structures, Algorithms, Software Engineering..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


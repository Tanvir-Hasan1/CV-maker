'use client';

import React from 'react';
import { Experience } from '../../../types/cv';
import { Briefcase, Plus, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (updated: Experience[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ experiences, onChange }) => {
  const handleAdd = () => {
    const newEntry: Experience = {
      id: 'exp-' + Date.now(),
      jobTitle: 'Software Engineer',
      company: 'Tech Solutions Inc.',
      startDate: '2023',
      endDate: 'Present',
      isCurrent: true,
      description: '• Developed responsive web applications\n• Collaborated with cross-functional teams',
    };
    onChange([...experiences, newEntry]);
  };

  const handleUpdate = (id: string, field: keyof Experience, value: any) => {
    onChange(
      experiences.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    );
  };

  const handleDelete = (id: string) => {
    onChange(experiences.filter((entry) => entry.id !== id));
  };

  const handleDuplicate = (entry: Experience) => {
    const dup: Experience = {
      ...entry,
      id: 'exp-' + Date.now(),
      jobTitle: `${entry.jobTitle} (Copy)`,
    };
    onChange([...experiences, dup]);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= experiences.length) return;
    const list = [...experiences];
    const [moved] = list.splice(index, 1);
    list.splice(newIdx, 0, moved);
    onChange(list);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Work Experience</h3>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Role
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-3 relative group"
          >
            {/* ITEM ACTIONS HEADER */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-900">
              <span className="font-mono text-slate-500">#{idx + 1} {exp.jobTitle || 'Role'}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 text-slate-500 hover:text-white disabled:opacity-20"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === experiences.length - 1}
                  className="p-1 text-slate-500 hover:text-white disabled:opacity-20"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDuplicate(exp)}
                  className="p-1 text-slate-400 hover:text-sky-400"
                  title="Duplicate Entry"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-1 text-slate-400 hover:text-rose-400"
                  title="Delete Entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Job Title</label>
                <input
                  type="text"
                  value={exp.jobTitle}
                  onChange={(e) => handleUpdate(exp.id, 'jobTitle', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Start Date</label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
                  placeholder="e.g. Sep 2023"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">End Date</label>
                <input
                  type="text"
                  value={exp.endDate || ''}
                  disabled={exp.isCurrent}
                  onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                  placeholder="e.g. 2025"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white disabled:opacity-40 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* DESCRIPTION BULLETS */}
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">Description & Bullet Points</label>
              <textarea
                value={exp.description}
                onChange={(e) => handleUpdate(exp.id, 'description', e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

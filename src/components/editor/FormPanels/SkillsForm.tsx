'use client';

import React, { useState, useEffect } from 'react';
import { SkillCategory } from '../../../types/cv';
import { Code, Plus, Trash2, Tag } from 'lucide-react';

interface SkillsFormProps {
  skillCategories: SkillCategory[];
  onChange: (updated: SkillCategory[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ skillCategories, onChange }) => {
  const [rawTexts, setRawTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const updated: Record<string, string> = {};
    skillCategories.forEach((cat) => {
      const externalStr = cat.skills.join(', ');
      const currentParsed = (rawTexts[cat.id] || '').split(',').map((s) => s.trim()).filter(Boolean).join(', ');
      if (currentParsed !== externalStr || rawTexts[cat.id] === undefined) {
        updated[cat.id] = externalStr;
      }
    });
    if (Object.keys(updated).length > 0) {
      setRawTexts((prev) => ({ ...prev, ...updated }));
    }
  }, [skillCategories]);

  const handleAddCategory = () => {
    const newId = 'sc-' + Date.now();
    const newCat: SkillCategory = {
      id: newId,
      categoryName: 'New Skill Category',
      skills: ['Skill 1', 'Skill 2'],
    };
    setRawTexts((prev) => ({ ...prev, [newId]: 'Skill 1, Skill 2' }));
    onChange([...skillCategories, newCat]);
  };

  const handleUpdateName = (id: string, name: string) => {
    onChange(skillCategories.map((c) => (c.id === id ? { ...c, categoryName: name } : c)));
  };

  const handleSkillsTextChange = (id: string, text: string) => {
    setRawTexts((prev) => ({ ...prev, [id]: text }));
    const parsedSkills = text.split(',').map((s) => s.trim()).filter(Boolean);
    onChange(skillCategories.map((c) => (c.id === id ? { ...c, skills: parsedSkills } : c)));
  };

  const handleDelete = (id: string) => {
    setRawTexts((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    onChange(skillCategories.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Technical Skills & Categories</h3>
        </div>
        <button
          onClick={handleAddCategory}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>

      <div className="space-y-3">
        {skillCategories.map((cat) => {
          const inputValue = rawTexts[cat.id] !== undefined ? rawTexts[cat.id] : cat.skills.join(', ');

          return (
            <div key={cat.id} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={cat.categoryName}
                  onChange={(e) => handleUpdateName(cat.id, e.target.value)}
                  placeholder="Category Name (e.g. Frontend Technologies)"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-sky-500 flex-1"
                />
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-400" /> Skills (separated by comma)
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleSkillsTextChange(cat.id, e.target.value)}
                  placeholder="React.js, React Native, HTML5, CSS3"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              {/* PREVIEW BADGES */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cat.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

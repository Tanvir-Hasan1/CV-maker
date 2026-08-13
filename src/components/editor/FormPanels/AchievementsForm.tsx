'use client';

import React from 'react';
import { Achievement, Language, Interest } from '../../../types/cv';
import { Trophy, Globe2, Heart, Plus, Trash2 } from 'lucide-react';

interface AdditionalSectionsFormProps {
  achievements: Achievement[];
  onAchievementsChange: (updated: Achievement[]) => void;
  languages: Language[];
  onLanguagesChange: (updated: Language[]) => void;
  interests: Interest[];
  onInterestsChange: (updated: Interest[]) => void;
}

export const AchievementsForm: React.FC<AdditionalSectionsFormProps> = ({
  achievements,
  onAchievementsChange,
  languages,
  onLanguagesChange,
  interests,
  onInterestsChange,
}) => {
  // Achievements Handlers
  const handleAddAch = () => {
    onAchievementsChange([
      ...achievements,
      { id: 'ach-' + Date.now(), title: 'Maintained outstanding academic standing' },
    ]);
  };

  const handleUpdateAch = (id: string, title: string) => {
    onAchievementsChange(
      achievements.map((a) => (a.id === id ? { ...a, title } : a))
    );
  };

  const handleDeleteAch = (id: string) => {
    onAchievementsChange(achievements.filter((a) => a.id !== id));
  };

  // Languages Handlers
  const handleAddLang = () => {
    onLanguagesChange([
      ...languages,
      { id: 'lang-' + Date.now(), language: 'Language', proficiency: 'Fluent' },
    ]);
  };

  const handleUpdateLang = (id: string, field: keyof Language, val: string) => {
    onLanguagesChange(
      languages.map((l) => (l.id === id ? { ...l, [field]: val } : l))
    );
  };

  const handleDeleteLang = (id: string) => {
    onLanguagesChange(languages.filter((l) => l.id !== id));
  };

  // Interests Handlers
  const handleAddInt = () => {
    onInterestsChange([
      ...interests,
      { id: 'int-' + Date.now(), name: 'Exploring New Tech' },
    ]);
  };

  const handleUpdateInt = (id: string, name: string) => {
    onInterestsChange(
      interests.map((i) => (i.id === id ? { ...i, name } : i))
    );
  };

  const handleDeleteInt = (id: string) => {
    onInterestsChange(interests.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* ACHIEVEMENTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Achievements</h3>
          </div>
          <button
            onClick={handleAddAch}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {achievements.map((ach) => (
            <div key={ach.id} className="flex items-center gap-2">
              <input
                type="text"
                value={ach.title}
                onChange={(e) => handleUpdateAch(ach.id, e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <button onClick={() => handleDeleteAch(ach.id)} className="p-1 text-slate-400 hover:text-rose-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* LANGUAGES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Languages</h3>
          </div>
          <button
            onClick={handleAddLang}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-2 text-xs">
              <input
                type="text"
                value={lang.language}
                onChange={(e) => handleUpdateLang(lang.id, 'language', e.target.value)}
                placeholder="English"
                className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
              />
              <input
                type="text"
                value={lang.proficiency}
                onChange={(e) => handleUpdateLang(lang.id, 'proficiency', e.target.value)}
                placeholder="Fluent / Native"
                className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
              />
              <button onClick={() => handleDeleteLang(lang.id)} className="p-1 text-slate-400 hover:text-rose-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* INTERESTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Interests</h3>
          </div>
          <button
            onClick={handleAddInt}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {interests.map((int) => (
            <div key={int.id} className="flex items-center gap-2">
              <input
                type="text"
                value={int.name}
                onChange={(e) => handleUpdateInt(int.id, e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <button onClick={() => handleDeleteInt(int.id)} className="p-1 text-slate-400 hover:text-rose-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

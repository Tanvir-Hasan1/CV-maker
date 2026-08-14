'use client';

import React from 'react';
import { Achievement, Language, Interest } from '../../../types/cv';
import { Trophy, Globe2, Heart, Plus, Trash2 } from 'lucide-react';

interface AdditionalSectionsFormProps {
  achievements: Achievement[];
  onAchievementsChange?: (updated: Achievement[]) => void;
  languages?: Language[];
  onLanguagesChange?: (updated: Language[]) => void;
  interests?: Interest[];
  onInterestsChange?: (updated: Interest[]) => void;
  onChange?: (updated: Achievement[]) => void;
}

export const AchievementsForm: React.FC<AdditionalSectionsFormProps> = ({
  achievements,
  onAchievementsChange,
  languages = [],
  onLanguagesChange,
  interests = [],
  onInterestsChange,
  onChange,
}) => {
  const triggerAchChange = (updated: Achievement[]) => {
    if (onAchievementsChange) onAchievementsChange(updated);
    if (onChange) onChange(updated);
  };

  // Achievements Handlers
  const handleAddAch = () => {
    triggerAchChange([
      ...achievements,
      { id: 'ach-' + Date.now(), title: 'Maintained outstanding academic standing' },
    ]);
  };

  const handleUpdateAch = (id: string, title: string) => {
    triggerAchChange(
      achievements.map((a) => (a.id === id ? { ...a, title } : a))
    );
  };

  const handleDeleteAch = (id: string) => {
    triggerAchChange(achievements.filter((a) => a.id !== id));
  };

  // Languages Handlers
  const handleAddLang = () => {
    if (onLanguagesChange) {
      onLanguagesChange([
        ...languages,
        { id: 'lang-' + Date.now(), language: 'Language', proficiency: 'Fluent' },
      ]);
    }
  };

  const handleUpdateLang = (id: string, field: keyof Language, val: string) => {
    if (onLanguagesChange) {
      onLanguagesChange(
        languages.map((l) => (l.id === id ? { ...l, [field]: val } : l))
      );
    }
  };

  const handleDeleteLang = (id: string) => {
    if (onLanguagesChange) {
      onLanguagesChange(languages.filter((l) => l.id !== id));
    }
  };

  // Interests Handlers
  const handleAddInt = () => {
    if (onInterestsChange) {
      onInterestsChange([
        ...interests,
        { id: 'int-' + Date.now(), name: 'Exploring New Tech' },
      ]);
    }
  };

  const handleUpdateInt = (id: string, name: string) => {
    if (onInterestsChange) {
      onInterestsChange(
        interests.map((i) => (i.id === id ? { ...i, name } : i))
      );
    }
  };

  const handleDeleteInt = (id: string) => {
    if (onInterestsChange) {
      onInterestsChange(interests.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* ACHIEVEMENTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Achievements</h3>
          </div>
          <button
            onClick={handleAddAch}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
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
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
              <button onClick={() => handleDeleteAch(ach.id)} className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* LANGUAGES */}
      {onLanguagesChange && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Languages</h3>
            </div>
            <button
              onClick={handleAddLang}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
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
                  className="w-1/2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
                <input
                  type="text"
                  value={lang.proficiency}
                  onChange={(e) => handleUpdateLang(lang.id, 'proficiency', e.target.value)}
                  placeholder="Fluent / Native"
                  className="w-1/2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button onClick={() => handleDeleteLang(lang.id)} className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INTERESTS */}
      {onInterestsChange && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Interests</h3>
            </div>
            <button
              onClick={handleAddInt}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
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
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button onClick={() => handleDeleteInt(int.id)} className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


'use client';

import React from 'react';
import {
  User, Sparkles, Briefcase, GraduationCap, Code, FolderCheck,
  Trophy, Globe2, Layers, EyeOff, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  sectionOrder: string[];
  hiddenSections: string[];
  onOpenReorderModal: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const SECTION_METADATA: Record<string, { label: string; icon: React.ReactNode }> = {
  personalInfo: { label: 'Personal Info', icon: <User className="w-4 h-4 text-sky-400" /> },
  summary: { label: 'Summary', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
  experience: { label: 'Experience', icon: <Briefcase className="w-4 h-4 text-emerald-400" /> },
  education: { label: 'Education', icon: <GraduationCap className="w-4 h-4 text-amber-400" /> },
  skillCategories: { label: 'Skills', icon: <Code className="w-4 h-4 text-cyan-400" /> },
  projects: { label: 'Projects', icon: <FolderCheck className="w-4 h-4 text-indigo-400" /> },
  achievements: { label: 'Achievements', icon: <Trophy className="w-4 h-4 text-yellow-400" /> },
  additional: { label: 'Languages & More', icon: <Globe2 className="w-4 h-4 text-rose-400" /> },
};

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  sectionOrder,
  hiddenSections,
  onOpenReorderModal,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <aside className="w-full h-full p-2 flex flex-col justify-between select-none font-sans overflow-y-auto">
      <div className="space-y-1">
        {/* HEADER WITH MINIMIZE / EXPAND TOGGLE - ALIGNED TO MOST RIGHT SIDE */}
        <div className="flex items-center justify-between pl-2 pr-0 py-2 mb-1 w-full">
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              CV SECTIONS
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${isCollapsed ? 'mx-auto' : 'ml-auto -mr-1'
              }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-sky-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        {/* ALWAYS TOP: PERSONAL INFO */}
        <button
          onClick={() => onSelectTab('personalInfo')}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-between p-2.5'
            } rounded-xl text-xs font-semibold transition-colors group relative ${activeTab === 'personalInfo'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
              : 'text-slate-300 hover:bg-slate-800'
            }`}
          title={isCollapsed ? SECTION_METADATA.personalInfo.label : undefined}
        >
          <div className="flex items-center gap-2.5">
            {SECTION_METADATA.personalInfo.icon}
            {!isCollapsed && <span>{SECTION_METADATA.personalInfo.label}</span>}
          </div>
        </button>

        {/* DYNAMIC SECTIONS ORDERED BY CVSettings */}
        {sectionOrder.map((secKey) => {
          const meta = SECTION_METADATA[secKey];
          if (!meta) return null;
          const isHidden = hiddenSections.includes(secKey);

          return (
            <button
              key={secKey}
              onClick={() => onSelectTab(secKey)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-between p-2.5'
                } rounded-xl text-xs font-semibold transition-colors relative group ${activeTab === secKey
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                  : isHidden
                    ? 'opacity-40 text-slate-500 hover:bg-slate-800'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              title={isCollapsed ? meta.label : undefined}
            >
              <div className="flex items-center gap-2.5">
                {meta.icon}
                {!isCollapsed && <span>{meta.label}</span>}
              </div>
              {!isCollapsed && isHidden && (
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* REORDER / ADD SECTIONS ACTION BUTTON */}
      <button
        onClick={onOpenReorderModal}
        className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-300 hover:text-white transition-colors mt-4`}
        title="Manage & Reorder Sections"
      >
        <Layers className="w-4 h-4 text-amber-400 shrink-0" />
        {!isCollapsed && <span>Manage & Reorder</span>}
      </button>
    </aside>
  );
};

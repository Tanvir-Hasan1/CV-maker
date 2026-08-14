'use client';

import React from 'react';
import { CVDocument } from '../../types/storage';
import { PersonalForm } from './FormPanels/PersonalForm';
import { SummaryForm } from './FormPanels/SummaryForm';
import { ExperienceForm } from './FormPanels/ExperienceForm';
import { EducationForm } from './FormPanels/EducationForm';
import { SkillsForm } from './FormPanels/SkillsForm';
import { ProjectsForm } from './FormPanels/ProjectsForm';
import { AchievementsForm } from './FormPanels/AchievementsForm';

interface RightFormPanelProps {
  activeTab: string;
  activeDocument: CVDocument;
  updateActiveDocument: (updated: CVDocument) => void;
  width: number;
}

export const RightFormPanel: React.FC<RightFormPanelProps> = ({
  activeTab,
  activeDocument,
  updateActiveDocument,
  width,
}) => {
  return (
    <div
      className="w-full h-full min-h-full flex-1 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 sm:p-6 overflow-y-auto shrink-0 select-none relative flex flex-col transition-colors"
    >
      {activeTab === 'personalInfo' && (
        <PersonalForm
          data={activeDocument.data.personalInfo}
          onChange={(personalInfo) =>
            updateActiveDocument({
              ...activeDocument,
              data: { ...activeDocument.data, personalInfo },
            })
          }
        />
      )}

      {activeTab === 'summary' && (
        <SummaryForm
          summary={activeDocument.data.summary || ''}
          onChange={(summary) =>
            updateActiveDocument({
              ...activeDocument,
              data: { ...activeDocument.data, summary },
            })
          }
        />
      )}

      {activeTab === 'experience' && (
        <ExperienceForm
          experiences={activeDocument.data.experience || []}
          onChange={(experience) =>
            updateActiveDocument({
              ...activeDocument,
              data: { ...activeDocument.data, experience },
            })
          }
        />
      )}

      {activeTab === 'education' && (
        <EducationForm
          educations={activeDocument.data.education || []}
          onChange={(education) =>
            updateActiveDocument({
              ...activeDocument,
              data: { ...activeDocument.data, education },
            })
          }
        />
      )}

      {activeTab === 'skillCategories' && (
        <SkillsForm
          skillCategories={activeDocument.data.skillCategories || []}
          onChange={(skillCategories) =>
            updateActiveDocument({
              ...activeDocument,
              data: { ...activeDocument.data, skillCategories },
            })
          }
        />
      )}

      {activeTab === 'projects' && (
        <ProjectsForm
          projects={activeDocument.data.projects || []}
          onChange={(projects) =>
            updateActiveDocument({
              ...activeDocument,
              data: { ...activeDocument.data, projects },
            })
          }
        />
      )}

      {activeTab === 'achievements' && (
        <AchievementsForm
          achievements={activeDocument.data.achievements || []}
          onChange={(achievements) =>
            updateActiveDocument({
              ...activeDocument,
              data: { ...activeDocument.data, achievements },
            })
          }
        />
      )}

      {activeTab === 'additional' && (
        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
            Languages & Additional Sections
          </h3>
          <p>You can edit languages directly on the preview pane or manage section ordering.</p>
        </div>
      )}
    </div>
  );
};


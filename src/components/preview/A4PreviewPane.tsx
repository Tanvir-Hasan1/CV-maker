'use client';

import React from 'react';
import { ResumeData } from '../../types/cv';
import { CVSettings } from '../../types/settings';
import { getTemplateComponent } from '../templates/TemplateRegistry';

interface A4PreviewPaneProps {
  data: ResumeData;
  settings: CVSettings;
  zoom: number;
  onUpdateData?: (updated: ResumeData) => void;
  onSelectSection?: (sectionKey: string) => void;
}

export const A4PreviewPane: React.FC<A4PreviewPaneProps> = ({
  data,
  settings,
  zoom,
  onUpdateData,
  onSelectSection,
}) => {
  const TemplateComponent = getTemplateComponent(settings.templateId);

  return (
    <div className="flex-1 bg-slate-950 overflow-auto p-4 sm:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div
        className="transition-transform duration-200 ease-out origin-top shadow-2xl"
        style={{
          transform: `scale(${zoom})`,
          width: '210mm',
        }}
      >
        {/* A4 DOCUMENT CANVAS TARGET FOR PDF EXPORT */}
        <div
          id="a4-cv-preview"
          className="a4-page bg-white rounded-sm overflow-hidden text-slate-900"
          style={{
            width: '210mm',
            minHeight: '297mm',
            boxSizing: 'border-box',
          }}
        >
          <TemplateComponent
            data={data}
            settings={settings}
            onUpdateData={onUpdateData}
            onSelectSection={onSelectSection}
          />
        </div>
      </div>
    </div>
  );
};

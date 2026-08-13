import React from 'react';
import { ResumeData } from '../../types/cv';
import { CVSettings, TemplateId } from '../../types/settings';
import { TechSidebarTemplate } from './TechSidebarTemplate';
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CreativeTemplate } from './CreativeTemplate';

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
  category: string;
  badge?: string;
  component: React.FC<{
    data: ResumeData;
    settings: CVSettings;
    onUpdateData?: (updated: ResumeData) => void;
    onSelectSection?: (sectionKey: string) => void;
  }>;
}

export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateInfo> = {
  'tech-sidebar': {
    id: 'tech-sidebar',
    name: 'Tech Sidebar (Tanvir Layout)',
    description: 'Two-column software developer layout with technical skill pills, summary callout box, and clean section dividers.',
    category: 'Engineering',
    badge: 'Popular',
    component: TechSidebarTemplate,
  },
  modern: {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean sans-serif typography, accent border highlights, and streamlined multi-column layout.',
    category: 'General',
    component: ModernTemplate,
  },
  classic: {
    id: 'classic',
    name: 'Classic Academic',
    description: 'Formal serif typography, centered elegant header, and traditional corporate section rules.',
    category: 'Academic & Legal',
    component: ClassicTemplate,
  },
  executive: {
    id: 'executive',
    name: 'Executive Leadership',
    description: 'Premium corporate header banner, spacious layout, and clear executive summary highlight block.',
    category: 'Corporate',
    component: ExecutiveTemplate,
  },
  creative: {
    id: 'creative',
    name: 'Creative Accent',
    description: 'Distinctive typography, soft background highlights, and modern pill tags.',
    category: 'Design & Product',
    component: CreativeTemplate,
  },
};

export function getTemplateComponent(templateId: TemplateId) {
  const template = TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY['tech-sidebar'];
  return template.component;
}

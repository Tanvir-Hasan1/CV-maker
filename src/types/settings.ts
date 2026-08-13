export type TemplateId = 
  | 'tech-sidebar'  // Based on Tanvir Hasan's CV (Two column, tech badges, callout summary)
  | 'modern'        // Sleek sans-serif, clean borders
  | 'classic'       // Academic, formal serif
  | 'executive'     // Corporate accent header, high readability
  | 'creative';     // Expressive sidebar / header layout

export interface CVSettings {
  templateId: TemplateId;
  accentColor: string; // e.g. "#1e3a8a", "#0284c7", "#0d9488", etc.
  fontFamily: string; // e.g. "Inter", "Roboto", "Merriweather", "Outfit"
  fontSize: 'sm' | 'md' | 'lg';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  sectionOrder: string[];
  hiddenSections: string[];
  showIcons: boolean;
}

export const DEFAULT_CV_SETTINGS: CVSettings = {
  templateId: 'tech-sidebar',
  accentColor: '#1d4ed8',
  fontFamily: 'Inter',
  fontSize: 'md',
  lineHeight: 'normal',
  sectionOrder: [
    'summary',
    'experience',
    'education',
    'skillCategories',
    'projects',
    'achievements',
    'languages',
    'interests',
    'certifications',
    'volunteerExperience',
    'publications',
    'customSections'
  ],
  hiddenSections: [],
  showIcons: true,
};

import React from 'react';
import { ResumeData } from '../../types/cv';
import { CVSettings } from '../../types/settings';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  settings: CVSettings;
  onUpdateData?: (updated: ResumeData) => void;
  onSelectSection?: (sectionKey: string) => void;
}

export const ModernTemplate: React.FC<TemplateProps> = ({
  data,
  settings,
  onUpdateData,
  onSelectSection,
}) => {
  const { personalInfo, summary, education, experience, skillCategories, projects } = data;
  const accentColor = settings.accentColor || '#0284c7';
  const hidden = settings.hiddenSections || [];
  const sectionOrder = settings.sectionOrder || [];

  const isVisible = (key: string) => !hidden.includes(key);

  const updatePersonalInfo = (field: string, val: string) => {
    if (!onUpdateData) return;
    onUpdateData({ ...data, personalInfo: { ...personalInfo, [field]: val } });
  };

  const updateSummary = (text: string) => {
    if (!onUpdateData) return;
    onUpdateData({ ...data, summary: text });
  };

  const updateExperienceItem = (id: string, field: string, val: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      experience: experience.map((exp) => (exp.id === id ? { ...exp, [field]: val } : exp)),
    });
  };

  const updateEducationItem = (id: string, field: string, val: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      education: education.map((edu) => (edu.id === id ? { ...edu, [field]: val } : edu)),
    });
  };

  const editableClass =
    'hover:outline hover:outline-1 hover:outline-sky-400 hover:bg-sky-50/50 focus:outline-2 focus:outline-sky-500 focus:bg-sky-50 rounded px-0.5 cursor-text transition-all';

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      summary && isVisible('summary') ? (
        <div
          key="summary"
          className="mb-6 bg-slate-50 p-3 rounded-r-lg border-l-2"
          style={{ borderColor: accentColor }}
          onClick={() => onSelectSection?.('summary')}
        >
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateSummary(e.currentTarget.textContent || '')}
            className={`text-xs text-slate-700 leading-relaxed ${editableClass}`}
          >
            {summary}
          </p>
        </div>
      ) : null,

    experience: () =>
      experience && experience.length > 0 && isVisible('experience') ? (
        <div key="experience" className="mb-6" onClick={() => onSelectSection?.('experience')}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b text-slate-900" style={{ color: accentColor }}>
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateExperienceItem(exp.id, 'jobTitle', e.currentTarget.textContent || '')}
                    className={`text-xs font-bold text-slate-900 ${editableClass}`}
                  >
                    {exp.jobTitle}
                  </h3>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateExperienceItem(exp.id, 'startDate', e.currentTarget.textContent || '')}
                    className={`text-[10px] text-slate-500 font-mono ${editableClass}`}
                  >
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateExperienceItem(exp.id, 'company', e.currentTarget.textContent || '')}
                  className={`text-[11px] text-slate-600 font-medium ${editableClass}`}
                >
                  {exp.company}
                </p>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateExperienceItem(exp.id, 'description', e.currentTarget.innerText || '')}
                  className={`text-[11px] text-slate-700 mt-1 whitespace-pre-line leading-relaxed ${editableClass}`}
                >
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      education && education.length > 0 && isVisible('education') ? (
        <div key="education" className="mb-6" onClick={() => onSelectSection?.('education')}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b text-slate-900" style={{ color: accentColor }}>
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateEducationItem(edu.id, 'degree', e.currentTarget.textContent || '')}
                    className={`text-xs font-bold text-slate-900 ${editableClass}`}
                  >
                    {edu.degree}
                  </h3>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateEducationItem(edu.id, 'startDate', e.currentTarget.textContent || '')}
                    className={`text-[10px] text-slate-500 font-mono ${editableClass}`}
                  >
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateEducationItem(edu.id, 'institution', e.currentTarget.textContent || '')}
                  className={`text-[11px] text-slate-600 font-medium ${editableClass}`}
                >
                  {edu.institution} {edu.gpa ? `• CGPA: ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skillCategories: () =>
      skillCategories && skillCategories.length > 0 && isVisible('skillCategories') ? (
        <div key="skillCategories" className="mb-6" onClick={() => onSelectSection?.('skillCategories')}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b text-slate-900" style={{ color: accentColor }}>
            Skills & Tech
          </h2>
          <div className="space-y-2">
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <p className="text-[10.5px] font-bold text-slate-800">{cat.categoryName}</p>
                <p className="text-[10px] text-slate-600">{cat.skills.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    projects: () =>
      projects && projects.length > 0 && isVisible('projects') ? (
        <div key="projects" className="mb-6" onClick={() => onSelectSection?.('projects')}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b text-slate-900" style={{ color: accentColor }}>
            Key Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <h3 className="text-xs font-bold text-slate-900">{proj.name}</h3>
                <p className="text-[10px] text-slate-600 line-clamp-2">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null,
  };

  const sortedKeys = [...sectionOrder].filter((k) => sectionRenderers[k]);

  return (
    <div
      className="w-full bg-white text-slate-800 p-8 shadow-sm font-sans"
      style={{
        minHeight: '297mm',
        boxSizing: 'border-box',
        fontFamily: settings.fontFamily || 'Inter, sans-serif',
      }}
    >
      {/* HEADER WITH ACCENT LEFT BAR */}
      <div className="border-l-4 pl-4 mb-6" style={{ borderColor: accentColor }} onClick={() => onSelectSection?.('personalInfo')}>
        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updatePersonalInfo('fullName', e.currentTarget.textContent || '')}
          className={`text-3xl font-extrabold text-slate-900 tracking-tight break-words max-w-full inline-block ${editableClass}`}
        >
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && (
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updatePersonalInfo('professionalTitle', e.currentTarget.textContent || '')}
            className={`text-sm font-semibold text-slate-600 mt-0.5 block ${editableClass}`}
          >
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('email', e.currentTarget.textContent || '')} className={editableClass}>
                {personalInfo.email}
              </span>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('phone', e.currentTarget.textContent || '')} className={editableClass}>
                {personalInfo.phone}
              </span>
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('location', e.currentTarget.textContent || '')} className={editableClass}>
                {personalInfo.location}
              </span>
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('website', e.currentTarget.textContent || '')} className={editableClass}>
                {personalInfo.website}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* DYNAMIC ORDERED SECTIONS */}
      {sortedKeys.map((key) => {
        const render = sectionRenderers[key];
        return render ? render() : null;
      })}
    </div>
  );
};

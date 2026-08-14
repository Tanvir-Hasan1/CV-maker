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
  const { personalInfo, summary, education, experience, skillCategories, projects, achievements, languages, interests } = data;
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

  const updateProjectItem = (id: string, field: string, val: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      projects: projects.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    });
  };

  const updateSingleProjectTech = (projId: string, techIdx: number, val: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      projects: projects.map((p) => {
        if (p.id !== projId) return p;
        const newTechs = [...(p.technologies || [])];
        if (val.includes(',')) {
          const splitTechs = val.split(',').map((s) => s.trim()).filter(Boolean);
          newTechs.splice(techIdx, 1, ...splitTechs);
        } else if (val.trim() === '') {
          newTechs.splice(techIdx, 1);
        } else {
          newTechs[techIdx] = val.trim();
        }
        return { ...p, technologies: newTechs };
      }),
    });
  };

  const updateAchievementItem = (id: string, text: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      achievements: (achievements || []).map((a) => (a.id === id ? { ...a, title: text } : a)),
    });
  };

  const updateLanguageItem = (id: string, field: 'language' | 'proficiency', val: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      languages: (languages || []).map((l) => (l.id === id ? { ...l, [field]: val } : l)),
    });
  };

  const updateInterestItem = (id: string, text: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      interests: (interests || []).map((i) => (i.id === id ? { ...i, name: text } : i)),
    });
  };

  const editableClass =
    'hover:outline hover:outline-1 hover:outline-sky-400 hover:bg-sky-50/50 focus:outline-2 focus:outline-sky-500 focus:bg-sky-50 rounded px-0.5 cursor-text transition-all';

  const renderLanguagesAndInterests = () => (
    <div className="space-y-2 text-xs text-slate-700">
      {languages && languages.length > 0 && (
        <div>
          <span className="font-bold text-slate-800">Languages: </span>
          {languages.map((l, idx) => (
            <span key={l.id} className="inline-flex items-center">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateLanguageItem(l.id, 'language', e.currentTarget.textContent || '')}
                className={editableClass}
              >
                {l.language}
              </span>
              <span className="text-slate-500 text-[10.5px] ml-0.5">({l.proficiency})</span>
              {idx < languages.length - 1 && <span className="mr-1">,</span>}
            </span>
          ))}
        </div>
      )}
      {interests && interests.length > 0 && (
        <div>
          <span className="font-bold text-slate-800">Interests: </span>
          {interests.map((i, idx) => (
            <span key={i.id} className="inline-flex items-center">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateInterestItem(i.id, e.currentTarget.textContent || '')}
                className={editableClass}
              >
                {i.name}
              </span>
              {idx < interests.length - 1 && <span className="mr-1">,</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );

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
        <div key="experience" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('experience')}>
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
        <div key="education" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('education')}>
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
        <div key="skillCategories" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('skillCategories')}>
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
        <div key="projects" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('projects')}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b text-slate-900" style={{ color: accentColor }}>
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateProjectItem(proj.id, 'name', e.currentTarget.textContent || '')}
                  className={`text-xs font-bold text-slate-900 ${editableClass}`}
                >
                  {proj.name}
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-600">
                  {proj.subtitle && (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateProjectItem(proj.id, 'subtitle', e.currentTarget.textContent || '')}
                      className={`font-medium text-slate-700 italic ${editableClass}`}
                    >
                      {proj.subtitle}
                    </span>
                  )}
                  {proj.githubUrl && (
                    <span className="flex items-center gap-1 font-mono text-slate-500">
                      <Github className="w-3 h-3 text-slate-700" />
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateProjectItem(proj.id, 'githubUrl', e.currentTarget.textContent || '')}
                        className={editableClass}
                      >
                        {proj.githubUrl}
                      </span>
                    </span>
                  )}
                  {proj.url && (
                    <span className="flex items-center gap-1 font-mono text-sky-600">
                      <Globe className="w-3 h-3 text-sky-600" />
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateProjectItem(proj.id, 'url', e.currentTarget.textContent || '')}
                        className={editableClass}
                      >
                        {proj.url}
                      </span>
                    </span>
                  )}
                </div>

                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateProjectItem(proj.id, 'description', e.currentTarget.innerText || '')}
                  className={`text-[10.5px] text-slate-700 leading-relaxed whitespace-pre-line ${editableClass}`}
                >
                  {proj.description}
                </p>

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateSingleProjectTech(proj.id, tIdx, e.currentTarget.textContent || '')}
                        className={`text-[9.5px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200 whitespace-nowrap inline-flex items-center ${editableClass}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    achievements: () =>
      achievements && achievements.length > 0 && isVisible('achievements') ? (
        <div key="achievements" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('achievements')}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b text-slate-900" style={{ color: accentColor }}>
            Achievements
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
            {achievements.map((ach) => (
              <li key={ach.id}>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateAchievementItem(ach.id, e.currentTarget.textContent || '')}
                  className={editableClass}
                >
                  {ach.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null,

    languages: () =>
      languages && languages.length > 0 && isVisible('languages') ? (
        <div key="languages" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('additional')}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b text-slate-900" style={{ color: accentColor }}>
            Languages
          </h2>
          {renderLanguagesAndInterests()}
        </div>
      ) : null,

    interests: () =>
      interests && interests.length > 0 && isVisible('interests') ? (
        <div key="interests" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('additional')}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b text-slate-900" style={{ color: accentColor }}>
            Interests
          </h2>
          {renderLanguagesAndInterests()}
        </div>
      ) : null,

    additional: () =>
      ((languages && languages.length > 0) || (interests && interests.length > 0)) && isVisible('additional') ? (
        <div key="additional" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('additional')}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b text-slate-900" style={{ color: accentColor }}>
            Languages & Interests
          </h2>
          {renderLanguagesAndInterests()}
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
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-2">
          {personalInfo.email && (
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('email', e.currentTarget.textContent || '')} className={editableClass}>
                {personalInfo.email}
              </span>
            </span>
          )}
          {personalInfo.phone && (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('phone', e.currentTarget.textContent || '')} className={editableClass}>
                {personalInfo.phone}
              </span>
            </span>
          )}
          {personalInfo.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('location', e.currentTarget.textContent || '')} className={editableClass}>
                {personalInfo.location}
              </span>
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="inline-flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="font-semibold text-slate-800">LinkedIn:</span>
              <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('linkedin', e.currentTarget.textContent || '')} className={editableClass}>
                {personalInfo.linkedin}
              </span>
            </span>
          )}
          {personalInfo.github && (
            <span className="inline-flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-slate-800 shrink-0" />
              <span className="font-semibold text-slate-800">GitHub:</span>
              <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('github', e.currentTarget.textContent || '')} className={editableClass}>
                {personalInfo.github}
              </span>
            </span>
          )}
          {personalInfo.website && (
            <span className="inline-flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="font-semibold text-slate-800">Portfolio:</span>
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

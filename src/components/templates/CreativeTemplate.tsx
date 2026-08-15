import React from 'react';
import { ResumeData } from '../../types/cv';
import { CVSettings } from '../../types/settings';
import { formatLink } from '../../utils/linkUtils';

interface TemplateProps {
  data: ResumeData;
  settings: CVSettings;
  onUpdateData?: (updated: ResumeData) => void;
  onSelectSection?: (sectionKey: string) => void;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({
  data,
  settings,
  onUpdateData,
  onSelectSection,
}) => {
  const {
    personalInfo,
    summary,
    education,
    experience,
    skillCategories,
    projects,
    achievements,
    languages,
    interests,
  } = data;
  const accentColor = settings.accentColor || '#0d9488';
  const hidden = settings.hiddenSections || [];

  const isVisible = (key: string) => !hidden.includes(key);

  const updatePersonalInfo = (field: string, val: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      personalInfo: { ...personalInfo, [field]: val },
    });
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

  const updateSkillCategoryName = (catId: string, name: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      skillCategories: skillCategories.map((c) => (c.id === catId ? { ...c, categoryName: name } : c)),
    });
  };

  const updateSingleSkill = (catId: string, skillIdx: number, val: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      skillCategories: skillCategories.map((c) => {
        if (c.id !== catId) return c;
        const newSkills = [...c.skills];
        if (val.includes(',')) {
          const splitSkills = val.split(',').map((s) => s.trim()).filter(Boolean);
          newSkills.splice(skillIdx, 1, ...splitSkills);
        } else if (val.trim() === '') {
          newSkills.splice(skillIdx, 1);
        } else {
          newSkills[skillIdx] = val.trim();
        }
        return { ...c, skills: newSkills };
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

  return (
    <div
      className="w-full bg-white text-slate-800 p-8 shadow-sm font-sans select-text"
      style={{
        minHeight: '297mm',
        boxSizing: 'border-box',
        fontFamily: settings.fontFamily || 'Outfit, sans-serif',
      }}
    >
      {/* CREATIVE HEADER */}
      <div
        className="flex justify-between items-start border-b-2 pb-5 mb-6 cursor-pointer"
        style={{ borderColor: accentColor }}
        onClick={() => onSelectSection?.('personalInfo')}
      >
        <div>
          <h1
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updatePersonalInfo('fullName', e.currentTarget.textContent || '')}
            className={`text-3xl font-extrabold tracking-tight text-slate-900 inline-block ${editableClass}`}
          >
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          {personalInfo.professionalTitle && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updatePersonalInfo('professionalTitle', e.currentTarget.textContent || '')}
              className={`text-sm font-semibold mt-1 block ${editableClass}`}
              style={{ color: accentColor }}
            >
              {personalInfo.professionalTitle}
            </p>
          )}
        </div>
        <div className="text-right text-xs space-y-1 text-slate-600 font-medium">
          {personalInfo.email && (
            <div>
              <a
                href={formatLink(personalInfo.email, 'email')}
                className="hover:underline hover:text-teal-700 inline-block"
                onClick={(e) => {
                  if ((e.target as HTMLElement).getAttribute('contenteditable') === 'true') {
                    e.stopPropagation();
                  }
                }}
              >
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updatePersonalInfo('email', e.currentTarget.textContent || '')}
                  className={editableClass}
                >
                  {personalInfo.email}
                </span>
              </a>
            </div>
          )}
          {personalInfo.phone && (
            <div>
              <a
                href={formatLink(personalInfo.phone, 'phone')}
                className="hover:underline hover:text-teal-700 inline-block"
                onClick={(e) => {
                  if ((e.target as HTMLElement).getAttribute('contenteditable') === 'true') {
                    e.stopPropagation();
                  }
                }}
              >
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updatePersonalInfo('phone', e.currentTarget.textContent || '')}
                  className={editableClass}
                >
                  {personalInfo.phone}
                </span>
              </a>
            </div>
          )}
          {personalInfo.location && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updatePersonalInfo('location', e.currentTarget.textContent || '')}
              className={editableClass}
            >
              {personalInfo.location}
            </p>
          )}
          {personalInfo.linkedin && (
            <div>
              <a
                href={formatLink(personalInfo.linkedin, 'linkedin')}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-teal-700 inline-block"
                onClick={(e) => {
                  if ((e.target as HTMLElement).getAttribute('contenteditable') === 'true') {
                    e.stopPropagation();
                  }
                }}
              >
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updatePersonalInfo('linkedin', e.currentTarget.textContent || '')}
                  className={editableClass}
                >
                  {personalInfo.linkedin}
                </span>
              </a>
            </div>
          )}
          {personalInfo.github && (
            <div>
              <a
                href={formatLink(personalInfo.github, 'github')}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-teal-700 inline-block"
                onClick={(e) => {
                  if ((e.target as HTMLElement).getAttribute('contenteditable') === 'true') {
                    e.stopPropagation();
                  }
                }}
              >
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updatePersonalInfo('github', e.currentTarget.textContent || '')}
                  className={editableClass}
                >
                  {personalInfo.github}
                </span>
              </a>
            </div>
          )}
          {personalInfo.website && (
            <div>
              <a
                href={formatLink(personalInfo.website, 'url')}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-teal-700 inline-block"
                onClick={(e) => {
                  if ((e.target as HTMLElement).getAttribute('contenteditable') === 'true') {
                    e.stopPropagation();
                  }
                }}
              >
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updatePersonalInfo('website', e.currentTarget.textContent || '')}
                  className={editableClass}
                >
                  {personalInfo.website}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && isVisible('summary') && (
        <div
          className="mb-6 bg-teal-50/50 p-4 rounded-xl border border-teal-100 cursor-pointer"
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
      )}

      {/* 2-COLUMN ASYMMETRIC GRID */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 space-y-6">
          {/* EXPERIENCE */}
          {experience && experience.length > 0 && isVisible('experience') && (
            <div className="cursor-pointer" onClick={() => onSelectSection?.('experience')}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-3 border-l" style={{ borderColor: accentColor }}>
                    <h3
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateExperienceItem(exp.id, 'jobTitle', e.currentTarget.textContent || '')}
                      className={`text-xs font-bold text-slate-900 ${editableClass}`}
                    >
                      {exp.jobTitle}
                    </h3>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateExperienceItem(exp.id, 'company', e.currentTarget.textContent || '')}
                      className={`text-[11px] font-medium text-slate-600 ${editableClass}`}
                    >
                      {exp.company}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono my-0.5">
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateExperienceItem(exp.id, 'startDate', e.currentTarget.textContent || '')}
                        className={editableClass}
                      >
                        {exp.startDate}
                      </span>
                      {' - '}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateExperienceItem(exp.id, 'endDate', e.currentTarget.textContent || '')}
                        className={editableClass}
                      >
                        {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </p>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateExperienceItem(exp.id, 'description', e.currentTarget.innerText || '')}
                      className={`text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed ${editableClass}`}
                    >
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {projects && projects.length > 0 && isVisible('projects') && (
            <div className="cursor-pointer" onClick={() => onSelectSection?.('projects')}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                Featured Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
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
                          className={`font-semibold ${editableClass}`}
                          style={{ color: accentColor }}
                        >
                          {proj.subtitle}
                        </span>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={formatLink(proj.githubUrl, 'github')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-slate-800 inline-block"
                          onClick={(e) => {
                            if ((e.target as HTMLElement).getAttribute('contenteditable') === 'true') {
                              e.stopPropagation();
                            }
                          }}
                        >
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => updateProjectItem(proj.id, 'githubUrl', e.currentTarget.textContent || '')}
                            className={`font-mono text-slate-500 ${editableClass}`}
                          >
                            {proj.githubUrl}
                          </span>
                        </a>
                      )}
                      {proj.url && (
                        <a
                          href={formatLink(proj.url, 'url')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-teal-900 inline-block"
                          onClick={(e) => {
                            if ((e.target as HTMLElement).getAttribute('contenteditable') === 'true') {
                              e.stopPropagation();
                            }
                          }}
                        >
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => updateProjectItem(proj.id, 'url', e.currentTarget.textContent || '')}
                            className={`font-mono text-teal-700 ${editableClass}`}
                          >
                            {proj.url}
                          </span>
                        </a>
                      )}
                    </div>

                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateProjectItem(proj.id, 'description', e.currentTarget.innerText || '')}
                      className={`text-[11px] text-slate-700 mt-1 whitespace-pre-line leading-relaxed ${editableClass}`}
                    >
                      {proj.description}
                    </div>

                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((tech, i) => (
                          <span
                            key={i}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => updateSingleProjectTech(proj.id, i, e.currentTarget.textContent || '')}
                            className={`text-[9px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 ${editableClass}`}
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
          )}
        </div>

        <div className="col-span-5 space-y-6">
          {/* SKILLS */}
          {skillCategories && skillCategories.length > 0 && isVisible('skillCategories') && (
            <div className="cursor-pointer" onClick={() => onSelectSection?.('skillCategories')}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                Skills & Tech
              </h2>
              <div className="space-y-3">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateSkillCategoryName(cat.id, e.currentTarget.textContent || '')}
                      className={`text-[11px] font-bold text-slate-800 mb-1 ${editableClass}`}
                    >
                      {cat.categoryName}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s, i) => (
                        <span
                          key={i}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSingleSkill(cat.id, i, e.currentTarget.textContent || '')}
                          className={`text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium whitespace-nowrap inline-flex items-center ${editableClass}`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {education && education.length > 0 && isVisible('education') && (
            <div className="cursor-pointer" onClick={() => onSelectSection?.('education')}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateEducationItem(edu.id, 'degree', e.currentTarget.textContent || '')}
                      className={`text-xs font-bold text-slate-900 ${editableClass}`}
                    >
                      {edu.degree}
                    </h3>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateEducationItem(edu.id, 'institution', e.currentTarget.textContent || '')}
                      className={`text-[11px] text-slate-600 ${editableClass}`}
                    >
                      {edu.institution}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateEducationItem(edu.id, 'startDate', e.currentTarget.textContent || '')}
                        className={editableClass}
                      >
                        {edu.startDate}
                      </span>
                      {' - '}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateEducationItem(edu.id, 'endDate', e.currentTarget.textContent || '')}
                        className={editableClass}
                      >
                        {edu.endDate}
                      </span>
                      {edu.gpa ? ` • CGPA: ${edu.gpa}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {achievements && achievements.length > 0 && isVisible('achievements') && (
            <div className="cursor-pointer" onClick={() => onSelectSection?.('achievements')}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                Achievements
              </h2>
              <div className="space-y-2 text-xs text-slate-700">
                {achievements.map((ach) => (
                  <p
                    key={ach.id}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateAchievementItem(ach.id, e.currentTarget.textContent || '')}
                    className={editableClass}
                  >
                    • {ach.title}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES & INTERESTS */}
          {((languages && languages.length > 0) || (interests && interests.length > 0)) && isVisible('additional') && (
            <div className="cursor-pointer" onClick={() => onSelectSection?.('additional')}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                Additional
              </h2>
              {languages && languages.length > 0 && (
                <div className="mb-2">
                  <p className="text-[11px] font-bold text-slate-800">Languages</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {languages.map((l) => (
                      <span
                        key={l.id}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateLanguageItem(l.id, 'language', e.currentTarget.textContent || '')}
                        className={`text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 ${editableClass}`}
                      >
                        {l.language} ({l.proficiency})
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {interests && interests.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-800">Interests</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {interests.map((i) => (
                      <span
                        key={i.id}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateInterestItem(i.id, e.currentTarget.textContent || '')}
                        className={`text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 ${editableClass}`}
                      >
                        {i.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


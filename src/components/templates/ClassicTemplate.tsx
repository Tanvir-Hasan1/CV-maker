import React from 'react';
import { ResumeData } from '../../types/cv';
import { CVSettings } from '../../types/settings';

interface TemplateProps {
  data: ResumeData;
  settings: CVSettings;
  onUpdateData?: (updated: ResumeData) => void;
  onSelectSection?: (sectionKey: string) => void;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({
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

  const hidden = settings.hiddenSections || [];
  const sectionOrder = settings.sectionOrder || ['summary', 'experience', 'education', 'skillCategories', 'projects', 'achievements', 'additional'];

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

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      summary && isVisible('summary') ? (
        <div key="summary" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('summary')}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 border-b border-slate-300 pb-0.5 text-slate-900">
            Professional Summary
          </h2>
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateSummary(e.currentTarget.textContent || '')}
            className={`text-xs leading-relaxed text-slate-800 text-justify ${editableClass}`}
          >
            {summary}
          </p>
        </div>
      ) : null,

    experience: () =>
      experience && experience.length > 0 && isVisible('experience') ? (
        <div key="experience" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('experience')}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-300 pb-0.5 text-slate-900">
            Professional Experience
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
                  <span className="text-[11px] font-sans italic text-slate-700">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateExperienceItem(exp.id, 'startDate', e.currentTarget.textContent || '')}
                      className={editableClass}
                    >
                      {exp.startDate}
                    </span>
                    {' – '}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateExperienceItem(exp.id, 'endDate', e.currentTarget.textContent || '')}
                      className={editableClass}
                    >
                      {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </span>
                </div>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateExperienceItem(exp.id, 'company', e.currentTarget.textContent || '')}
                  className={`text-[11px] italic text-slate-700 ${editableClass}`}
                >
                  {exp.company}
                </p>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateExperienceItem(exp.id, 'description', e.currentTarget.innerText || '')}
                  className={`text-xs text-slate-800 mt-1 leading-relaxed whitespace-pre-line ${editableClass}`}
                >
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      education && education.length > 0 && isVisible('education') ? (
        <div key="education" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('education')}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-300 pb-0.5 text-slate-900">
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
                  <span className="text-[11px] font-sans italic text-slate-700">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateEducationItem(edu.id, 'startDate', e.currentTarget.textContent || '')}
                      className={editableClass}
                    >
                      {edu.startDate}
                    </span>
                    {' – '}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateEducationItem(edu.id, 'endDate', e.currentTarget.textContent || '')}
                      className={editableClass}
                    >
                      {edu.endDate}
                    </span>
                  </span>
                </div>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateEducationItem(edu.id, 'institution', e.currentTarget.textContent || '')}
                  className={`text-[11px] italic text-slate-700 ${editableClass}`}
                >
                  {edu.institution} {edu.gpa ? `(CGPA: ${edu.gpa})` : ''}
                </p>
                {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                  <p className="text-[10.5px] font-sans text-slate-700 mt-0.5">
                    Coursework: {edu.relevantCoursework.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skillCategories: () =>
      skillCategories && skillCategories.length > 0 && isVisible('skillCategories') ? (
        <div key="skillCategories" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('skillCategories')}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-300 pb-0.5 text-slate-900">
            Technical & Core Skills
          </h2>
          <div className="space-y-1.5 text-xs text-slate-800">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="flex flex-wrap items-baseline gap-1">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateSkillCategoryName(cat.id, e.currentTarget.textContent || '')}
                  className={`font-bold ${editableClass}`}
                >
                  {cat.categoryName}:
                </span>
                <div className="inline-flex flex-wrap gap-1">
                  {cat.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="inline-flex items-center">
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateSingleSkill(cat.id, sIdx, e.currentTarget.textContent || '')}
                        className={editableClass}
                      >
                        {skill}
                      </span>
                      {sIdx < cat.skills.length - 1 && <span className="mr-1">,</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    projects: () =>
      projects && projects.length > 0 && isVisible('projects') ? (
        <div key="projects" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('projects')}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-300 pb-0.5 text-slate-900">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateProjectItem(proj.id, 'name', e.currentTarget.textContent || '')}
                  className={`text-xs font-bold text-slate-900 ${editableClass}`}
                >
                  {proj.name}
                </h3>

                <div className="flex flex-wrap items-center gap-x-2 text-[10.5px] text-slate-700 italic">
                  {proj.subtitle && (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateProjectItem(proj.id, 'subtitle', e.currentTarget.textContent || '')}
                      className={editableClass}
                    >
                      {proj.subtitle}
                    </span>
                  )}
                  {proj.githubUrl && (
                    <span className="font-sans text-[10px] text-slate-600 not-italic">
                      • Code:{' '}
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
                    <span className="font-sans text-[10px] text-slate-600 not-italic">
                      • Demo:{' '}
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

                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateProjectItem(proj.id, 'description', e.currentTarget.innerText || '')}
                  className={`text-xs text-slate-800 mt-0.5 leading-relaxed ${editableClass}`}
                >
                  {proj.description}
                </div>

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-[10px] font-sans italic text-slate-600 mt-0.5 flex flex-wrap items-center gap-1">
                    <span>Tools used: </span>
                    {proj.technologies.map((tech, tIdx) => (
                      <span key={tIdx} className="inline-flex items-center">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSingleProjectTech(proj.id, tIdx, e.currentTarget.textContent || '')}
                          className={editableClass}
                        >
                          {tech}
                        </span>
                        {tIdx < proj.technologies.length - 1 && <span className="mr-0.5">,</span>}
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
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-300 pb-0.5 text-slate-900">
            Key Achievements
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-800">
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

    additional: () =>
      ((languages && languages.length > 0) || (interests && interests.length > 0)) && isVisible('additional') ? (
        <div key="additional" className="mb-6 cursor-pointer" onClick={() => onSelectSection?.('additional')}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-300 pb-0.5 text-slate-900">
            Languages & Interests
          </h2>
          <div className="space-y-2 text-xs text-slate-800">
            {languages && languages.length > 0 && (
              <div>
                <span className="font-bold">Languages: </span>
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
                    <span className="text-slate-600 text-[11px] ml-0.5">({l.proficiency})</span>
                    {idx < languages.length - 1 && <span className="mr-1">,</span>}
                  </span>
                ))}
              </div>
            )}
            {interests && interests.length > 0 && (
              <div>
                <span className="font-bold">Interests: </span>
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
        </div>
      ) : null,
  };

  const sortedKeys = [...sectionOrder].filter((k) => sectionRenderers[k]);

  return (
    <div
      className="w-full bg-white text-slate-900 p-10 shadow-sm font-serif select-text"
      style={{
        minHeight: '297mm',
        boxSizing: 'border-box',
        fontFamily: settings.fontFamily || 'Merriweather, Georgia, serif',
      }}
    >
      {/* HEADER CENTERED */}
      <div
        className="text-center pb-4 mb-6 border-b-2 border-slate-900 cursor-pointer"
        onClick={() => onSelectSection?.('personalInfo')}
      >
        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updatePersonalInfo('fullName', e.currentTarget.textContent || '')}
          className={`text-3xl font-bold uppercase tracking-widest text-slate-900 inline-block ${editableClass}`}
        >
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && (
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updatePersonalInfo('professionalTitle', e.currentTarget.textContent || '')}
            className={`text-sm italic text-slate-700 mt-1 ${editableClass}`}
          >
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-800 mt-3 font-sans">
          {personalInfo.email && (
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updatePersonalInfo('email', e.currentTarget.textContent || '')}
              className={editableClass}
            >
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="inline-flex items-center gap-1.5">
              <span>•</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updatePersonalInfo('phone', e.currentTarget.textContent || '')}
                className={editableClass}
              >
                {personalInfo.phone}
              </span>
            </span>
          )}
          {personalInfo.location && (
            <span className="inline-flex items-center gap-1.5">
              <span>•</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updatePersonalInfo('location', e.currentTarget.textContent || '')}
                className={editableClass}
              >
                {personalInfo.location}
              </span>
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="inline-flex items-center gap-1.5">
              <span>•</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updatePersonalInfo('linkedin', e.currentTarget.textContent || '')}
                className={editableClass}
              >
                {personalInfo.linkedin}
              </span>
            </span>
          )}
          {personalInfo.github && (
            <span className="inline-flex items-center gap-1.5">
              <span>•</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updatePersonalInfo('github', e.currentTarget.textContent || '')}
                className={editableClass}
              >
                {personalInfo.github}
              </span>
            </span>
          )}
          {personalInfo.website && (
            <span className="inline-flex items-center gap-1.5">
              <span>•</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updatePersonalInfo('website', e.currentTarget.textContent || '')}
                className={editableClass}
              >
                {personalInfo.website}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* DYNAMIC SECTIONS */}
      {sortedKeys.map((key) => {
        const render = sectionRenderers[key];
        return render ? render() : null;
      })}
    </div>
  );
};


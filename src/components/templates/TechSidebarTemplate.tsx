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

export const TechSidebarTemplate: React.FC<TemplateProps> = ({
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
          // If user typed commas inline inside a pill, split into separate skill pills
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
      achievements: achievements.map((a) => (a.id === id ? { ...a, title: text } : a)),
    });
  };

  const updateLanguageItem = (id: string, field: 'language' | 'proficiency', val: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      languages: languages.map((l) => (l.id === id ? { ...l, [field]: val } : l)),
    });
  };

  const updateInterestItem = (id: string, text: string) => {
    if (!onUpdateData) return;
    onUpdateData({
      ...data,
      interests: interests.map((i) => (i.id === id ? { ...i, name: text } : i)),
    });
  };

  const editableClass =
    'hover:outline hover:outline-1 hover:outline-sky-400 hover:bg-sky-50/50 focus:outline-2 focus:outline-sky-500 focus:bg-sky-50 rounded px-0.5 cursor-text transition-all';

  // Render functions for right column sections
  const renderEducation = () => (
    education && education.length > 0 && isVisible('education') ? (
      <div key="education" className="mb-5" onClick={() => onSelectSection?.('education')}>
        <h2
          className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          EDUCATION
        </h2>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-start">
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateEducationItem(edu.id, 'degree', e.currentTarget.textContent || '')}
                  className={`text-xs font-bold text-slate-900 ${editableClass}`}
                >
                  {edu.degree}
                </h3>
              </div>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateEducationItem(edu.id, 'institution', e.currentTarget.textContent || '')}
                className={`text-[11px] text-slate-700 italic inline-block ${editableClass}`}
              >
                {edu.institution}{edu.location ? `, ${edu.location}` : ''}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-sky-700 font-medium my-0.5">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateEducationItem(edu.id, 'startDate', e.currentTarget.textContent || '')}
                  className={editableClass}
                >
                  {edu.startDate} - {edu.endDate || 'Present'}
                </span>
                {edu.gpa && (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateEducationItem(edu.id, 'gpa', e.currentTarget.textContent?.replace('CGPA: ', '') || '')}
                    className="px-1.5 py-0.2 rounded bg-sky-600 text-white font-bold text-[9px] hover:outline hover:outline-1 hover:outline-sky-400 focus:outline-2 focus:outline-sky-400 focus:bg-sky-700 focus:text-white cursor-text transition-all"
                  >
                    CGPA: {edu.gpa}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  const renderExperience = () => (
    experience && experience.length > 0 && isVisible('experience') ? (
      <div key="experience" className="mb-5" onClick={() => onSelectSection?.('experience')}>
        <h2
          className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          EXPERIENCE
        </h2>
        <div className="space-y-3.5">
          {experience.map((exp) => (
            <div key={exp.id}>
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
                className={`text-[11px] text-slate-700 italic block ${editableClass}`}
              >
                {exp.company}
              </p>
              <p className="text-[10px] text-sky-700 font-medium my-0.5">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateExperienceItem(exp.id, 'startDate', e.currentTarget.textContent || '')}
                  className={editableClass}
                >
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </p>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateExperienceItem(exp.id, 'description', e.currentTarget.innerText || '')}
                className={`text-[11px] text-slate-700 mt-1 leading-relaxed whitespace-pre-line ${editableClass}`}
              >
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  const renderProjects = () => (
    projects && projects.length > 0 && isVisible('projects') ? (
      <div key="projects" className="mb-5 cursor-pointer" onClick={() => onSelectSection?.('projects')}>
        <h2
          className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          PROJECTS
        </h2>
        <div className="space-y-4">
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
                    className={`font-medium text-sky-800 ${editableClass}`}
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
                      className={`text-[9.5px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 font-medium border border-sky-100 ${editableClass}`}
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
    ) : null
  );

  const rightSectionRenderers: Record<string, () => React.ReactNode> = {
    education: renderEducation,
    experience: renderExperience,
    projects: renderProjects,
  };

  const mainSectionKeys = ['education', 'experience', 'projects'];
  const sortedMainKeys = [...mainSectionKeys].sort((a, b) => {
    const idxA = sectionOrder.indexOf(a);
    const idxB = sectionOrder.indexOf(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div
      className="w-full bg-white text-slate-800 p-8 shadow-sm font-sans"
      style={{
        minHeight: '297mm',
        boxSizing: 'border-box',
        fontFamily: settings.fontFamily || 'Inter, sans-serif',
      }}
    >
      {/* HEADER SECTION */}
      <div className="text-center mb-5" onClick={() => onSelectSection?.('personalInfo')}>
        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updatePersonalInfo('fullName', e.currentTarget.textContent || '')}
          className={`text-3xl font-extrabold tracking-tight uppercase text-slate-900 mb-1 break-words max-w-full inline-block ${editableClass}`}
        >
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && (
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updatePersonalInfo('professionalTitle', e.currentTarget.textContent || '')}
            className={`text-sm font-semibold text-slate-600 mb-3 block ${editableClass}`}
          >
            {personalInfo.professionalTitle}
          </p>
        )}

        {/* CONTACT INFO ROW */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-700 mb-2">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updatePersonalInfo('email', e.currentTarget.textContent || '')}
                className={editableClass}
              >
                {personalInfo.email}
              </span>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
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
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
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
        </div>

        {/* SOCIAL LINKS ROW */}
        <div className="flex flex-wrap justify-center items-center gap-x-5 text-xs text-slate-700">
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-medium">LinkedIn:</span>
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
            <span className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5 text-slate-800" />
              <span className="font-medium">GitHub:</span>
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
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-medium">Portfolio:</span>
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

      {/* SUMMARY CALLOUT BOX */}
      {summary && isVisible('summary') && (
        <div
          className="border-t-2 border-b-2 border-slate-300 py-2.5 my-4 px-2"
          onClick={() => onSelectSection?.('summary')}
        >
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateSummary(e.currentTarget.textContent || '')}
            className={`text-xs text-slate-700 italic leading-relaxed text-justify ${editableClass}`}
          >
            {summary}
          </p>
        </div>
      )}

      {/* TWO COLUMN CONTENT LAYOUT */}
      <div className="grid grid-cols-12 gap-6 mt-4">
        {/* LEFT SIDEBAR */}
        <div className="col-span-4 border-r border-slate-200 pr-4 space-y-5">
          {/* TECHNICAL SKILLS */}
          {skillCategories && skillCategories.length > 0 && isVisible('skillCategories') && (
            <div onClick={() => onSelectSection?.('skillCategories')}>
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                TECHNICAL SKILLS
              </h2>
              <div className="space-y-3">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateSkillCategoryName(cat.id, e.currentTarget.textContent || '')}
                      className={`text-[11px] font-semibold text-slate-800 mb-1.5 inline-block ${editableClass}`}
                    >
                      {cat.categoryName}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSingleSkill(cat.id, idx, e.currentTarget.textContent || '')}
                          className={`text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium ${editableClass}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {achievements && achievements.length > 0 && isVisible('achievements') && (
            <div onClick={() => onSelectSection?.('achievements')}>
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b-2"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                ACHIEVEMENTS
              </h2>
              <ul className="list-disc list-outside ml-3 space-y-1.5 text-[11px] text-slate-700">
                {achievements.map((ach) => (
                  <li key={ach.id} className="leading-snug">
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
          )}

          {/* LANGUAGES & INTERESTS */}
          <div className="grid grid-cols-1 gap-4">
            {languages && languages.length > 0 && (isVisible('languages') || isVisible('additional')) && (
              <div onClick={() => onSelectSection?.('additional')}>
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
                  style={{ color: accentColor, borderColor: accentColor }}
                >
                  LANGUAGES
                </h2>
                <ul className="list-disc list-outside ml-3 space-y-1 text-[11px] text-slate-700">
                  {languages.map((lang) => (
                    <li key={lang.id}>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateLanguageItem(lang.id, 'language', e.currentTarget.textContent || '')}
                        className={`font-semibold text-slate-800 ${editableClass}`}
                      >
                        {lang.language}
                      </span>
                      {': '}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateLanguageItem(lang.id, 'proficiency', e.currentTarget.textContent || '')}
                        className={editableClass}
                      >
                        {lang.proficiency}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {interests && interests.length > 0 && (isVisible('interests') || isVisible('additional')) && (
              <div onClick={() => onSelectSection?.('additional')}>
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
                  style={{ color: accentColor, borderColor: accentColor }}
                >
                  INTERESTS
                </h2>
                <ul className="list-disc list-outside ml-3 space-y-1 text-[11px] text-slate-700">
                  {interests.map((int) => (
                    <li key={int.id}>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateInterestItem(int.id, e.currentTarget.textContent || '')}
                        className={editableClass}
                      >
                        {int.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT MAIN COLUMN (ORDERED DYNAMICALLY) */}
        <div className="col-span-8 space-y-5">
          {sortedMainKeys.map((key) => {
            const renderer = rightSectionRenderers[key];
            return renderer ? renderer() : null;
          })}
        </div>
      </div>
    </div>
  );
};

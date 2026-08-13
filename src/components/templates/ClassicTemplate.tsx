import React from 'react';
import { ResumeData } from '../../types/cv';
import { CVSettings } from '../../types/settings';

interface TemplateProps {
  data: ResumeData;
  settings: CVSettings;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  const { personalInfo, summary, education, experience, skillCategories, projects, achievements, languages } = data;

  return (
    <div
      className="w-full bg-white text-slate-900 p-10 shadow-sm font-serif"
      style={{
        minHeight: '297mm',
        boxSizing: 'border-box',
        fontFamily: settings.fontFamily || 'Merriweather, Georgia, serif',
      }}
    >
      {/* HEADER CENTERED */}
      <div className="text-center pb-4 mb-6 border-b-2 border-slate-900">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-slate-900">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-sm italic text-slate-700 mt-1">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-800 mt-3 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 border-b border-slate-300 pb-0.5 text-slate-900">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-800 text-justify">{summary}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-300 pb-0.5 text-slate-900">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{exp.jobTitle}</h3>
                  <span className="text-[11px] font-sans italic text-slate-700">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-[11px] italic text-slate-700">{exp.company}</p>
                <p className="text-xs text-slate-800 mt-1 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDUCATION */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-300 pb-0.5 text-slate-900">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                  <span className="text-[11px] font-sans italic text-slate-700">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <p className="text-[11px] italic text-slate-700">
                  {edu.institution} {edu.gpa ? `(CGPA: ${edu.gpa})` : ''}
                </p>
                {edu.relevantCoursework && (
                  <p className="text-[10.5px] font-sans text-slate-700 mt-0.5">
                    Coursework: {edu.relevantCoursework.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SKILLS */}
      {skillCategories && skillCategories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-300 pb-0.5 text-slate-900">
            Technical & Core Skills
          </h2>
          <div className="space-y-1.5 text-xs text-slate-800">
            {skillCategories.map((cat) => (
              <p key={cat.id}>
                <span className="font-bold">{cat.categoryName}:</span> {cat.skills.join(', ')}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* PROJECTS */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-300 pb-0.5 text-slate-900">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <h3 className="text-xs font-bold text-slate-900">{proj.name}</h3>
                <p className="text-xs text-slate-800 mt-0.5 leading-relaxed">{proj.description}</p>
                {proj.technologies && (
                  <p className="text-[10px] font-sans italic text-slate-600">
                    Tools used: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

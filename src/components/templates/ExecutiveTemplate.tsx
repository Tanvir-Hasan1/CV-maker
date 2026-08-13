import React from 'react';
import { ResumeData } from '../../types/cv';
import { CVSettings } from '../../types/settings';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  settings: CVSettings;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  const { personalInfo, summary, education, experience, skillCategories, projects, achievements } = data;
  const accentColor = settings.accentColor || '#0f172a';

  return (
    <div
      className="w-full bg-white text-slate-900 shadow-sm font-sans"
      style={{
        minHeight: '297mm',
        boxSizing: 'border-box',
        fontFamily: settings.fontFamily || 'Inter, sans-serif',
      }}
    >
      {/* EXECUTIVE TOP BANNER */}
      <div className="p-8 text-white" style={{ backgroundColor: accentColor }}>
        <h1 className="text-3xl font-extrabold tracking-tight uppercase">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-sm font-medium text-slate-200 mt-1">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-300 mt-3 pt-3 border-t border-slate-700">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5" />{personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3.5 h-3.5" />{personalInfo.github}</span>}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* EXECUTIVE SUMMARY */}
        {summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b-2 border-slate-900">
              Executive Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">{summary}</p>
          </div>
        )}

        {/* EXPERIENCE */}
        {experience && experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b-2 border-slate-900">
              Leadership & Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900">{exp.jobTitle}</h3>
                    <span className="text-[10px] font-semibold text-slate-600">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-semibold mb-1">{exp.company}</p>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION & SKILLS GRID */}
        <div className="grid grid-cols-2 gap-6">
          {education && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b-2 border-slate-900">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                    <p className="text-[11px] text-slate-700">{edu.institution}</p>
                    <p className="text-[10px] text-slate-500">{edu.startDate} - {edu.endDate} {edu.gpa ? `| CGPA: ${edu.gpa}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skillCategories && skillCategories.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b-2 border-slate-900">
                Core Competencies
              </h2>
              <div className="space-y-2">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-[11px] font-bold text-slate-800">{cat.categoryName}</p>
                    <p className="text-[10px] text-slate-600">{cat.skills.join(' • ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

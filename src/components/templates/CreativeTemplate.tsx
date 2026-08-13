import React from 'react';
import { ResumeData } from '../../types/cv';
import { CVSettings } from '../../types/settings';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  settings: CVSettings;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  const { personalInfo, summary, education, experience, skillCategories, projects, achievements } = data;
  const accentColor = settings.accentColor || '#0d9488';

  return (
    <div
      className="w-full bg-white text-slate-800 p-8 shadow-sm font-sans"
      style={{
        minHeight: '297mm',
        boxSizing: 'border-box',
        fontFamily: settings.fontFamily || 'Outfit, sans-serif',
      }}
    >
      {/* CREATIVE HEADER */}
      <div className="flex justify-between items-start border-b-2 pb-5 mb-6" style={{ borderColor: accentColor }}>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          {personalInfo.professionalTitle && (
            <p className="text-sm font-semibold mt-1" style={{ color: accentColor }}>
              {personalInfo.professionalTitle}
            </p>
          )}
        </div>
        <div className="text-right text-xs space-y-1 text-slate-600 font-medium">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>
      </div>

      {summary && (
        <div className="mb-6 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* 2-COLUMN ASYMMETRIC GRID */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 space-y-6">
          {/* EXPERIENCE */}
          {experience && experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-3 border-l" style={{ borderColor: accentColor }}>
                    <h3 className="text-xs font-bold text-slate-900">{exp.jobTitle}</h3>
                    <p className="text-[11px] font-medium text-slate-600">{exp.company}</p>
                    <p className="text-[10px] text-slate-500 font-mono my-0.5">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</p>
                    <p className="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                Featured Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900">{proj.name}</h3>
                    <p className="text-[11px] text-slate-700 mt-1">{proj.description}</p>
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((tech, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
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
          {skillCategories && skillCategories.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                Skills & Tech
              </h2>
              <div className="space-y-3">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-[11px] font-bold text-slate-800 mb-1">{cat.categoryName}</p>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
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
          {education && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                    <p className="text-[11px] text-slate-600">{edu.institution}</p>
                    <p className="text-[10px] text-slate-500">{edu.startDate} - {edu.endDate} {edu.gpa ? `• CGPA: ${edu.gpa}` : ''}</p>
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

'use client';

import React from 'react';
import { Project } from '../../../types/cv';
import { FolderCheck, Plus, Trash2, ExternalLink, Github } from 'lucide-react';

interface ProjectsFormProps {
  projects: Project[];
  onChange: (updated: Project[]) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ projects, onChange }) => {
  const handleAdd = () => {
    const newProj: Project = {
      id: 'proj-' + Date.now(),
      name: 'New Project Name',
      subtitle: 'React / Node.js Web Application',
      description: 'Built an innovative application using modern software engineering patterns.',
      technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
      githubUrl: 'github.com/username/project',
    };
    onChange([...projects, newProj]);
  };

  const handleUpdate = (id: string, field: keyof Project, value: any) => {
    onChange(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleDelete = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FolderCheck className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Featured Projects</h3>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <div key={proj.id} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-900">
              <span className="font-mono text-slate-500">#{idx + 1} {proj.name}</span>
              <button
                onClick={() => handleDelete(proj.id)}
                className="p-1 text-slate-400 hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => handleUpdate(proj.id, 'name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Subtitle / Category</label>
                <input
                  type="text"
                  value={proj.subtitle || ''}
                  onChange={(e) => handleUpdate(proj.id, 'subtitle', e.target.value)}
                  placeholder="e.g. MERN Stack Web Application"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
                  <Github className="w-3 h-3 text-slate-400" /> GitHub Link
                </label>
                <input
                  type="text"
                  value={proj.githubUrl || ''}
                  onChange={(e) => handleUpdate(proj.id, 'githubUrl', e.target.value)}
                  placeholder="github.com/user/repo"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-teal-400" /> Demo / Live Link
                </label>
                <input
                  type="text"
                  value={proj.url || ''}
                  onChange={(e) => handleUpdate(proj.id, 'url', e.target.value)}
                  placeholder="youtube.com/watch?v=..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">Description</label>
              <textarea
                value={proj.description}
                onChange={(e) => handleUpdate(proj.id, 'description', e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Technologies Used (comma separated)
              </label>
              <input
                type="text"
                value={(proj.technologies || []).join(', ')}
                onChange={(e) =>
                  handleUpdate(
                    proj.id,
                    'technologies',
                    e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="React Native, Expo, Context API, REST APIs"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

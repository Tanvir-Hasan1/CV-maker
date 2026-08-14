'use client';

import React, { useState } from 'react';
import { CVDocument } from '../../types/storage';
import { 
  FileText, Plus, Copy, Trash2, Edit3, ArrowRight, Sparkles, Clock, Check
} from 'lucide-react';

interface CVManagerProps {
  documents: CVDocument[];
  onOpen: (doc: CVDocument) => void;
  onCreateNew: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onStartOnboarding: () => void;
}

export const CVManager: React.FC<CVManagerProps> = ({
  documents,
  onOpen,
  onCreateNew,
  onDuplicate,
  onDelete,
  onRename,
  onStartOnboarding,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');

  const startRename = (doc: CVDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(doc.id);
    setRenameText(doc.title);
  };

  const saveRename = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (renameText.trim()) {
      onRename(id, renameText.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">My Resumes</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Manage your locally saved CV documents. All data remains private on this device.
          </p>
        </div>

        <button
          onClick={onStartOnboarding}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New CV</span>
        </button>
      </div>

      {/* CV GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onOpen(doc)}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 rounded-2xl p-5 shadow-sm dark:shadow-xl hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* TOP ROW */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {doc.settings?.templateId || 'tech-sidebar'}
                </span>
              </div>

              {/* TITLE OR RENAME INPUT */}
              {editingId === doc.id ? (
                <form onSubmit={(e) => saveRename(doc.id, e)} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={renameText}
                    onChange={(e) => setRenameText(e.target.value)}
                    onBlur={(e) => saveRename(doc.id, e as any)}
                    autoFocus
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-sky-500 rounded px-2 py-1 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                </form>
              ) : (
                <div className="flex items-center justify-between group/title">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors line-clamp-1">
                    {doc.title}
                  </h3>
                  <button
                    onClick={(e) => startRename(doc, e)}
                    className="opacity-0 group-hover/title:opacity-100 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    title="Rename"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* CANDIDATE SUMMARY SUBTITLE */}
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                {doc.data?.personalInfo?.fullName || 'Untitled Candidate'} &bull; {doc.data?.personalInfo?.professionalTitle || 'Resume'}
              </p>
            </div>

            {/* CARD FOOTER */}
            <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[10px]">
                <Clock className="w-3 h-3" />
                {new Date(doc.updatedAt).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onDuplicate(doc.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Duplicate CV"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {documents.length > 1 && (
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete CV"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* CREATE NEW CARD */}
        <button
          onClick={onStartOnboarding}
          className="h-full min-h-[180px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-sky-500/50 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-sky-50 dark:hover:bg-sky-950/10 p-6 flex flex-col items-center justify-center text-center transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300">Create New CV</span>
          <span className="text-xs text-slate-500 mt-1">Upload existing file or build from scratch</span>
        </button>
      </div>
    </div>
  );
};


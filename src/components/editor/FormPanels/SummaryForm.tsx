'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SummaryFormProps {
  summary: string;
  onChange: (summary: string) => void;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({ summary, onChange }) => {
  return (
    <div className="space-y-4 flex-1 flex flex-col bg-slate-900">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Professional Summary</h3>
        </div>
        <span className="text-[10px] text-slate-500">{summary.length} characters</span>
      </div>

      <textarea
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Write a concise overview of your background, core strengths, and career objectives..."
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 leading-relaxed focus:outline-none focus:border-sky-500"
      />
    </div>
  );
};

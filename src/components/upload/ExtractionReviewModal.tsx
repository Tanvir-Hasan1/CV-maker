'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, UserCheck, Briefcase, GraduationCap, Code, FolderCheck, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ParseResult } from '../../types/extraction';

interface ExtractionReviewModalProps {
  isOpen: boolean;
  parseResult: ParseResult | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExtractionReviewModal: React.FC<ExtractionReviewModalProps> = ({
  isOpen,
  parseResult,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !parseResult) return null;

  const { data, confidence, fileName } = parseResult;

  const getSectionIcon = (key: string) => {
    switch (key) {
      case 'personalInfo': return <UserCheck className="w-4 h-4 text-sky-400" />;
      case 'summary': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'experience': return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'education': return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case 'skillCategories': return <Code className="w-4 h-4 text-cyan-400" />;
      case 'projects': return <FolderCheck className="w-4 h-4 text-indigo-400" />;
      case 'achievements': return <Trophy className="w-4 h-4 text-yellow-400" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden relative"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Document Parsed: {fileName}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">We&apos;ve found your information</h2>
          <p className="text-xs text-amber-400 font-medium mt-1">
            Please review your extracted information before continuing to the editor.
          </p>
        </div>

        {/* EXTRACTED SECTIONS STATUS LIST */}
        <div className="space-y-2.5 mb-8 max-h-[320px] overflow-y-auto pr-1">
          {confidence.map((sec) => (
            <div
              key={sec.sectionKey}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60"
            >
              <div className="flex items-center gap-3">
                {getSectionIcon(sec.sectionKey)}
                <div>
                  <h4 className="text-xs font-semibold text-white">{sec.label}</h4>
                  <p className="text-[10px] text-slate-400">
                    {sec.detectedCount > 0
                      ? `${sec.detectedCount} item(s) detected`
                      : 'No structured entries found'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {sec.status === 'found' ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Found
                  </span>
                ) : sec.status === 'partial' ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    Partial
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-500 px-2.5 py-1">
                    &mdash; Optional
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Re-upload Document
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-colors shadow-lg shadow-sky-500/25"
          >
            <span>Open in CV Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

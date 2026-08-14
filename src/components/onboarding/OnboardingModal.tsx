'use client';

import React from 'react';
import { Upload, FilePlus, Sparkles, Shield, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface OnboardingModalProps {
  isOpen: boolean;
  onSelectOption: (option: 'upload' | 'scratch') => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onSelectOption,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden relative"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Subtle background gradient glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-md mx-auto mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-medium mb-4">
            <span>Next-Gen Resume</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How would you like to create your CV?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Choose how you want to get started. You remain in full control of all your data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* OPTION 1: I ALREADY HAVE A CV */}
          <button
            onClick={() => onSelectOption('upload')}
            className="group relative p-6 text-left rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-sky-500/60 hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
              I already have a CV
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Upload your existing CV (PDF, DOCX, TXT) and we&apos;ll turn it into an editable resume instantly.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>Upload Document</span>
              <span>&rarr;</span>
            </div>
          </button>

          {/* OPTION 2: CREATE FROM SCRATCH */}
          <button
            onClick={() => onSelectOption('scratch')}
            className="group relative p-6 text-left rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-teal-500/60 hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 group-hover:scale-110 transition-transform">
              <FilePlus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
              I&apos;ll create one from scratch
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Start with your information and build a professional CV step by step with live preview.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
              <span>Start Blank CV</span>
              <span>&rarr;</span>
            </div>
          </button>
        </div>

        {/* PRIVACY BADGE */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span>Your CV stays strictly on this device. Nothing is sent to external servers.</span>
        </div>
      </motion.div>
    </div>
  );
};


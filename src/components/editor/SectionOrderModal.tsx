'use client';

import React, { useState } from 'react';
import { Layers, Eye, EyeOff, ChevronUp, ChevronDown, X, Check, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface SectionOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionOrder: string[];
  hiddenSections: string[];
  onChangeOrder: (newOrder: string[]) => void;
  onToggleHideSection: (sectionKey: string) => void;
}

const LABELS: Record<string, string> = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skillCategories: 'Technical Skills',
  projects: 'Key Projects',
  achievements: 'Achievements',
  languages: 'Languages',
  interests: 'Interests',
  certifications: 'Certifications',
  volunteerExperience: 'Volunteer Experience',
  publications: 'Publications',
  customSections: 'Custom Sections',
};

export const SectionOrderModal: React.FC<SectionOrderModalProps> = ({
  isOpen,
  onClose,
  sectionOrder,
  hiddenSections,
  onChangeOrder,
  onToggleHideSection,
}) => {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sectionOrder.length) return;
    const newOrder = [...sectionOrder];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIdx, 0, moved);
    onChangeOrder(newOrder);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx !== null && draggedIdx !== targetIdx) {
      const newOrder = [...sectionOrder];
      const [moved] = newOrder.splice(draggedIdx, 1);
      newOrder.splice(targetIdx, 0, moved);
      onChangeOrder(newOrder);
    }
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col relative select-none font-sans"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL HEADER */}
        <div className="flex items-center gap-2 mb-2 pr-8 shrink-0">
          <Layers className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Reorder & Hide Sections</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 shrink-0">
          Click and hold to drag sections up or down to reorder, or toggle visibility.
        </p>

        {/* SCROLLABLE DRAGGABLE SECTION LIST CONTAINER */}
        <div className="space-y-2 mb-6 overflow-y-auto max-h-[55vh] pr-1.5 flex-1">
          {sectionOrder.map((secKey, idx) => {
            const isHidden = hiddenSections.includes(secKey);
            const isDragging = draggedIdx === idx;
            const isTarget = dragOverIdx === idx;

            return (
              <div
                key={secKey}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                  isDragging
                    ? 'opacity-30 border-dashed border-sky-500 bg-slate-800'
                    : isTarget
                    ? 'border-sky-400 bg-sky-500/15 shadow-lg shadow-sky-500/10 scale-[1.01]'
                    : isHidden
                    ? 'bg-slate-950/50 border-slate-800/50 opacity-50'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <GripVertical className="w-4 h-4 text-slate-500 hover:text-slate-300 shrink-0" />
                  <span className="text-xs font-semibold text-white truncate">
                    {LABELS[secKey] || secKey}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === sectionOrder.length - 1}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleHideSection(secKey)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isHidden
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        : 'bg-slate-700 border-slate-600 text-slate-300'
                    }`}
                    title={isHidden ? 'Show Section' : 'Hide Section'}
                  >
                    {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER DONE BUTTON */}
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 shrink-0 transition-colors"
        >
          <Check className="w-4 h-4" /> Done
        </button>
      </motion.div>
    </div>
  );
};


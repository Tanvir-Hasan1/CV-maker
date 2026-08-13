'use client';

import React, { useState } from 'react';
import { 
  FileText, Save, Download, Printer, Undo2, Redo2, ZoomIn, ZoomOut, 
  Palette, Layers, Sparkles, CheckCircle2, ChevronDown, ArrowLeft
} from 'lucide-react';
import { TemplateId } from '../../types/settings';
import { TEMPLATE_REGISTRY } from '../templates/TemplateRegistry';
import confetti from 'canvas-confetti';

interface ToolbarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  saveStatus: 'saving' | 'saved';
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  currentTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  accentColor: string;
  onSelectAccentColor: (color: string) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onExportPDF: () => void;
  onNativePrint: () => void;
  onOpenDashboard: () => void;
  onOpenReorderModal: () => void;
}

const PRESET_COLORS = [
  '#0284c7', // Sky Blue
  '#1d4ed8', // Royal Blue
  '#0d9488', // Teal
  '#059669', // Emerald
  '#7c3aed', // Purple
  '#dc2626', // Crimson
  '#0f172a', // Slate Charcoal
];

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  onTitleChange,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  currentTemplateId,
  onSelectTemplate,
  accentColor,
  onSelectAccentColor,
  zoom,
  onZoomChange,
  onExportPDF,
  onNativePrint,
  onOpenDashboard,
  onOpenReorderModal,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  const handleExportWithConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onExportPDF();
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-2 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-4 sticky top-0 z-[60] select-none">
      {/* LEFT: DASHBOARD BACK & TITLE */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          onClick={onOpenDashboard}
          className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Back to My CVs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">My CVs</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

        {/* INLINE TITLE EDITOR */}
        <div className="flex items-center gap-1.5">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="bg-slate-800 border border-sky-500 rounded px-2 py-1 text-xs font-bold text-white focus:outline-none max-w-[100px] sm:max-w-none"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-bold text-white hover:text-sky-400 transition-colors flex items-center gap-1 max-w-[110px] sm:max-w-none truncate"
            >
              <span className="truncate">{title}</span>
              <span className="text-[10px] text-slate-500 font-normal shrink-0">✎</span>
            </button>
          )}

          {/* AUTOSAVE INDICATOR */}
          <div className="hidden md:flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {saveStatus === 'saving' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-slate-300">Saved locally</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CENTER: TEMPLATE PICKER, COLOR PICKER, UNDO/REDO */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* TEMPLATE PICKER DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTemplateMenu(!showTemplateMenu);
              setShowColorPicker(false);
            }}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="max-w-[80px] sm:max-w-none truncate">{TEMPLATE_REGISTRY[currentTemplateId]?.name || 'Template'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {showTemplateMenu && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-[100] space-y-1">
              {Object.values(TEMPLATE_REGISTRY).map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    onSelectTemplate(tmpl.id);
                    setShowTemplateMenu(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-colors ${
                    currentTemplateId === tmpl.id
                      ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{tmpl.name}</span>
                    {tmpl.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-medium">
                        {tmpl.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {tmpl.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ACCENT COLOR PICKER */}
        <div className="relative">
          <button
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowTemplateMenu(false);
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-1 text-xs text-white"
            title="Choose Accent Color"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <Palette className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {showColorPicker && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 p-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-wrap gap-2 z-[100] w-max">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onSelectAccentColor(c);
                    setShowColorPicker(false);
                  }}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    accentColor === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </div>

        {/* REORDER SECTIONS BUTTON */}
        <button
          onClick={onOpenReorderModal}
          className="p-1.5 sm:p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
          title="Reorder or Hide Sections"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="hidden md:inline">Sections</span>
        </button>

        {/* UNDO / REDO */}
        <div className="flex items-center bg-slate-800 rounded-xl p-0.5 sm:p-1 border border-slate-700">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ZOOM CONTROLS */}
        <div className="hidden lg:flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs text-slate-300">
          <button
            onClick={() => onZoomChange(Math.max(0.6, zoom - 0.1))}
            className="p-1 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono text-[11px]">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => onZoomChange(Math.min(1.4, zoom + 0.1))}
            className="p-1 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* RIGHT: EXPORT PDF & PRINT BUTTONS */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onNativePrint}
          className="p-1.5 sm:p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
          title="Print Document"
        >
          <Printer className="w-4 h-4" />
        </button>

        <button
          onClick={handleExportWithConfetti}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-colors shadow-lg shadow-sky-500/25"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>
    </header>
  );
};

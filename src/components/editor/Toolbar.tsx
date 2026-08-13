'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Save, Download, Printer, Undo2, Redo2, ZoomIn, ZoomOut, 
  Palette, Layers, Sparkles, CheckCircle2, ChevronDown, ArrowLeft, Edit3, Check, Menu, X, SlidersHorizontal
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
  { hex: '#0284c7', name: 'Sky Blue' },
  { hex: '#1d4ed8', name: 'Royal Blue' },
  { hex: '#0d9488', name: 'Teal' },
  { hex: '#059669', name: 'Emerald' },
  { hex: '#7c3aed', name: 'Purple' },
  { hex: '#dc2626', name: 'Crimson' },
  { hex: '#0f172a', name: 'Slate' },
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  // Dismiss dropdowns/drawers when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
        setShowTemplateMenu(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowColorPicker(false);
        setShowTemplateMenu(false);
        setIsEditingTitle(false);
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleExportWithConfetti = () => {
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
    });
    onExportPDF();
  };

  const currentTemplate = TEMPLATE_REGISTRY[currentTemplateId] || TEMPLATE_REGISTRY['tech-sidebar'];

  return (
    <>
      <header
        ref={navRef}
        className="h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-[60] select-none font-sans"
      >
        {/* GROUP 1: DASHBOARD BACK & DOCUMENT TITLE */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenDashboard}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0 group"
            title="Return to My CVs Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform shrink-0" />
            <span className="hidden sm:inline">My CVs</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 shrink-0" />

          {/* Editable Title */}
          <div className="flex items-center gap-2 shrink-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="bg-slate-800 border border-sky-500 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none w-32 sm:w-52"
                />
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="p-1 rounded bg-sky-500 text-white hover:bg-sky-400 shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-xs font-bold text-white hover:text-sky-400 transition-colors flex items-center gap-1.5 max-w-[120px] sm:max-w-[200px] md:max-w-[280px] group truncate shrink-0"
                title="Click to rename document"
              >
                <span className="truncate">{title || 'Untitled CV'}</span>
                <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-sky-400 shrink-0" />
              </button>
            )}

            {/* Status Badge */}
            <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400 shrink-0">
              {saveStatus === 'saving' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-amber-300">Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-slate-300">Saved</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* GROUP 2: DESKTOP EXPANDED OPTIONS (VISIBLE ON DESKTOP & LAPTOP SCREENS: LG & UP) */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Template Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTemplateMenu(!showTemplateMenu);
                setShowColorPicker(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-xs font-semibold text-slate-200 transition-all"
              title="Switch Template Design"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="max-w-[120px] truncate">{currentTemplate.name}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform duration-200 ${showTemplateMenu ? 'rotate-180' : ''}`} />
            </button>

            {showTemplateMenu && (
              <div className="absolute top-full mt-2 left-0 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-[100] space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Choose Template</span>
                  <span className="text-[10px] text-sky-400 font-mono">{Object.keys(TEMPLATE_REGISTRY).length} Designs</span>
                </div>
                <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
                  {Object.values(TEMPLATE_REGISTRY).map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        onSelectTemplate(tmpl.id);
                        setShowTemplateMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all ${
                        currentTemplateId === tmpl.id ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{tmpl.name}</span>
                        {tmpl.badge && <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-medium">{tmpl.badge}</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-normal">{tmpl.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowTemplateMenu(false);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 flex items-center gap-1.5 text-xs text-slate-300 transition-all"
              title="Change Accent Color Theme"
            >
              <span className="w-3.5 h-3.5 rounded-full shadow-sm ring-1 ring-white/20" style={{ backgroundColor: accentColor }} />
              <Palette className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showColorPicker && (
              <div className="absolute top-full mt-2 left-0 p-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[100] w-56 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Accent Palette</div>
                <div className="grid grid-cols-7 gap-1.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => {
                        onSelectAccentColor(c.hex);
                        setShowColorPicker(false);
                      }}
                      className={`w-6 h-6 rounded-full transition-all ${
                        accentColor === c.hex ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110 opacity-85 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reorder Sections */}
          <button
            onClick={onOpenReorderModal}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Manage & Reorder CV Sections"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Sections</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 shrink-0" />

          {/* Undo/Redo */}
          <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/80">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-25 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-25 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/80 text-xs text-slate-300">
            <button
              onClick={() => onZoomChange(Math.max(0.6, zoom - 0.1))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-semibold text-slate-300">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => onZoomChange(Math.min(1.4, zoom + 0.1))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* GROUP 3: ACTIONS & MOBILE-ONLY ANIMATED 3-BAR HAMBURGER */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Print Button (Desktop) */}
          <button
            onClick={onNativePrint}
            className="hidden lg:flex p-2 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white transition-all shrink-0"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Quick Export PDF CTA */}
          <button
            onClick={handleExportWithConfetti}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-all shadow-lg shadow-sky-500/25 active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline shrink-0">Export PDF</span>
          </button>

          {/* 3-BAR HAMBURGER ICON BUTTON (ANIMATED 3-BAR MORPH TOGGLE FOR MOBILE/TABLET) */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-sky-500/60 hover:bg-slate-800 text-sky-400 hover:text-white transition-all duration-300 shadow-md hover:shadow-sky-500/10 active:scale-95 shrink-0 flex items-center justify-center group"
            title={isDrawerOpen ? "Close Menu" : "Open Options Menu"}
            aria-label="Toggle Options Menu"
          >
            {/* Animated 3-Bar to X Morphing Icon */}
            <div className="w-5 h-4 flex flex-col justify-between items-center transition-all duration-300">
              <span
                className={`h-0.5 w-5 rounded-full transition-all duration-300 ease-in-out transform origin-center ${
                  isDrawerOpen ? 'rotate-45 translate-y-[7px] bg-rose-400' : 'bg-sky-400 group-hover:bg-sky-300'
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full transition-all duration-300 ease-in-out ${
                  isDrawerOpen ? 'opacity-0 scale-x-0 bg-rose-400' : 'bg-sky-400 opacity-100 group-hover:bg-sky-300'
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full transition-all duration-300 ease-in-out transform origin-center ${
                  isDrawerOpen ? '-rotate-45 -translate-y-[7px] bg-rose-400' : 'bg-sky-400 group-hover:bg-sky-300'
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* RIGHT SLIDE-OUT SIDEBAR DRAWER & BACKDROP */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[99] animate-in fade-in duration-200"
          />

          {/* Slide-out Drawer */}
          <aside className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-[100] flex flex-col p-5 overflow-y-auto animate-in slide-in-from-right duration-300 font-sans">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Design & Options</h2>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-6 flex-1">
              {/* SECTION 1: TEMPLATE SELECTOR */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Resume Template</span>
                  <span className="text-[10px] text-sky-400 font-mono font-normal">{Object.keys(TEMPLATE_REGISTRY).length} Ready</span>
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {Object.values(TEMPLATE_REGISTRY).map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        onSelectTemplate(tmpl.id);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        currentTemplateId === tmpl.id
                          ? 'bg-sky-500/15 border-sky-500 text-white ring-1 ring-sky-500'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{tmpl.name}</span>
                          {tmpl.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold">
                              {tmpl.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{tmpl.description}</p>
                      </div>

                      {currentTemplateId === tmpl.id && (
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 2: ACCENT COLOR THEME */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Accent Theme Color</label>
                <div className="flex flex-wrap gap-2.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => onSelectAccentColor(c.hex)}
                      className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                        accentColor === c.hex
                          ? 'ring-2 ring-white scale-110 shadow-lg'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {accentColor === c.hex && <Check className="w-4 h-4 text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 3: SECTION ORDER & VISIBILITY */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Layout & Structure</label>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenReorderModal();
                  }}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/80 text-white font-semibold text-xs transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Reorder or Hide Sections</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* SECTION 4: HISTORY & ZOOM */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">History & Preview Zoom</label>
                
                <div className="flex items-center justify-between gap-3">
                  {/* Undo / Redo */}
                  <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 flex-1 justify-around">
                    <button
                      onClick={onUndo}
                      disabled={!canUndo}
                      className="p-2 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 flex items-center gap-1 text-xs"
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo2 className="w-4 h-4" />
                      <span>Undo</span>
                    </button>
                    <div className="h-4 w-[1px] bg-slate-700" />
                    <button
                      onClick={onRedo}
                      disabled={!canRedo}
                      className="p-2 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 flex items-center gap-1 text-xs"
                      title="Redo (Ctrl+Y)"
                    >
                      <Redo2 className="w-4 h-4" />
                      <span>Redo</span>
                    </button>
                  </div>

                  {/* Zoom */}
                  <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs text-slate-300">
                    <button
                      onClick={() => onZoomChange(Math.max(0.6, zoom - 0.1))}
                      className="p-2 hover:text-white"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="px-2 font-mono font-bold text-slate-200">{Math.round(zoom * 100)}%</span>
                    <button
                      onClick={() => onZoomChange(Math.min(1.4, zoom + 0.1))}
                      className="p-2 hover:text-white"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={onNativePrint}
                className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print Resume</span>
              </button>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  handleExportWithConfetti();
                }}
                className="w-full p-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF Resume</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};


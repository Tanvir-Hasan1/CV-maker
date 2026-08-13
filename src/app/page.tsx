'use client';

import React, { useState, useEffect } from 'react';
import { ThreeCvHero } from '../components/landing/ThreeCvHero';
import { OnboardingModal } from '../components/onboarding/OnboardingModal';
import { UploadModal } from '../components/upload/UploadModal';
import { ExtractionReviewModal } from '../components/upload/ExtractionReviewModal';
import { CVManager } from '../components/dashboard/CVManager';
import { Toolbar } from '../components/editor/Toolbar';
import { SidebarNav } from '../components/editor/SidebarNav';
import { A4PreviewPane } from '../components/preview/A4PreviewPane';
import { SectionOrderModal } from '../components/editor/SectionOrderModal';

// Form Panels
import { PersonalForm } from '../components/editor/FormPanels/PersonalForm';
import { SummaryForm } from '../components/editor/FormPanels/SummaryForm';
import { ExperienceForm } from '../components/editor/FormPanels/ExperienceForm';
import { EducationForm } from '../components/editor/FormPanels/EducationForm';
import { SkillsForm } from '../components/editor/FormPanels/SkillsForm';
import { ProjectsForm } from '../components/editor/FormPanels/ProjectsForm';
import { AchievementsForm } from '../components/editor/FormPanels/AchievementsForm';

import { cvStorageService } from '../services/storage/LocalCVStorage';
import { pdfExporter } from '../services/export/pdfExporter';
import { CVDocument } from '../types/storage';
import { ParseResult } from '../types/extraction';
import { TemplateId } from '../types/settings';
import { TEMPLATE_REGISTRY } from '../components/templates/TemplateRegistry';

import { 
  Sparkles, Shield, ArrowRight, CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [viewState, setViewState] = useState<'landing' | 'dashboard' | 'editor'>('landing');

  // Documents State
  const [documents, setDocuments] = useState<CVDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<CVDocument | null>(null);

  // Undo/Redo Stack
  const [history, setHistory] = useState<CVDocument[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // UI Modals State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);

  // Editor State
  const [activeTab, setActiveTab] = useState<string>('personalInfo');
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved'>('saved');
  const [zoom, setZoom] = useState(0.95);

  // Panel Resizing & Collapse States
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(240); // px
  const [rightPanelWidth, setRightPanelWidth] = useState(420); // px
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);

  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // Initial Load from Dexie IndexedDB
  useEffect(() => {
    cvStorageService.getAll().then((list) => {
      setDocuments(list);
    });
  }, []);

  // Panel Resizing Drag Handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft && !isLeftCollapsed) {
        const newWidth = Math.max(180, Math.min(360, e.clientX));
        setLeftSidebarWidth(newWidth);
      } else if (isResizingRight) {
        const newWidth = Math.max(300, Math.min(650, window.innerWidth - e.clientX));
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, isLeftCollapsed]);

  const handleOpenDocument = (doc: CVDocument) => {
    setActiveDocument(doc);
    setHistory([doc]);
    setHistoryIndex(0);
    setViewState('editor');
  };

  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleSelectOnboardingOption = (option: 'upload' | 'scratch') => {
    setShowOnboarding(false);
    if (option === 'upload') {
      setShowUploadModal(true);
    } else {
      cvStorageService.createEmpty('My Professional Resume').then((newDoc) => {
        setDocuments((prev) => [newDoc, ...prev]);
        handleOpenDocument(newDoc);
      });
    }
  };

  const handleExtractionComplete = (result: ParseResult) => {
    setShowUploadModal(false);
    setParseResult(result);
    setShowReviewModal(true);
  };

  const handleConfirmExtraction = () => {
    if (!parseResult) return;
    setShowReviewModal(false);

    cvStorageService
      .create({
        title: `Resume - ${parseResult.fileName.replace(/\.[^/.]+$/, '')}`,
        settings: {
          templateId: 'tech-sidebar',
          accentColor: '#0284c7',
          fontFamily: 'Inter',
          fontSize: 'md',
          lineHeight: 'normal',
          sectionOrder: [
            'summary',
            'education',
            'experience',
            'projects',
            'skillCategories',
            'achievements',
            'languages',
            'interests'
          ],
          hiddenSections: [],
          showIcons: true,
        },
        data: parseResult.data,
      })
      .then((newDoc) => {
        setDocuments((prev) => [newDoc, ...prev]);
        handleOpenDocument(newDoc);
      });
  };

  const updateActiveDocument = (updatedDoc: CVDocument) => {
    setActiveDocument(updatedDoc);
    setSaveStatus('saving');

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedDoc);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    cvStorageService.update(updatedDoc).then(() => {
      setSaveStatus('saved');
      setDocuments((prev) =>
        prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
      );
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevDoc = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setActiveDocument(prevDoc);
      cvStorageService.update(prevDoc);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextDoc = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setActiveDocument(nextDoc);
      cvStorageService.update(nextDoc);
    }
  };

  const handleDuplicateCV = async (id: string) => {
    const dup = await cvStorageService.duplicate(id);
    setDocuments((prev) => [dup, ...prev]);
  };

  const handleDeleteCV = async (id: string) => {
    await cvStorageService.delete(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleRenameCV = async (id: string, newTitle: string) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      const updated = { ...doc, title: newTitle };
      await cvStorageService.update(updated);
      setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
    }
  };

  const handleExportPDF = () => {
    pdfExporter.exportToPDF({
      elementId: 'a4-cv-preview',
      fileName: `${activeDocument?.title || 'Resume'}.pdf`,
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* MODALS */}
      <OnboardingModal
        isOpen={showOnboarding}
        onSelectOption={handleSelectOnboardingOption}
        onClose={() => setShowOnboarding(false)}
      />

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onExtractionComplete={handleExtractionComplete}
      />

      <ExtractionReviewModal
        isOpen={showReviewModal}
        parseResult={parseResult}
        onConfirm={handleConfirmExtraction}
        onCancel={() => {
          setShowReviewModal(false);
          setShowUploadModal(true);
        }}
      />

      {activeDocument && (
        <SectionOrderModal
          isOpen={showReorderModal}
          onClose={() => setShowReorderModal(false)}
          sectionOrder={activeDocument.settings.sectionOrder}
          hiddenSections={activeDocument.settings.hiddenSections}
          onChangeOrder={(newOrder) =>
            updateActiveDocument({
              ...activeDocument,
              settings: { ...activeDocument.settings, sectionOrder: newOrder },
            })
          }
          onToggleHideSection={(secKey) => {
            const hidden = activeDocument.settings.hiddenSections;
            const updatedHidden = hidden.includes(secKey)
              ? hidden.filter((k) => k !== secKey)
              : [...hidden, secKey];
            updateActiveDocument({
              ...activeDocument,
              settings: { ...activeDocument.settings, hiddenSections: updatedHidden },
            });
          }}
        />
      )}

      {/* VIEW 1: LANDING PAGE */}
      {viewState === 'landing' && (
        <div className="flex-1 flex flex-col">
          <nav className="h-20 border-b border-slate-800/80 px-6 sm:px-12 flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-sky-500/30">
                CV
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Modern CV Maker
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewState('dashboard')}
                className="text-xs font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block"
              >
                My Documents ({documents.length})
              </button>
              <button
                onClick={handleStartOnboarding}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all"
              >
                Create My CV
              </button>
            </div>
          </nav>

          <section className="relative pt-12 pb-20 px-6 sm:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
                <span>Next-Gen Resume</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Build a CV that <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">gets noticed.</span>
              </h1>

              <p className="text-base text-slate-400 leading-relaxed max-w-xl">
                Turn your existing CV into a polished, editable resume—or build one from scratch step-by-step. Real-time A4 preview, 5 professional templates, and complete privacy.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleStartOnboarding}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-sm shadow-xl shadow-sky-500/30 transition-all hover:scale-[1.02]"
                >
                  <span>Create My CV</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewState('dashboard')}
                  className="px-7 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-sm transition-all"
                >
                  Explore Dashboard
                </button>
              </div>

              <div className="flex items-center gap-4 pt-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" /> 100% Private (No Account Required)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" /> Pixel-Perfect A4 Export
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <ThreeCvHero />
            </div>
          </section>

          <section className="py-16 px-6 sm:px-12 bg-slate-900/60 border-t border-slate-800/80">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Designed by Engineers & UX Professionals
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Choose from 5 distinct templates, including the Tech Sidebar layout built for software developers and engineering graduates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.values(TEMPLATE_REGISTRY).slice(0, 3).map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={handleStartOnboarding}
                    className="group bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 shadow-xl cursor-pointer transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-sky-400">{tmpl.category}</span>
                      {tmpl.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                          {tmpl.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: DASHBOARD */}
      {viewState === 'dashboard' && (
        <div className="flex-1">
          <nav className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900">
            <div
              onClick={() => setViewState('landing')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white font-extrabold text-sm">
                CV
              </div>
              <span className="text-base font-extrabold text-white">Modern CV Maker</span>
            </div>
            <button
              onClick={() => setViewState('landing')}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              Back to Home
            </button>
          </nav>

          <CVManager
            documents={documents}
            onOpen={handleOpenDocument}
            onCreateNew={handleStartOnboarding}
            onDuplicate={handleDuplicateCV}
            onDelete={handleDeleteCV}
            onRename={handleRenameCV}
            onStartOnboarding={handleStartOnboarding}
          />
        </div>
      )}

      {/* VIEW 3: FULL EDITOR & REAL-TIME PREVIEW */}
      {viewState === 'editor' && activeDocument && (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* TOOLBAR */}
          <Toolbar
            title={activeDocument.title}
            onTitleChange={(newTitle) => updateActiveDocument({ ...activeDocument, title: newTitle })}
            saveStatus={saveStatus}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={handleUndo}
            onRedo={handleRedo}
            currentTemplateId={activeDocument.settings.templateId}
            onSelectTemplate={(templateId: TemplateId) =>
              updateActiveDocument({
                ...activeDocument,
                settings: { ...activeDocument.settings, templateId },
              })
            }
            accentColor={activeDocument.settings.accentColor}
            onSelectAccentColor={(accentColor) =>
              updateActiveDocument({
                ...activeDocument,
                settings: { ...activeDocument.settings, accentColor },
              })
            }
            zoom={zoom}
            onZoomChange={setZoom}
            onExportPDF={handleExportPDF}
            onNativePrint={() => pdfExporter.triggerNativePrint()}
            onOpenDashboard={() => setViewState('dashboard')}
            onOpenReorderModal={() => setShowReorderModal(true)}
          />

          {/* MAIN 3-COLUMN LAYOUT */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* COLUMN 1: MINIMIZABLE & RESIZABLE LEFT SIDEBAR */}
            <div
              style={{ width: isLeftCollapsed ? '60px' : `${leftSidebarWidth}px` }}
              className={`shrink-0 flex flex-col h-full bg-slate-900 border-r border-slate-800 ${
                isResizingLeft ? 'transition-none' : 'transition-[width] duration-200 ease-out'
              }`}
            >
              <SidebarNav
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                sectionOrder={activeDocument.settings.sectionOrder}
                hiddenSections={activeDocument.settings.hiddenSections}
                onOpenReorderModal={() => setShowReorderModal(true)}
                isCollapsed={isLeftCollapsed}
                onToggleCollapse={() => setIsLeftCollapsed(!isLeftCollapsed)}
              />
            </div>

            {/* DRAG DIVIDER HANDLE (LEFT SIDEBAR RESIZER) */}
            {!isLeftCollapsed && (
              <div
                onMouseDown={() => setIsResizingLeft(true)}
                className="w-1.5 bg-slate-950 hover:bg-sky-500 cursor-col-resize transition-colors z-20 shrink-0 group flex items-center justify-center"
                title="Drag to resize left sidebar"
              >
                <div className="w-0.5 h-6 bg-slate-700 group-hover:bg-white rounded" />
              </div>
            )}

            {/* COLUMN 2: REAL-TIME A4 PREVIEW PANE */}
            <div className="flex-1 relative flex flex-col min-w-0">
              <A4PreviewPane
                data={activeDocument.data}
                settings={activeDocument.settings}
                zoom={zoom}
                onUpdateData={(updatedData) =>
                  updateActiveDocument({
                    ...activeDocument,
                    data: updatedData,
                  })
                }
                onSelectSection={(secKey) => setActiveTab(secKey)}
              />
            </div>

            {/* DRAG DIVIDER HANDLE (RIGHT FORM PANEL RESIZER) */}
            <div
              onMouseDown={() => setIsResizingRight(true)}
              className="w-1.5 bg-slate-950 hover:bg-sky-500 cursor-col-resize transition-colors z-20 shrink-0 group flex items-center justify-center"
              title="Drag to resize right edit panel"
            >
              <div className="w-0.5 h-6 bg-slate-700 group-hover:bg-white rounded" />
            </div>

            {/* COLUMN 3: RIGHT FORM EDIT PANEL */}
            <div
              style={{ width: `${rightPanelWidth}px` }}
              className="bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto shrink-0 select-none relative"
            >
              {activeTab === 'personalInfo' && (
                <PersonalForm
                  data={activeDocument.data.personalInfo}
                  onChange={(personalInfo) =>
                    updateActiveDocument({
                      ...activeDocument,
                      data: { ...activeDocument.data, personalInfo },
                    })
                  }
                />
              )}

              {activeTab === 'summary' && (
                <SummaryForm
                  summary={activeDocument.data.summary || ''}
                  onChange={(summary) =>
                    updateActiveDocument({
                      ...activeDocument,
                      data: { ...activeDocument.data, summary },
                    })
                  }
                />
              )}

              {activeTab === 'experience' && (
                <ExperienceForm
                  entries={activeDocument.data.experience}
                  onChange={(experience) =>
                    updateActiveDocument({
                      ...activeDocument,
                      data: { ...activeDocument.data, experience },
                    })
                  }
                />
              )}

              {activeTab === 'education' && (
                <EducationForm
                  entries={activeDocument.data.education}
                  onChange={(education) =>
                    updateActiveDocument({
                      ...activeDocument,
                      data: { ...activeDocument.data, education },
                    })
                  }
                />
              )}

              {activeTab === 'skillCategories' && (
                <SkillsForm
                  categories={activeDocument.data.skillCategories}
                  onChange={(skillCategories) =>
                    updateActiveDocument({
                      ...activeDocument,
                      data: { ...activeDocument.data, skillCategories },
                    })
                  }
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsForm
                  projects={activeDocument.data.projects}
                  onChange={(projects) =>
                    updateActiveDocument({
                      ...activeDocument,
                      data: { ...activeDocument.data, projects },
                    })
                  }
                />
              )}

              {activeTab === 'achievements' || activeTab === 'additional' ? (
                <AchievementsForm
                  achievements={activeDocument.data.achievements}
                  onAchievementsChange={(achievements) =>
                    updateActiveDocument({
                      ...activeDocument,
                      data: { ...activeDocument.data, achievements },
                    })
                  }
                  languages={activeDocument.data.languages}
                  onLanguagesChange={(languages) =>
                    updateActiveDocument({
                      ...activeDocument,
                      data: { ...activeDocument.data, languages },
                    })
                  }
                  interests={activeDocument.data.interests}
                  onInterestsChange={(interests) =>
                    updateActiveDocument({
                      ...activeDocument,
                      data: { ...activeDocument.data, interests },
                    })
                  }
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

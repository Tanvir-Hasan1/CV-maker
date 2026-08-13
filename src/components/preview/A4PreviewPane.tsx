'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ResumeData } from '../../types/cv';
import { CVSettings } from '../../types/settings';
import { getTemplateComponent } from '../templates/TemplateRegistry';


interface A4PreviewPaneProps {
  data: ResumeData;
  settings: CVSettings;
  zoom: number;
  onUpdateData?: (updated: ResumeData) => void;
  onSelectSection?: (sectionKey: string) => void;
}

export const A4PreviewPane: React.FC<A4PreviewPaneProps> = ({
  data,
  settings,
  zoom,
  onUpdateData,
  onSelectSection,
}) => {
  const TemplateComponent = getTemplateComponent(settings.templateId);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic Scale & Pan State
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [userZoom, setUserZoom] = useState<number | null>(null);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch Gesture Tracking State
  const touchState = useRef<{
    initialDist: number;
    initialZoom: number;
    initialTouchX: number;
    initialTouchY: number;
    initialPanX: number;
    initialPanY: number;
    isPinching: boolean;
    isDragging: boolean;
  }>({
    initialDist: 0,
    initialZoom: 1,
    initialTouchX: 0,
    initialTouchY: 0,
    initialPanX: 0,
    initialPanY: 0,
    isPinching: false,
    isDragging: false,
  });

  // Calculate Auto-Fit Scale
  // Standard A4 width at 96dpi is ~794px (210mm)
  const autoFitScale = Math.max(0.35, Math.min(1.4, (containerWidth - 24) / 794));
  const activeScale = userZoom !== null ? userZoom : (containerWidth < 768 ? autoFitScale : zoom);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync with toolbar zoom prop if desktop zoom changes
  useEffect(() => {
    if (containerWidth >= 768) {
      setUserZoom(zoom);
    }
  }, [zoom, containerWidth]);

  // Touch Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2 Finger Pinch Gesture
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      touchState.current = {
        ...touchState.current,
        initialDist: dist,
        initialZoom: activeScale,
        isPinching: true,
        isDragging: false,
      };
    } else if (e.touches.length === 1) {
      // 1 Finger Pan/Drag
      const touch = e.touches[0];
      touchState.current = {
        ...touchState.current,
        initialTouchX: touch.clientX,
        initialTouchY: touch.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
        isDragging: true,
        isPinching: false,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchState.current.isPinching) {
      // Pinch Scaling
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      if (touchState.current.initialDist > 0) {
        const factor = dist / touchState.current.initialDist;
        const newZoom = Math.max(0.35, Math.min(2.5, touchState.current.initialZoom * factor));
        setUserZoom(newZoom);
      }
    } else if (e.touches.length === 1 && touchState.current.isDragging && activeScale > autoFitScale) {
      // Pan when zoomed in
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchState.current.initialTouchX;
      const deltaY = touch.clientY - touchState.current.initialTouchY;
      setPan({
        x: touchState.current.initialPanX + deltaX,
        y: touchState.current.initialPanY + deltaY,
      });
    }
  };

  const handleTouchEnd = () => {
    touchState.current.isPinching = false;
    touchState.current.isDragging = false;
  };

  const handleResetZoom = () => {
    setUserZoom(autoFitScale);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex-1 bg-slate-950 overflow-y-auto p-3 sm:p-8 flex items-start justify-center min-h-[calc(100vh-4rem)] relative select-none touch-pan-y"
    >

      {/* DOCUMENT CANVAS CONTAINER WITH TRANSFORM SCALE & PAN */}
      <div
        className="transition-transform duration-75 ease-out origin-top shadow-2xl my-auto"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${activeScale})`,
          width: '210mm',
        }}
      >
        {/* A4 DOCUMENT CANVAS TARGET FOR PDF EXPORT */}
        <div
          id="a4-cv-preview"
          className="a4-page bg-white rounded-sm overflow-hidden text-slate-900"
          style={{
            width: '210mm',
            minHeight: '297mm',
            boxSizing: 'border-box',
          }}
        >
          <TemplateComponent
            data={data}
            settings={settings}
            onUpdateData={onUpdateData}
            onSelectSection={onSelectSection}
          />
        </div>
      </div>
    </div>
  );
};

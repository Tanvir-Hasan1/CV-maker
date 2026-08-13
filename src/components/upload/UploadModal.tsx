'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, AlertCircle, X, Loader2, Sparkles, Key, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { documentExtractor } from '../../services/extraction/DocumentExtractor';
import { ruleBasedResumeParser } from '../../services/extraction/RuleBasedResumeParser';
import { GeminiResumeParser } from '../../services/extraction/GeminiResumeParser';
import { ParseResult } from '../../types/extraction';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtractionComplete: (result: ParseResult) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onExtractionComplete,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // AI Settings State
  const [useAI, setUseAI] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setUseAI(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveApiKey = (key: string) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem('gemini_api_key', trimmed);
      setUseAI(true);
      setShowApiKeyInput(false);
    } else {
      localStorage.removeItem('gemini_api_key');
      setUseAI(false);
    }
  };

  const validateAndProcessFile = async (file: File) => {
    setErrorMessage(null);
    setSelectedFile(file);
    setIsProcessing(true);
    setProgress(20);

    try {
      // Step 1: Document text extraction
      setProgress(40);
      const parsedDoc = await documentExtractor.extractText(file);

      // Step 2: Resume parsing (AI if key exists, otherwise Local Rule-Based)
      setProgress(75);
      let result: ParseResult;

      if (useAI && apiKey.trim()) {
        const geminiParser = new GeminiResumeParser(apiKey.trim());
        result = await geminiParser.parse(parsedDoc);
      } else {
        result = await ruleBasedResumeParser.parse(parsedDoc);
      }

      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        onExtractionComplete(result);
      }, 400);
    } catch (err: any) {
      console.error('File extraction error:', err);
      setIsProcessing(false);
      setProgress(0);
      setErrorMessage(
        err.message || 'We couldn\'t read this document. Try another file or enter your information manually.'
      );
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
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
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Upload Existing CV</h2>
          <p className="text-xs text-slate-400 mt-1">
            Support formats: PDF, DOCX, TXT. Local offline parsing by default.
          </p>
        </div>

        {/* OPTIONAL AI ENHANCEMENT BANNER */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${apiKey ? 'text-amber-400' : 'text-slate-400'}`} />
              <div>
                <span className="text-xs font-bold text-white">
                  {apiKey ? 'Gemini AI Extraction Enabled' : 'Use Free Gemini AI (Optional)'}
                </span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold">
                  100% Free
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{apiKey ? 'Change Key' : 'Add Free API Key'}</span>
            </button>
          </div>

          {showApiKeyInput && (
            <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
              <div className="flex items-start gap-1.5 text-[11px] text-slate-300">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  How to get your free key: Go to{' '}
                  <a
                    href="https://aistudio.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 underline font-semibold"
                  >
                    aistudio.google.com
                  </a>
                  , sign in with your Gmail, click &quot;Create API Key&quot;, and paste it below:
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste AIzaSy... key here"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={() => handleSaveApiKey(apiKey)}
                  className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DRAG AND DROP ZONE */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            dragActive
              ? 'border-sky-500 bg-sky-950/20 scale-[1.01]'
              : 'border-slate-700/80 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>

          <p className="text-sm font-semibold text-white">
            Drag and drop your CV file here
          </p>
          <p className="text-xs text-slate-400 mt-1">
            or <span className="text-sky-400 underline font-medium">browse from your device</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-3">
            Maximum file size: 10MB
          </p>
        </div>

        {/* ERROR STATE DISPLAY */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROGRESS INDICATOR */}
        {isProcessing && (
          <div className="mt-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="flex items-center gap-2 font-medium">
                <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                {useAI && apiKey ? 'Extracting with Gemini AI...' : 'Extracting CV structure...'}
              </span>
              <span className="font-mono text-sky-400">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

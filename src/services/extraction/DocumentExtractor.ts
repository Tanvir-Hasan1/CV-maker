import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { DocumentExtractor, ParsedDocument } from '../../types/extraction';
import { ResumeData } from '../../types/cv';

// Set up PDF worker URL cleanly for browser environment
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export class LocalDocumentExtractor implements DocumentExtractor {
  async extractText(file: File): Promise<ParsedDocument> {
    const fileType = file.type || '';
    const fileName = file.name;
    const fileSize = file.size;

    // Check size limit (10MB max)
    if (fileSize > 10 * 1024 * 1024) {
      throw new Error('File size exceeds the 10MB limit. Please upload a smaller document.');
    }

    let rawText = '';
    let embeddedData: ResumeData | undefined;

    if (fileType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) {
      const result = await this.extractPdf(file);
      rawText = result.text;
      embeddedData = result.embeddedData;
    } else if (
      fileType.includes('wordprocessingml') ||
      fileType.includes('msword') ||
      fileName.toLowerCase().endsWith('.docx') ||
      fileName.toLowerCase().endsWith('.doc')
    ) {
      rawText = await this.extractDocxText(file);
    } else if (fileType.includes('text') || fileName.toLowerCase().endsWith('.txt')) {
      rawText = await file.text();
    } else if (
      fileType.includes('image') ||
      ['.png', '.jpg', '.jpeg'].some((ext) => fileName.toLowerCase().endsWith(ext))
    ) {
      // Graceful OCR Fallback
      throw new Error(
        'Scanned image documents require manual entry or OCR text extraction. Please upload a text-based PDF or DOCX file.'
      );
    } else {
      throw new Error(
        'Unsupported file format. Please upload a PDF, DOCX, or TXT file.'
      );
    }

    if (!rawText.trim() && !embeddedData) {
      throw new Error('The uploaded document appears to be empty or contains no selectable text. Please ensure the document contains searchable text.');
    }

    return {
      fileName,
      fileType,
      fileSize,
      rawText: rawText.trim() || (embeddedData?.personalInfo?.fullName ? `CV for ${embeddedData.personalInfo.fullName}` : ''),
      embeddedData,
    };
  }

  private async extractPdf(file: File): Promise<{ text: string; embeddedData?: ResumeData }> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      
      let embeddedData: ResumeData | undefined;

      // 1. Check PDF Document Metadata for embedded CV Maker JSON data
      try {
        const metadata = await pdfDoc.getMetadata();
        const info = metadata?.info as Record<string, any> | undefined;
        const subject = info?.Subject || info?.subject || '';
        const keywords = info?.Keywords || info?.keywords || '';

        const dataMarker = 'CV-MAKER-DATA:';
        let encodedPayload = '';

        if (typeof subject === 'string' && subject.includes(dataMarker)) {
          encodedPayload = subject.substring(subject.indexOf(dataMarker) + dataMarker.length).trim();
        } else if (typeof keywords === 'string' && keywords.includes(dataMarker)) {
          encodedPayload = keywords.substring(keywords.indexOf(dataMarker) + dataMarker.length).trim();
        }

        if (encodedPayload) {
          const jsonStr = decodeURIComponent(atob(encodedPayload));
          embeddedData = JSON.parse(jsonStr) as ResumeData;
          console.log('%c[CV Extractor]%c ✨ Successfully extracted high-fidelity embedded CV data!', 'color: #10b981; font-weight: bold;', 'color: #34d399;');
        }
      } catch (metaErr) {
        console.warn('Could not read embedded PDF metadata:', metaErr);
      }

      // 2. Extract and reconstruct plain text with accurate spacing and lines
      let fullText = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        let lastY: number | null = null;
        let lastX: number | null = null;
        let pageStr = '';

        for (const item of textContent.items as any[]) {
          if (!item.str) continue;

          const currentX = item.transform?.[4];
          const currentY = item.transform?.[5];

          if (lastY !== null && typeof currentY === 'number') {
            // If vertical line position drops by more than 4 points, start a new line
            if (Math.abs(currentY - lastY) > 4) {
              pageStr += '\n';
              lastX = null;
            }
          }

          // If horizontal position jumps without trailing space, insert space
          if (lastX !== null && typeof currentX === 'number') {
            if (currentX > lastX + 2 && !pageStr.endsWith(' ') && !pageStr.endsWith('\n')) {
              pageStr += ' ';
            }
          }

          pageStr += item.str;
          lastY = typeof currentY === 'number' ? currentY : lastY;
          lastX = typeof currentX === 'number' && typeof item.width === 'number' ? currentX + item.width : null;
        }

        fullText += pageStr + '\n\n';
      }
      
      return {
        text: fullText,
        embeddedData,
      };
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      throw new Error('Failed to parse PDF document. The file may be password protected or corrupted.');
    }
  }

  private async extractDocxText(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (err: any) {
      console.error('DOCX parsing error:', err);
      throw new Error('Failed to parse Word document. Please try converting it to PDF or plain text.');
    }
  }
}

export const documentExtractor = new LocalDocumentExtractor();


import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { DocumentExtractor, ParsedDocument } from '../../types/extraction';

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

    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      rawText = await this.extractPdfText(file);
    } else if (
      fileType.includes('wordprocessingml') ||
      fileType.includes('msword') ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.doc')
    ) {
      rawText = await this.extractDocxText(file);
    } else if (fileType.includes('text') || fileName.endsWith('.txt')) {
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

    if (!rawText.trim()) {
      throw new Error('The uploaded document appears to be empty or contains no selectable text.');
    }

    return {
      fileName,
      fileType,
      fileSize,
      rawText,
    };
  }

  private async extractPdfText(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText;
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

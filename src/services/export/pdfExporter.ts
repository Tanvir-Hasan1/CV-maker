import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import { CVDocument } from '../../types/storage';

export interface ExportPDFOptions {
  fileName?: string;
  elementId: string;
  document?: CVDocument;
}

export class PDFExporter {
  async exportToPDF(options: ExportPDFOptions): Promise<void> {
    const { fileName = 'resume.pdf', elementId, document: cvDoc } = options;
    const sourceElement = document.getElementById(elementId);

    if (!sourceElement) {
      throw new Error(`Element with ID '${elementId}' not found for PDF export.`);
    }

    // Wait for all web fonts (Inter, Outfit, etc.) to finish layout computation
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn('Font loading check skipped:', e);
      }
    }

    // Create an unscaled, isolated off-screen staging element at exact standard A4 width
    const cloneWrapper = document.createElement('div');
    cloneWrapper.id = 'cv-export-staging-container';
    cloneWrapper.style.position = 'fixed';
    cloneWrapper.style.left = '-99999px';
    cloneWrapper.style.top = '0';
    cloneWrapper.style.width = '794px'; // 210mm at 96 DPI
    cloneWrapper.style.minHeight = '1123px'; // 297mm at 96 DPI
    cloneWrapper.style.transform = 'none';
    cloneWrapper.style.zIndex = '-9999';
    cloneWrapper.style.backgroundColor = '#ffffff';
    cloneWrapper.style.overflow = 'visible';

    const clonedContent = sourceElement.cloneNode(true) as HTMLElement;
    clonedContent.style.transform = 'none';
    clonedContent.style.width = '794px';
    clonedContent.style.minHeight = '1123px';
    clonedContent.style.boxShadow = 'none';
    clonedContent.style.margin = '0';

    cloneWrapper.appendChild(clonedContent);
    document.body.appendChild(cloneWrapper);

    try {
      // Use browser's native foreignObject SVG engine for 100% pixel-perfect text kerning, word spacing & badge layout
      let imgData = '';
      try {
        imgData = await htmlToImage.toPng(clonedContent, {
          pixelRatio: 2.0,
          backgroundColor: '#ffffff',
          cacheBust: true,
        });
      } catch (renderErr) {
        console.warn('html-to-image failed, falling back to html2canvas:', renderErr);
        const canvas = await html2canvas(clonedContent, {
          scale: 2.0,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 794,
          allowTaint: true,
        });
        imgData = canvas.toDataURL('image/png');
      }

      // Standard A4 dimensions in mm (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Embed structured CV metadata for lossless 100% accurate round-trip re-import
      if (cvDoc?.data) {
        try {
          const jsonStr = JSON.stringify(cvDoc.data);
          const encoded = btoa(encodeURIComponent(jsonStr));
          pdf.setProperties({
            title: cvDoc.title || 'Curriculum Vitae',
            subject: 'CV-MAKER-DATA:' + encoded,
            author: cvDoc.data.personalInfo?.fullName || 'CV Maker',
            keywords: 'cv-maker-document,resume,curriculum-vitae',
            creator: 'Modern CV Maker',
          });
        } catch (metaErr) {
          console.warn('Unable to embed CV data in PDF properties:', metaErr);
        }
      }

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Render first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Multi-page support if document exceeds 1 page
      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(fileName);
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback to browser native print
      window.print();
    } finally {
      // Clean up cloned staging element
      if (document.body.contains(cloneWrapper)) {
        document.body.removeChild(cloneWrapper);
      }
    }
  }

  triggerNativePrint(): void {
    window.print();
  }
}

export const pdfExporter = new PDFExporter();


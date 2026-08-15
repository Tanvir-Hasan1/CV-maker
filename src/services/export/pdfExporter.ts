import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import { CVDocument } from '../../types/storage';

export interface ExportPDFOptions {
  fileName?: string;
  elementId?: string;
  document?: CVDocument;
}

export class PDFExporter {
  /**
   * Primary Vector PDF Export (Isolated Browser Native Engine)
   * Prints ONLY the A4 CV document inside an isolated context.
   * Produces 100% vector text, real clickable hyperlinks, selectable/copyable text,
   * perfect font glyphs, and zero ATS parsing errors without UI interference.
   */
  async exportVectorPDF(options: ExportPDFOptions = {}): Promise<void> {
    const { elementId = 'a4-cv-preview', fileName = 'Resume.pdf', document: cvDoc } = options;
    const sourceElement = document.getElementById(elementId);

    if (!sourceElement) {
      window.print();
      return;
    }

    // Ensure all web fonts (Inter, Outfit, Merriweather, etc.) are finished loading
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn('Font loading check skipped:', e);
      }
    }

    const cleanTitle = (
      cvDoc?.data?.personalInfo?.fullName
        ? `${cvDoc.data.personalInfo.fullName} - Resume`
        : fileName.replace(/\.pdf$/i, '')
    ).trim();

    // Create a hidden, isolated printing iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.id = 'cv-print-isolated-iframe';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!iframeDoc || !iframe.contentWindow) {
      window.print();
      return;
    }

    // Gather all existing stylesheets and style tags from current document
    let stylesHtml = '';
    const styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
    styleElements.forEach((el) => {
      stylesHtml += el.outerHTML;
    });

    // Write isolated clean document containing ONLY the A4 resume preview
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${cleanTitle}</title>
          ${stylesHtml}
          <style>
            @page {
              size: A4 portrait;
              margin: 0mm !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #000000 !important;
              width: 210mm !important;
              min-height: 297mm !important;
              overflow: visible !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #a4-cv-preview, .a4-page {
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              transform: none !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #a4-cv-preview * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            a {
              text-decoration: none !important;
              color: inherit !important;
            }
          </style>
        </head>
        <body style="background:#ffffff;margin:0;padding:0;">
          <div id="a4-cv-preview" class="a4-page" style="width:210mm;min-height:297mm;background:#ffffff;margin:0;padding:0;">
            ${sourceElement.innerHTML}
          </div>
        </body>
      </html>
    `);
    iframeDoc.close();

    // Allow the iframe time to parse CSS and register fonts
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (iframeDoc.fonts) {
      try {
        await iframeDoc.fonts.ready;
      } catch (e) {
        console.warn('Iframe fonts check skipped:', e);
      }
    }

    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } finally {
      // Clean up the temporary iframe after print dialog interaction
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }
  }

  /**
   * Direct File Download PDF Export with Link Annotations
   * Falls back to vector print if canvas rendering is interrupted
   */
  async exportToPDF(options: ExportPDFOptions): Promise<void> {
    const { fileName = 'resume.pdf', elementId = 'a4-cv-preview', document: cvDoc } = options;
    const sourceElement = document.getElementById(elementId);

    if (!sourceElement) {
      // Fallback directly to vector print
      return this.exportVectorPDF(options);
    }

    // Wait for fonts
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

      // Embed structured CV metadata for lossless re-import
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
      
      // Inject clickable link annotations onto the PDF canvas
      this.attachClickableLinkAnnotations(pdf, clonedContent, pdfWidth);

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
      console.error('PDF export error, falling back to Vector Print:', err);
      await this.exportVectorPDF(options);
    } finally {
      if (document.body.contains(cloneWrapper)) {
        document.body.removeChild(cloneWrapper);
      }
    }
  }

  /**
   * Helper to scan all <a> links and overlay clickable PDF URI annotations
   */
  private attachClickableLinkAnnotations(pdf: jsPDF, element: HTMLElement, pdfWidth: number): void {
    try {
      const containerRect = element.getBoundingClientRect();
      const pxToMm = pdfWidth / (containerRect.width || 794);

      const links = element.querySelectorAll('a');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) return;

        const rect = link.getBoundingClientRect();
        const x = (rect.left - containerRect.left) * pxToMm;
        const y = (rect.top - containerRect.top) * pxToMm;
        const w = rect.width * pxToMm;
        const h = rect.height * pxToMm;

        if (w > 0 && h > 0) {
          pdf.link(x, y, w, h, { url: href });
        }
      });
    } catch (e) {
      console.warn('Link annotation overlay error:', e);
    }
  }

  triggerNativePrint(fileName?: string): void {
    this.exportVectorPDF({ fileName });
  }
}

export const pdfExporter = new PDFExporter();

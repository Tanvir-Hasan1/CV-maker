import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportPDFOptions {
  fileName?: string;
  elementId: string;
}

export class PDFExporter {
  async exportToPDF(options: ExportPDFOptions): Promise<void> {
    const { fileName = 'resume.pdf', elementId } = options;
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found for PDF export.`);
    }

    try {
      // Create high resolution canvas from A4 preview container
      const canvas = await html2canvas(element, {
        scale: 2.5, // High crispness for retina text
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, // Standard 96 DPI A4 width in pixels
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      // A4 dimensions in mm (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Render first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Multi-page support if document exceeds 1 page
      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(fileName);
    } catch (err) {
      console.error('Canvas PDF export error:', err);
      // Fallback to browser print trigger
      window.print();
    }
  }

  triggerNativePrint(): void {
    window.print();
  }
}

export const pdfExporter = new PDFExporter();

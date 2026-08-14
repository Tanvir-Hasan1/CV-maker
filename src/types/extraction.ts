import { ResumeData } from './cv';

export interface ParsedDocument {
  fileName: string;
  fileType: string;
  fileSize: number;
  rawText: string;
  embeddedData?: ResumeData;
}

export type ExtractionStatus = 'found' | 'partial' | 'missing' | 'warning';

export interface SectionConfidence {
  sectionKey: keyof ResumeData;
  label: string;
  status: ExtractionStatus;
  detectedCount: number;
}

export interface ParseResult {
  data: ResumeData;
  confidence: SectionConfidence[];
  rawText: string;
  fileName: string;
}

export interface ResumeParser {
  parse(document: ParsedDocument): Promise<ParseResult>;
}

export interface DocumentExtractor {
  extractText(file: File): Promise<ParsedDocument>;
}

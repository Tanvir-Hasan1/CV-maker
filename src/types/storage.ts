import { ResumeData } from './cv';
import { CVSettings } from './settings';

export interface CVDocument {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  data: ResumeData;
  settings: CVSettings;
}

export interface CVStorage {
  getAll(): Promise<CVDocument[]>;
  getById(id: string): Promise<CVDocument | null>;
  create(doc: Omit<CVDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<CVDocument>;
  update(doc: CVDocument): Promise<void>;
  delete(id: string): Promise<void>;
  duplicate(id: string): Promise<CVDocument>;
}

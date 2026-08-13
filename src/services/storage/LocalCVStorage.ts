import Dexie, { Table } from 'dexie';
import { CVDocument, CVStorage } from '../../types/storage';
import { SAMPLE_CV } from './sampleCV';
import { DEFAULT_CV_SETTINGS } from '../../types/settings';

class CVMakerDatabase extends Dexie {
  cvs!: Table<CVDocument, string>;

  constructor() {
    super('CVMakerDatabase');
    this.version(1).stores({
      cvs: 'id, title, updatedAt, createdAt'
    });
  }
}

const db = new CVMakerDatabase();

export class LocalCVStorage implements CVStorage {
  async getAll(): Promise<CVDocument[]> {
    const list = await db.cvs.orderBy('updatedAt').reverse().toArray();
    if (list.length === 0) {
      // Seed initial sample CV on first launch
      await db.cvs.add(SAMPLE_CV);
      return [SAMPLE_CV];
    }
    return list;
  }

  async getById(id: string): Promise<CVDocument | null> {
    const doc = await db.cvs.get(id);
    if (!doc && id === SAMPLE_CV.id) {
      await db.cvs.add(SAMPLE_CV);
      return SAMPLE_CV;
    }
    return doc || null;
  }

  async create(docInput: Omit<CVDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<CVDocument> {
    const now = new Date().toISOString();
    const newDoc: CVDocument = {
      ...docInput,
      id: 'cv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: now,
      updatedAt: now,
    };
    await db.cvs.add(newDoc);
    return newDoc;
  }

  async update(doc: CVDocument): Promise<void> {
    const updated = {
      ...doc,
      updatedAt: new Date().toISOString()
    };
    await db.cvs.put(updated);
  }

  async delete(id: string): Promise<void> {
    await db.cvs.delete(id);
  }

  async duplicate(id: string): Promise<CVDocument> {
    const original = await this.getById(id);
    if (!original) {
      throw new Error(`CV document with ID ${id} not found`);
    }

    const now = new Date().toISOString();
    const duplicated: CVDocument = {
      ...original,
      id: 'cv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: `${original.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    await db.cvs.add(duplicated);
    return duplicated;
  }

  async createEmpty(title: string = 'Untitled CV'): Promise<CVDocument> {
    return this.create({
      title,
      settings: DEFAULT_CV_SETTINGS,
      data: {
        personalInfo: {
          fullName: 'John Doe',
          professionalTitle: 'Software Engineer',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          linkedin: 'linkedin.com/in/johndoe',
          github: 'github.com/johndoe'
        },
        summary: 'Driven and innovative professional with a passion for building scalable digital solutions.',
        experience: [],
        education: [],
        skillCategories: [],
        skills: [],
        projects: [],
        achievements: [],
        languages: [],
        interests: [],
        certifications: [],
        volunteerExperience: [],
        publications: [],
        customSections: []
      }
    });
  }
}

export const cvStorageService = new LocalCVStorage();

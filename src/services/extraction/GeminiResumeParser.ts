import { ResumeData } from '../../types/cv';
import { ParsedDocument, ParseResult, ResumeParser, SectionConfidence } from '../../types/extraction';

export class GeminiResumeParser implements ResumeParser {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  }

  /**
   * Dynamically fetch available models for this specific API key that support generateContent
   */
  private async getAvailableModels(): Promise<string[]> {
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
      const res = await fetch(listUrl);
      if (!res.ok) throw new Error('Could not list models');
      const data = await res.json();
      
      const models: any[] = data.models || [];
      const validModelNames = models
        .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m) => m.name.replace('models/', '')); // e.g. "gemini-1.5-flash"

      if (validModelNames.length > 0) {
        // Prioritize flash models, then 2.0 / 1.5 variants
        validModelNames.sort((a, b) => {
          if (a.includes('flash') && !b.includes('flash')) return -1;
          if (!a.includes('flash') && b.includes('flash')) return 1;
          return 0;
        });
        return validModelNames;
      }
    } catch (e) {
      console.warn('Model auto-discovery fallback:', e);
    }

    // Static fallback list if ListModels API fails
    return [
      'gemini-1.5-flash',
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash-latest',
      'gemini-pro'
    ];
  }

  async parse(doc: ParsedDocument): Promise<ParseResult> {
    if (doc.embeddedData) {
      console.log('🤖 Restoring resume directly from high-fidelity embedded data');
      return {
        data: doc.embeddedData,
        confidence: [
          { sectionKey: 'personalInfo', label: 'Personal Information', status: 'found', detectedCount: 4 },
          { sectionKey: 'summary', label: 'Professional Summary', status: doc.embeddedData.summary ? 'found' : 'missing', detectedCount: doc.embeddedData.summary ? 1 : 0 },
          { sectionKey: 'education', label: 'Education', status: doc.embeddedData.education?.length ? 'found' : 'missing', detectedCount: doc.embeddedData.education?.length || 0 },
          { sectionKey: 'experience', label: 'Work Experience', status: doc.embeddedData.experience?.length ? 'found' : 'missing', detectedCount: doc.embeddedData.experience?.length || 0 },
          { sectionKey: 'skillCategories', label: 'Technical Skills', status: doc.embeddedData.skillCategories?.length ? 'found' : 'missing', detectedCount: doc.embeddedData.skillCategories?.length || 0 },
          { sectionKey: 'projects', label: 'Projects', status: doc.embeddedData.projects?.length ? 'found' : 'missing', detectedCount: doc.embeddedData.projects?.length || 0 },
          { sectionKey: 'achievements', label: 'Achievements', status: doc.embeddedData.achievements?.length ? 'found' : 'missing', detectedCount: doc.embeddedData.achievements?.length || 0 },
        ],
        rawText: doc.rawText,
        fileName: doc.fileName,
      };
    }

    if (!this.apiKey) {
      throw new Error('Please enter a free Gemini API key to enable AI extraction.');
    }

    console.log('🤖 Sending document text to Google Gemini AI API...');
    const candidateModels = await this.getAvailableModels();

    const prompt = `You are an expert AI resume parser. Extract structured resume information from the raw document text below and format it strictly as a single JSON object.

RAW DOCUMENT TEXT:
"""
${doc.rawText}
"""

JSON OUTPUT SCHEMA (Respond ONLY with valid JSON):
{
  "personalInfo": {
    "fullName": "Full Name",
    "professionalTitle": "Title or Degree",
    "email": "email@example.com",
    "phone": "+123456789",
    "location": "City, Country",
    "website": "portfolio url",
    "linkedin": "linkedin url",
    "github": "github url"
  },
  "summary": "Concise professional summary",
  "education": [
    {
      "id": "edu-1",
      "degree": "Degree Name",
      "institution": "University/College",
      "location": "City",
      "startDate": "2020",
      "endDate": "2024",
      "gpa": "3.77/4.00",
      "relevantCoursework": ["Course 1", "Course 2"]
    }
  ],
  "experience": [
    {
      "id": "exp-1",
      "jobTitle": "Job Title",
      "company": "Company Name",
      "startDate": "2022",
      "endDate": "Present",
      "isCurrent": true,
      "description": "• Bullet point 1\\n• Bullet point 2"
    }
  ],
  "skillCategories": [
    {
      "id": "sc-1",
      "categoryName": "Programming Languages",
      "skills": ["JavaScript", "Python"]
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "Project Name",
      "subtitle": "Category or Subtitle",
      "description": "Detailed project description",
      "technologies": ["React", "Node.js"],
      "githubUrl": "github link",
      "url": "demo link"
    }
  ],
  "achievements": [
    { "id": "ach-1", "title": "Achievement Title" }
  ],
  "languages": [
    { "id": "lang-1", "language": "English", "proficiency": "Fluent" }
  ],
  "interests": [
    { "id": "int-1", "name": "Interest Name" }
  ]
}`;

    let lastError = '';

    for (const modelName of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          lastError = errorData.error?.message || `Status ${response.status}`;
          continue; // Try next available model in list
        }

        const jsonResult = await response.json();
        const rawJsonText = jsonResult.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        
        const parsedData: ResumeData = JSON.parse(rawJsonText);

        parsedData.experience = parsedData.experience || [];
        parsedData.education = parsedData.education || [];
        parsedData.skillCategories = parsedData.skillCategories || [];
        parsedData.skills = parsedData.skills || [];
        parsedData.projects = parsedData.projects || [];
        parsedData.achievements = parsedData.achievements || [];
        parsedData.languages = parsedData.languages || [];
        parsedData.interests = parsedData.interests || [];
        parsedData.certifications = [];
        parsedData.volunteerExperience = [];
        parsedData.publications = [];
        parsedData.customSections = [];

        const confidence: SectionConfidence[] = [
          { sectionKey: 'personalInfo', label: 'Personal Information', status: 'found', detectedCount: 1 },
          { sectionKey: 'summary', label: 'Professional Summary', status: parsedData.summary ? 'found' : 'missing', detectedCount: parsedData.summary ? 1 : 0 },
          { sectionKey: 'experience', label: 'Work Experience', status: parsedData.experience.length > 0 ? 'found' : 'missing', detectedCount: parsedData.experience.length },
          { sectionKey: 'education', label: 'Education', status: parsedData.education.length > 0 ? 'found' : 'missing', detectedCount: parsedData.education.length },
          { sectionKey: 'skillCategories', label: 'Technical Skills', status: parsedData.skillCategories.length > 0 ? 'found' : 'missing', detectedCount: parsedData.skillCategories.length },
          { sectionKey: 'projects', label: 'Projects', status: parsedData.projects.length > 0 ? 'found' : 'missing', detectedCount: parsedData.projects.length },
        ];

        return {
          data: parsedData,
          confidence,
          rawText: doc.rawText,
          fileName: doc.fileName,
        };
      } catch (err: any) {
        lastError = err.message;
      }
    }

    throw new Error(`AI Extraction Failed: ${lastError}`);
  }
}

import { ResumeData, Experience, Education, SkillCategory, Project, Achievement, Language, Interest } from '../../types/cv';
import { ParsedDocument, ParseResult, ResumeParser, SectionConfidence } from '../../types/extraction';

export class RuleBasedResumeParser implements ResumeParser {
  async parse(doc: ParsedDocument): Promise<ParseResult> {
    const text = doc.rawText;
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    // 1. Personal Information Extraction
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
    const email = emailMatch ? emailMatch[0] : '';

    const phoneMatch = text.match(/(\+?\d{1,4}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    const linkedinMatch = text.match(/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    const linkedin = linkedinMatch ? linkedinMatch[0] : '';

    const githubMatch = text.match(/(www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
    const github = githubMatch ? githubMatch[0] : '';

    // Heuristics for clean name & title extraction
    let fullName = 'Your Name';
    let rawNameLine = '';

    // Find the first line that is an actual candidate name (skip document headers like Europass, Resume, etc.)
    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      const l = lines[i].trim();
      const upper = l.toUpperCase();
      if (
        !upper.includes('CURRICULUM VITAE') &&
        !upper.includes('EUROPASS') &&
        !upper.includes('RESUME') &&
        !upper.includes('PERSONAL INFORMATION') &&
        !upper.includes('PAGE') &&
        !l.includes('@') &&
        !l.includes('http') &&
        !/\d{5,}/.test(l)
      ) {
        rawNameLine = l;
        break;
      }
    }

    if (rawNameLine) {
      // Strip out common metadata headers attached in Europass / PDF text dumps
      const metadataKeywords = [
        'DATE OF BIRTH', 'DOB', 'PLACE OF BIRTH', 'NATIONALITY', 'GENDER',
        'PHONE NUMBER', 'PHONE', 'EMAIL ADDRESS', 'EMAIL', 'ADDRESS', 'LOCATION',
        'WEBSITE', 'LINKEDIN', 'GITHUB'
      ];

      for (const kw of metadataKeywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        const matchIdx = rawNameLine.search(regex);
        if (matchIdx !== -1) {
          rawNameLine = rawNameLine.substring(0, matchIdx);
        }
      }

      rawNameLine = rawNameLine.replace(/[|•,:\-_]/g, ' ').replace(/\s+/g, ' ').trim();

      if (rawNameLine.length > 40) {
        rawNameLine = rawNameLine.split(' ').slice(0, 3).join(' ');
      }

      fullName = rawNameLine || 'Your Name';
    }

    // Clean location / address extraction
    const locationMatch = text.match(/(?:ADDRESS|LOCATION|PLACE OF BIRTH):\s*([^.\n;]+)/i);
    const location = locationMatch ? locationMatch[1].trim() : '';

    const professionalTitle = lines.length > 1 && !lines[1].includes('@') && lines[1].length < 60
      ? lines[1]
      : 'Professional Title';

    // 2. Section Partitioning
    const sectionsMap = this.partitionSections(text);

    // Parse specific sections
    const summary = this.parseSummary(sectionsMap['SUMMARY'] || sectionsMap['PROFILE'] || sectionsMap['OBJECTIVE'] || '');
    const experience = this.parseExperience(sectionsMap['EXPERIENCE'] || sectionsMap['WORK EXPERIENCE'] || '');
    const education = this.parseEducation(sectionsMap['EDUCATION'] || sectionsMap['ACADEMIC'] || '');
    const skillCategories = this.parseSkillCategories(sectionsMap['SKILLS'] || sectionsMap['TECHNICAL SKILLS'] || '');
    const projects = this.parseProjects(sectionsMap['PROJECTS'] || '');
    const achievements = this.parseAchievements(sectionsMap['ACHIEVEMENTS'] || sectionsMap['HONORS'] || '');
    const languages = this.parseLanguages(sectionsMap['LANGUAGES'] || '');
    const interests = this.parseInterests(sectionsMap['INTERESTS'] || sectionsMap['HOBBIES'] || '');

    const data: ResumeData = {
      personalInfo: {
        fullName,
        professionalTitle,
        email,
        phone,
        location: location || '',
        linkedin,
        github,
      },
      summary: summary || (lines.slice(2, 5).join(' ').substring(0, 300)),
      experience,
      education,
      skillCategories,
      skills: [],
      projects,
      achievements,
      languages,
      interests,
      certifications: [],
      volunteerExperience: [],
      publications: [],
      customSections: [],
    };

    // Calculate confidence / status indicators
    const confidence: SectionConfidence[] = [
      {
        sectionKey: 'personalInfo',
        label: 'Personal Information',
        status: email || phone ? 'found' : 'partial',
        detectedCount: (fullName ? 1 : 0) + (email ? 1 : 0) + (phone ? 1 : 0) + (linkedin ? 1 : 0),
      },
      {
        sectionKey: 'summary',
        label: 'Professional Summary',
        status: data.summary ? 'found' : 'missing',
        detectedCount: data.summary ? 1 : 0,
      },
      {
        sectionKey: 'experience',
        label: 'Work Experience',
        status: experience.length > 0 ? 'found' : 'missing',
        detectedCount: experience.length,
      },
      {
        sectionKey: 'education',
        label: 'Education',
        status: education.length > 0 ? 'found' : 'missing',
        detectedCount: education.length,
      },
      {
        sectionKey: 'skillCategories',
        label: 'Technical Skills',
        status: skillCategories.length > 0 ? 'found' : 'missing',
        detectedCount: skillCategories.reduce((acc, c) => acc + c.skills.length, 0),
      },
      {
        sectionKey: 'projects',
        label: 'Projects',
        status: projects.length > 0 ? 'found' : 'missing',
        detectedCount: projects.length,
      },
      {
        sectionKey: 'achievements',
        label: 'Achievements',
        status: achievements.length > 0 ? 'found' : 'missing',
        detectedCount: achievements.length,
      },
    ];

    return {
      data,
      confidence,
      rawText: text,
      fileName: doc.fileName,
    };
  }

  private partitionSections(rawText: string): Record<string, string> {
    const sectionKeywords = [
      'TECHNICAL SKILLS',
      'SKILLS',
      'EXPERIENCE',
      'WORK EXPERIENCE',
      'EDUCATION',
      'PROJECTS',
      'ACHIEVEMENTS',
      'LANGUAGES',
      'INTERESTS',
      'SUMMARY',
      'PROFILE',
      'CERTIFICATIONS',
    ];

    const regex = new RegExp(`\\b(${sectionKeywords.join('|')})\\b`, 'gi');
    const matches: { keyword: string; index: number }[] = [];
    let match;

    while ((match = regex.exec(rawText)) !== null) {
      matches.push({ keyword: match[1].toUpperCase(), index: match.index });
    }

    const sections: Record<string, string> = {};
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const next = matches[i + 1];
      const start = current.index + current.keyword.length;
      const end = next ? next.index : rawText.length;
      sections[current.keyword] = rawText.substring(start, end).trim();
    }

    return sections;
  }

  private parseSummary(text: string): string {
    return text.split('\n').map((l) => l.trim()).filter(Boolean).join(' ').substring(0, 500);
  }

  private parseExperience(text: string): Experience[] {
    if (!text) return [];
    const entries = text.split(/\n(?=[A-Z0-9\s]{3,}\n|\b(20\d\d|19\d\d|Present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b)/i);
    
    return entries.slice(0, 5).map((entry, idx) => {
      const lines = entry.split('\n').map((l) => l.trim()).filter(Boolean);
      const title = lines[0] || 'Position Title';
      const company = lines[1] || 'Company Name';
      const desc = lines.slice(2).join('\n') || 'Role description and accomplishments.';

      return {
        id: `exp-ext-${idx}-${Date.now()}`,
        jobTitle: title,
        company,
        startDate: '2022',
        endDate: 'Present',
        isCurrent: true,
        description: desc,
      };
    });
  }

  private parseEducation(text: string): Education[] {
    if (!text) return [];
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return [];

    return [
      {
        id: `edu-ext-${Date.now()}`,
        degree: lines[0] || 'Bachelor of Science',
        institution: lines[1] || 'University Name',
        startDate: '2020',
        endDate: '2024',
        description: lines.slice(2).join('\n'),
      },
    ];
  }

  private parseSkillCategories(text: string): SkillCategory[] {
    if (!text) return [];
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const categories: SkillCategory[] = [];

    let currentCategory = 'General Skills';
    let currentSkills: string[] = [];

    for (const line of lines) {
      if (line.includes(':') || line.length < 35 && !line.includes(',')) {
        if (currentSkills.length > 0) {
          categories.push({
            id: `sc-ext-${categories.length}-${Date.now()}`,
            categoryName: currentCategory,
            skills: currentSkills,
          });
          currentSkills = [];
        }
        currentCategory = line.replace(':', '').trim();
      } else {
        const items = line.split(/[,•|]/).map((s) => s.trim()).filter((s) => s.length > 0);
        currentSkills.push(...items);
      }
    }

    if (currentSkills.length > 0) {
      categories.push({
        id: `sc-ext-${categories.length}-${Date.now()}`,
        categoryName: currentCategory,
        skills: currentSkills,
      });
    }

    return categories;
  }

  private parseProjects(text: string): Project[] {
    if (!text) return [];
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return [];

    return [
      {
        id: `proj-ext-${Date.now()}`,
        name: lines[0] || 'Featured Project',
        subtitle: lines[1] || '',
        description: lines.slice(2).join('\n'),
        technologies: ['React', 'TypeScript', 'Node.js'],
      },
    ];
  }

  private parseAchievements(text: string): Achievement[] {
    if (!text) return [];
    const items = text.split('\n').map((l) => l.replace(/^[•\-\*]\s*/, '').trim()).filter((l) => l.length > 5);
    return items.map((title, idx) => ({
      id: `ach-ext-${idx}-${Date.now()}`,
      title,
    }));
  }

  private parseLanguages(text: string): Language[] {
    if (!text) return [];
    const lines = text.split('\n').map((l) => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
    return lines.map((line, idx) => {
      const parts = line.split(':');
      return {
        id: `lang-ext-${idx}-${Date.now()}`,
        language: parts[0] || line,
        proficiency: parts[1] ? parts[1].trim() : 'Fluent',
      };
    });
  }

  private parseInterests(text: string): Interest[] {
    if (!text) return [];
    const lines = text.split('\n').map((l) => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
    return lines.map((name, idx) => ({
      id: `int-ext-${idx}-${Date.now()}`,
      name,
    }));
  }
}

export const ruleBasedResumeParser = new RuleBasedResumeParser();

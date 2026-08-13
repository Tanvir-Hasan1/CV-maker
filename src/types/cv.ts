export interface PersonalInfo {
  fullName: string;
  professionalTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photoUrl?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description: string;
  highlights?: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
  relevantCoursework?: string[];
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[]; // e.g. ["JavaScript", "React.js", "C/C++"]
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  proficiency?: number; // 1 to 5 scale optional
}

export interface Project {
  id: string;
  name: string;
  subtitle?: string; // e.g. "React Native / Expo Mobile Application"
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: string; // e.g., Native, Fluent, Intermediate
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
}

export interface Interest {
  id: string;
  name: string;
}

export interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher?: string;
  releaseDate?: string;
  url?: string;
  summary?: string;
}

export interface CustomSectionEntry {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  entries: CustomSectionEntry[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skillCategories: SkillCategory[]; // Grouped skills like in Tanvir Hasan's CV
  skills: Skill[]; // Flat list fallback
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  interests: Interest[];
  volunteerExperience: VolunteerExperience[];
  publications: Publication[];
  customSections: CustomSection[];
}

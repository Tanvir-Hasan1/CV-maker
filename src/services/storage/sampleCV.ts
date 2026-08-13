import { CVDocument } from '../../types/storage';

export const SAMPLE_CV: CVDocument = {
  id: 'sample-resume',
  title: 'Software Developer Resume',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    templateId: 'tech-sidebar',
    accentColor: '#0284c7',
    fontFamily: 'Inter',
    fontSize: 'md',
    lineHeight: 'normal',
    sectionOrder: [
      'summary',
      'education',
      'experience',
      'projects',
      'skillCategories',
      'achievements',
      'languages',
      'interests'
    ],
    hiddenSections: [],
    showIcons: true,
  },
  data: {
    personalInfo: {
      fullName: 'ALEX MORGAN',
      professionalTitle: 'Full-Stack Software Engineer',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexmorgan',
      github: 'github.com/alexmorgan',
      website: 'alexmorgan.dev',
    },
    summary:
      'Innovative Full-Stack Software Engineer with 4+ years of experience designing scalable web and mobile applications. Skilled in React, Node.js, TypeScript, and cloud services, with a proven track record of optimizing application performance and delivering modern user interfaces.',
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        startDate: 'September 2019',
        endDate: 'May 2023',
        gpa: '3.85/4.00',
        relevantCoursework: [
          'Data Structures & Algorithms',
          'Distributed Systems',
          'Database Management Systems',
          'Web Architecture',
          'Software Engineering'
        ]
      }
    ],
    experience: [
      {
        id: 'exp-1',
        jobTitle: 'Software Engineer',
        company: 'Apex Tech Solutions',
        startDate: 'June 2023',
        endDate: 'Present',
        isCurrent: true,
        description:
          '• Architected responsive web dashboards using React.js and TypeScript, increasing user engagement by 35%\n• Built RESTful microservices with Node.js and MongoDB, handling over 100K daily active requests\n• Mentored junior engineers and led weekly code review sessions to enforce high code quality standards'
      }
    ],
    skillCategories: [
      {
        id: 'sc-1',
        categoryName: 'Programming Languages',
        skills: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL']
      },
      {
        id: 'sc-2',
        categoryName: 'Frontend Technologies',
        skills: ['React.js', 'Next.js', 'Tailwind CSS', 'HTML5/CSS3', 'Redux Toolkit']
      },
      {
        id: 'sc-3',
        categoryName: 'Backend Technologies',
        skills: ['Node.js', 'Express.js', 'GraphQL', 'REST APIs']
      },
      {
        id: 'sc-4',
        categoryName: 'Databases & Cloud',
        skills: ['MongoDB', 'PostgreSQL', 'Redis', 'AWS', 'Docker']
      },
      {
        id: 'sc-5',
        categoryName: 'Tools & Workflows',
        skills: ['Git/GitHub', 'CI/CD Pipelines', 'VS Code', 'Postman', 'Figma']
      }
    ],
    skills: [],
    projects: [
      {
        id: 'proj-1',
        name: 'CloudPulse - Infrastructure Monitoring Platform',
        subtitle: 'Full-Stack Web Application',
        description:
          'Built a real-time cloud resource monitoring dashboard with live WebSocket telemetry, alert notification triggers, and automated system health reporting.',
        technologies: ['React.js', 'Node.js', 'WebSockets', 'Tailwind CSS', 'Docker'],
        githubUrl: 'github.com/alexmorgan/cloudpulse',
        url: 'cloudpulse-demo.example.com'
      },
      {
        id: 'proj-2',
        name: 'DevFlow - Mobile Developer Community App',
        subtitle: 'React Native Cross-Platform App',
        description:
          'Developed a mobile platform for software developers to share snippets, solve code challenges, and track tech industry trends with offline storage support.',
        technologies: ['React Native', 'Expo', 'GraphQL', 'AsyncStorage'],
        githubUrl: 'github.com/alexmorgan/devflow'
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Awarded First Place at Bay Area Hackathon 2024 for AI Code Reviewer tool'
      },
      {
        id: 'ach-2',
        title: 'Graduated Magna Cum Laude with a 3.85 CGPA in Computer Science'
      }
    ],
    languages: [
      { id: 'lang-1', language: 'English', proficiency: 'Native' },
      { id: 'lang-2', language: 'Spanish', proficiency: 'Intermediate' }
    ],
    interests: [
      { id: 'int-1', name: 'Open Source Contribution' },
      { id: 'int-2', name: 'Cloud Architecture & DevOps' },
      { id: 'int-3', name: 'UI/UX Interaction Design' }
    ],
    certifications: [],
    volunteerExperience: [],
    publications: [],
    customSections: []
  }
};

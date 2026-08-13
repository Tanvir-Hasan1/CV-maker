import { CVDocument } from '../../types/storage';

export const SAMPLE_CV: CVDocument = {
  id: 'sample-tanvir-hasan',
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
      fullName: 'TANVIR HASAN',
      professionalTitle: 'Computer Science & Engineering Graduate',
      email: 'thasan762@gmail.com',
      phone: '01521584563',
      location: 'Dhaka, Bangladesh',
      linkedin: 'www.linkedin.com/in/Tanvir-Hasan1',
      github: 'www.github.com/Tanvir-Hasan1',
    },
    summary:
      'Recent Computer Science graduate with strong foundation in data structures, algorithms, and programming fundamentals seeking a challenging position as a Software Developer in a good tech environment where I can utilize my problem-solving skills and technical knowledge to contribute to innovative projects while continuing to grow professionally.',
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science in Computer Science & Engineering',
        institution: 'United International University (UIU)',
        location: 'Dhaka',
        startDate: 'October 2020',
        endDate: '2025',
        gpa: '3.77/4.00',
        relevantCoursework: [
          'Data Structures & Algorithms',
          'Software Engineering',
          'Database Management Systems',
          'Web Technologies',
          'Object-Oriented Programming',
          'Computer Networks'
        ]
      }
    ],
    experience: [
      {
        id: 'exp-1',
        jobTitle: 'Undergraduate Teaching Assistant (UGA)',
        company: 'United International University, Department of CSE',
        startDate: 'September 2023',
        endDate: '2025',
        isCurrent: false,
        description:
          '• Assist faculty members in conducting lab sessions for programming courses\n• Help students debug code and understand programming concepts\n• Grade assignments and provide constructive feedback to students\n• Support junior students in Computer Science fundamentals and problem-solving'
      }
    ],
    skillCategories: [
      {
        id: 'sc-1',
        categoryName: 'Programming Languages',
        skills: ['JavaScript', 'Java', 'C/C++', 'Python']
      },
      {
        id: 'sc-2',
        categoryName: 'Frontend Technologies',
        skills: ['React.js', 'React Native', 'HTML5', 'CSS3', 'JavaScript ES6+']
      },
      {
        id: 'sc-3',
        categoryName: 'Backend Technologies',
        skills: ['Node.js', 'Express.js', 'REST APIs']
      },
      {
        id: 'sc-4',
        categoryName: 'Databases',
        skills: ['MongoDB', 'MySQL']
      },
      {
        id: 'sc-5',
        categoryName: 'Tools & Technologies',
        skills: ['Git/GitHub', 'VS Code', 'Postman', 'npm/yarn', 'Figma']
      },
      {
        id: 'sc-6',
        categoryName: 'Concepts',
        skills: ['Data Structures', 'Algorithms', 'OOP', 'SDLC']
      }
    ],
    skills: [],
    projects: [
      {
        id: 'proj-1',
        name: 'AutoPulse - Vehicle Management Mobile Application',
        subtitle: 'React Native / Expo Mobile Application',
        description:
          'Developed a comprehensive vehicle management application using React Native and Expo framework. Implemented secure user authentication, vehicle documentation management system, marketplace for vehicle parts, and real-time fuel consumption tracking.',
        technologies: ['React Native', 'Expo', 'Context API', 'JWT Authentication', 'REST APIs'],
        githubUrl: 'www.github.com/Tanvir-Hasan1/AutoPulse'
      },
      {
        id: 'proj-2',
        name: 'CampusCycle - Campus Management System',
        subtitle: 'MERN Stack Web Application',
        description:
          'Built a comprehensive campus management system with features for student registration, course management, academic tracking, and administrative functions. Implemented responsive design with modern web technologies.',
        technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
        githubUrl: 'www.github.com/Tanvir-Hasan1/campus_cycle'
      },
      {
        id: 'proj-3',
        name: 'RongMistry - AI-Powered Color Overlap Detection & Correction Robot',
        subtitle: 'Deep Learning & Robotics Project',
        description:
          'Developed an innovative smart robot using YOLOv3 deep learning technology for automated color overlap detection and correction on flat surfaces. Created custom dataset and integrated hardware components including gear motors, servo motors, pumps, and ESP32 camera.',
        technologies: ['YOLOv3', 'Deep Learning', 'Computer Vision', 'ESP32', 'Custom Dataset'],
        url: 'www.youtube.com/watch?v=SodRiUS-Wwg'
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Maintained CGPA of 3.77 throughout undergraduate studies'
      },
      {
        id: 'ach-2',
        title: 'Selected as Undergraduate Teaching Assistant based on academic performance'
      },
      {
        id: 'ach-3',
        title: 'Successfully tutored 20+ students in programming and mathematics'
      }
    ],
    languages: [
      { id: 'lang-1', language: 'Bengali', proficiency: 'Native' },
      { id: 'lang-2', language: 'English', proficiency: 'Fluent' }
    ],
    interests: [
      { id: 'int-1', name: 'AI Integrated Applications' },
      { id: 'int-2', name: 'Exploring New Technologies' },
      { id: 'int-3', name: 'Large Language Models (LLM)' }
    ],
    certifications: [],
    volunteerExperience: [],
    publications: [],
    customSections: []
  }
};

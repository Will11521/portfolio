// Nerve AI Knowledge Base - Williamjeet Singh's Resume Data

export interface KnowledgeBase {
  personal: {
    name: string;
    title: string;
    location: string;
    education: string;
    bio: string;
  };
  skills: {
    frontend: string[];
    backend: string[];
    design: string[];
    aiml: string[];
    tools: string[];
  };
  projects: {
    name: string;
    description: string;
    tech: string[];
    highlights: string[];
    link?: string;
    keywords?: string[];
  }[];
  experience: {
    role: string;
    company: string;
    period: string;
    achievements: string[];
  }[];
  resume: {
    url: string;
    summary: string[];
  };
  interests: string[];
  funFacts: string[];
  certifications: string[];
  contact: {
    email: string;
    phone: string;
    website: string;
    location: string;
    calendly?: string;
  };
}

export const knowledgeBase: KnowledgeBase = {
  personal: {
    name: "Williamjeet Singh",
    title: "Designer, Developer & Creative Technologist",
    location: "Ottawa, Ontario, Canada",
    education: "Self-taught designer & developer with relentless curiosity and 72-hour redesign marathons",
    bio: "Designer, developer, and accidental therapist. I build digital experiences that feel like quiet conversations, not flashy lectures. My work combines technical mastery with deep empathy — creating calming interfaces with clever code. I believe in emotionally intelligent design where every interface tells a story worth experiencing.",
  },
  
  skills: {
    frontend: [
      "HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", 
      "Tailwind CSS", "Motion/Framer Motion", "Vue.js", "Fetch API", "Responsive Design"
    ],
    backend: [
      "Python", "Flask", "Node.js", "FastAPI", "Supabase", "MongoDB",
      "RESTful APIs", "Socket.io", "Express.js"
    ],
    design: [
      "Figma", "Canva", "Adobe XD", "Prototyping", "Wireframing",
      "UI/UX Design", "Design Systems", "Motion Design", "Typography"
    ],
    aiml: [
      "Python", "Flask", "TextBlob", "GPT integration", "OpenAI API",
      "TensorFlow", "LangChain", "Natural Language Processing", "AI Integration"
    ],
    tools: [
      "Git/GitHub", "Google Analytics", "GTM", "Looker Studio", "SEO",
      "VS Code", "Notion", "Vercel", "Chrome DevTools", "Postman"
    ]
  },

  projects: [
    {
      name: "DreamSynth",
      description: "An AI-powered dream journal that analyzes patterns and provides insights into your subconscious mind through beautiful visualizations.",
      tech: ["React", "Flask", "OpenAI", "D3.js"],
      highlights: [
        "Integrated GPT-4 for dream pattern analysis",
        "Created custom data visualizations with D3.js",
        "Designed intuitive journaling interface",
        "Implemented secure user authentication"
      ],
      link: "https://will11521.github.io/dreamsynth-frontend/",
      keywords: ["dreamsynth", "dream", "sleep", "journal", "ai"]
    },
    {
      name: "Analytics Dashboard",
      description: "Real-time data visualization platform with customizable widgets, interactive charts, and predictive analytics for business intelligence.",
      tech: ["Next.js", "TypeScript", "Recharts", "TailwindCSS"],
      highlights: [
        "Built real-time data streaming with WebSockets",
        "Designed responsive dashboard with 15+ widget types",
        "Implemented drag-and-drop customization",
        "Optimized for performance with React Server Components"
      ],
      link: "https://will11521.github.io/analytics-by-william/",
      keywords: ["analytics", "dashboard", "data", "business intelligence", "widgets"]
    },
    {
      name: "EchoLink",
      description: "Social platform connecting creative professionals through collaborative projects, featuring real-time chat and portfolio sharing.",
      tech: ["React", "Node.js", "Socket.io", "MongoDB"],
      highlights: [
        "Developed real-time messaging system",
        "Built collaborative project workspace",
        "Designed portfolio showcase system",
        "Implemented user matching algorithm"
      ],
      link: "https://www.figma.com/proto/qtE2hczc0tLQzhd4pDeMxG/Untitled?node-id=2-37&starting-point-node-id=2%3A37",
      keywords: ["echolink", "collaboration", "chat", "accessibility", "ai"]
    },
    {
      name: "The System",
      description: "Personal productivity suite that adapts to your workflow, combining task management, time tracking, and habit formation.",
      tech: ["Vue.js", "Supabase", "Figma", "Notion API"],
      highlights: [
        "Integrated Notion API for seamless syncing",
        "Built adaptive workflow engine",
        "Designed minimalist, distraction-free UI",
        "Implemented gamification for habit tracking"
      ],
      link: "https://will11521.github.io/MidT/",
      keywords: ["the system", "productivity", "workflow", "css", "space"]
    },
    {
      name: "Online Therapy Website",
      description: "Mental health support platform designed to feel safe, calm, and approachable for people seeking therapy.",
      tech: ["HTML", "CSS", "JavaScript"],
      highlights: [
        "Crafted a calming visual system with accessible typography and color",
        "Optimized responsive layouts to keep the experience consistent across devices",
        "Structured content to guide visitors toward booking support quickly"
      ],
      link: "https://will11521.github.io/mtm6201_final/",
      keywords: ["therapy", "mental health", "online therapy", "counseling", "support"]
    },
    {
      name: "Nerve (Me!)",
      description: "Personal AI assistant trained to answer questions about William's work, skills, and projects using natural language processing.",
      tech: ["Python", "TensorFlow", "LangChain", "FastAPI"],
      highlights: [
        "Custom-trained on William's portfolio and resume",
        "Natural conversational interface",
        "Context-aware responses",
        "Integrated with portfolio website"
      ],
      link: "https://williamdev.is-a.dev/",
      keywords: ["nerve", "chatbot", "assistant", "ai", "portfolio"]
    }
  ],

  experience: [
    {
      role: "AI Intern",
      company: "Square Root Technologies Inc.",
      period: "Mar 2025 - May 2025",
      achievements: [
        "Developed AI-powered business intelligence prototypes using Python, Flask, and TextBlob",
        "Designed UI dashboards and integrated external BI platforms for data-driven insights",
        "Automated decision-support tools to improve merchant engagement and sales strategies",
        "Completed AI-Driven Customer Service Enhancement certification through Riipen"
      ]
    },
    {
      role: "Supervisor",
      company: "Booster Juice",
      period: "Mar 2024 - Present",
      achievements: [
        "Supervised shifts and led a team during peak operations in Ottawa, ON",
        "Managed scheduling, delegation, and conflict resolution",
        "Enhanced leadership, communication, and problem-solving skills in a fast-paced environment",
        "Maintained high team morale and customer satisfaction"
      ]
    },
    {
      role: "Social Media Manager",
      company: "Brazily Fitness Inc.",
      period: "Mar 2024 - June 2024",
      achievements: [
        "Managed Instagram & Facebook content creation; boosted engagement by 30%",
        "Designed branded graphics and campaigns aligned with brand identity",
        "Collaborated directly with the founder to refine digital marketing strategy",
        "Completed Social Media Strategic Engagement certification through Riipen"
      ]
    }
  ],

  resume: {
    url: "/Williamjeet%20Singh.pdf",
    summary: [
      "Designer & developer blending cinematic storytelling with engineering discipline.",
      "Current AI Intern at Square Root Technologies building AI-powered decision-support prototypes.",
      "Leadership and marketing experience from Booster Juice and Brazily Fitness with measurable impact."
    ]
  },

  interests: [
    "Emotionally intelligent design",
    "Creating safe digital spaces",
    "Quiet conversations not flashy lectures",
    "Calming interfaces",
    "Late-night Figma sessions",
    "Lo-fi music while designing",
    "Redesigning portfolios at 3AM until they're perfect",
    "Spending time with my golden lab in India",
    "Booster Juice as brain fuel",
    "Cinematic web design",
    "AI and machine learning",
    "Motion design and animations",
    "Design systems",
    "Business intelligence and analytics"
  ],
  
  funFacts: [
    "I believe in emotionally intelligent design — interfaces should feel like safe spaces.",
    "My golden lab back in India has been with me since she was 20 days old. She's basically family.",
    "I think better with Booster Juice in hand. Brain fuel? Maybe.",
    "Lo-fi + midnight = design zone. That's the rule.",
    "I once spent 72 hours redesigning my entire portfolio... then did it again. Perfectionism runs deep.",
    "Often called an 'accidental therapist' — turns out designing calm spaces attracts deep conversations.",
    "I build digital experiences that feel like quiet conversations, not flashy lectures.",
    "Calming interfaces, clever code, and the occasional late-night Figma binge — that's my vibe."
  ],
  
  certifications: [
    "Google Certification",
    "AI-Driven Customer Service Enhancement (Square Root Technologies, Riipen, 2025)",
    "Social Media Strategic Engagement (Brazily Fitness Inc., Riipen, 2024)",
    "School of Hard Knocks: 72-Hour Portfolio Redesign Marathon (2024-2025)"
  ],
  
  contact: {
    email: "Williamjeetsingh2004@gmail.com",
    phone: "+1 437-872-1500",
    website: "https://williamdev.is-a.dev/",
    location: "Ottawa, Ontario, Canada",
    calendly: "https://calendly.com/williamjeetsingh2004"
  }
};

// Response patterns for intelligent conversation
export const responsePatterns = {
  greeting: [
    "Hey! I'm Nerve, William's personal AI assistant. I'm trained on his entire portfolio and resume. Ask me about his work, experience, skills, or anything else!",
    "Hello! I'm Nerve — William's AI sidekick. Want to know about his projects, certifications, work experience, or fun facts? Just ask!",
    "Hi there! I'm Nerve, trained to answer anything about William. Try asking about his AI internship, design philosophy, or that golden lab in India!"
  ],

  skills: {
    triggers: ["skill", "technology", "tech stack", "know", "programming", "code", "language"],
    responses: [
      `William has a diverse tech stack! On the frontend, he's proficient in ${knowledgeBase.skills.frontend.slice(0, 5).join(", ")}, and more. For backend, he works with ${knowledgeBase.skills.backend.slice(0, 4).join(", ")}.`,
      `He's skilled in both design and development. His design tools include ${knowledgeBase.skills.design.slice(0, 4).join(", ")}, while his development skills span ${knowledgeBase.skills.frontend.slice(0, 3).join(", ")}, and ${knowledgeBase.skills.backend.slice(0, 3).join(", ")}.`,
      `William is particularly strong in AI/ML technologies like ${knowledgeBase.skills.aiml.slice(0, 3).join(", ")}, plus frontend frameworks like React and Next.js.`
    ]
  },

  projects: {
    triggers: ["project", "work", "built", "created", "portfolio", "dreamsynth", "analytics", "echolink", "system", "therapy"],
    responses: [
      `William has built some amazing projects! My favorites are DreamSynth (an AI-powered dream journal), an Analytics Dashboard with real-time data viz, EchoLink (a creative collaboration platform), and The System (a smart productivity suite).`,
      `His projects showcase his range: from AI integration in DreamSynth to real-time features in EchoLink, data visualization in the Analytics Dashboard, and workflow automation in The System.`,
      `Check out his projects! Each one combines beautiful design with solid engineering. Want to know more about a specific project?`
    ]
  },

  experience: {
    triggers: ["experience", "background", "education", "study", "school", "college", "learn", "work", "job", "intern"],
    responses: [
      `William is a self-taught creative technologist who's currently an AI Intern at Square Root Technologies, developing AI-powered business intelligence prototypes! He believes in learning by doing — and redesigning... and redesigning again.`,
      `He has diverse experience: AI Intern at Square Root Technologies (working with Python, Flask, TextBlob), Supervisor at Booster Juice (leadership), and Social Media Manager at Brazily Fitness (boosted engagement by 30%).`,
      `William is self-taught with an obsessive attention to detail. He once spent 72 hours redesigning his portfolio... twice. He's gained real-world experience in AI development, team leadership, and digital marketing.`,
      `His background includes hands-on tech experience as an AI Intern at Square Root Technologies, leadership at Booster Juice, and social media management at Brazily Fitness. He's a relentless learner who thrives on creative challenges.`
    ]
  },

  contact: {
    triggers: ["contact", "hire", "reach", "email", "connect", "available", "work with", "phone", "call"],
    responses: [
      `You can reach William at ${knowledgeBase.contact.email} or call him at ${knowledgeBase.contact.phone}. He's always open to interesting opportunities!`,
      "Want to work together? Scroll down to the Contact section to send a message or schedule a meeting directly with William!",
      `He'd love to hear from you! Email him at ${knowledgeBase.contact.email} or check out the Contact section below to book a time to chat.`,
      `William is based in ${knowledgeBase.contact.location}. You can reach him via email at ${knowledgeBase.contact.email} or through the contact form on this page.`
    ]
  },

  personality: {
    triggers: ["who", "about", "personality", "like", "person", "character"],
    responses: [
      `${knowledgeBase.personal.bio} He's also known as an 'Accidental Therapist' because he genuinely cares about the people he works with!`,
      "William is a creative problem-solver who loves pushing the boundaries of what's possible on the web. He's detail-oriented, collaborative, and always experimenting with new ideas.",
      "He's passionate about creating experiences that feel magical. Whether it's smooth animations, intelligent AI features, or thoughtful UX design, he sweats the details."
    ]
  },

  interests: {
    triggers: ["interest", "hobby", "passion", "enjoy", "fun", "outside", "fact", "personal"],
    responses: [
      `${knowledgeBase.funFacts[0]} He's also a big fan of lo-fi music, late-night design sessions, and his golden lab back in India!`,
      `Fun fact: ${knowledgeBase.funFacts[2]} He also studied psychology at Yale to better understand user behavior!`,
      `${knowledgeBase.funFacts[7]} Plus, he thinks better with Booster Juice in hand and lo-fi music playing!`,
      `William believes in emotionally intelligent design. His interests include ${knowledgeBase.interests.slice(0, 3).join(", ")}, and ${knowledgeBase.interests.slice(8, 10).join(", ")}.`
    ]
  },

  design: {
    triggers: ["design", "ui", "ux", "interface", "visual", "aesthetic", "style", "figma"],
    responses: [
      `William specializes in cinematic web design with Apple-level polish. He uses tools like ${knowledgeBase.skills.design.slice(0, 4).join(", ")} to create stunning interfaces.`,
      "His design philosophy centers on motion, depth, and intuitive interactions. He believes every pixel and animation should serve a purpose.",
      "William creates design systems that scale. From typography to motion patterns, he thinks holistically about user experience."
    ]
  },

  ai: {
    triggers: ["ai", "artificial intelligence", "machine learning", "ml", "gpt", "openai", "nerve", "textblob", "flask"],
    responses: [
      `William is currently an AI Intern at Square Root Technologies! He's developed AI-powered business intelligence prototypes using Python, Flask, and TextBlob. Plus, he built me (Nerve)!`,
      `He's passionate about AI/ML. At Square Root Technologies, he automated decision-support tools and integrated BI platforms. He also works with ${knowledgeBase.skills.aiml.slice(0, 4).join(", ")}.`,
      "AI/ML is central to his work. From business intelligence automation to GPT integration in projects like DreamSynth, he uses AI to solve real-world problems.",
      "William has hands-on AI experience through his internship at Square Root Technologies, where he designed UI dashboards and built AI prototypes for merchant engagement."
    ]
  },

  certifications: {
    triggers: ["certification", "certificate", "credential", "qualified", "training", "course", "google", "riipen"],
    responses: [
      `William has several certifications: ${knowledgeBase.certifications.slice(0, 2).join(", ")}. Plus, he's survived the legendary 72-Hour Portfolio Redesign Marathon!`,
      "He's certified in AI-Driven Customer Service Enhancement (Square Root Technologies), Social Media Strategic Engagement (Brazily Fitness), and has a Google certification. He's also a perfectionist who redesigns until it's right!",
      `His certifications include Google, AI-driven customer service, and social media strategy. But his real credential? The relentless pursuit of pixel-perfect design, even if it takes 72 hours.`
    ]
  },

  analytics: {
    triggers: ["analytics", "data", "google analytics", "gtm", "looker", "seo", "marketing"],
    responses: [
      "William has strong analytics skills! He's proficient in Google Analytics, GTM (Google Tag Manager), Looker Studio, and SEO optimization.",
      "At Brazily Fitness, he boosted social media engagement by 30% using data-driven strategies. He also works with Google Analytics and Looker Studio for insights.",
      "His analytics toolkit includes Google Analytics, GTM, Looker Studio, and SEO. He combines these with his AI skills to create data-driven solutions."
    ]
  },

  leadership: {
    triggers: ["leadership", "team", "manage", "supervisor", "lead", "collaboration"],
    responses: [
      "William has hands-on leadership experience as a Supervisor at Booster Juice, where he managed shifts, scheduling, delegation, and conflict resolution during peak operations.",
      "He's developed strong leadership skills through supervising teams at Booster Juice and collaborating with founders at Brazily Fitness. He excels at communication and problem-solving.",
      "Leadership is one of his strengths! He's supervised teams in fast-paced environments, managed social media campaigns directly with company founders, and led collaborative design projects."
    ]
  },

  default: [
    "That's an interesting question! I know a lot about William's projects, skills, education, experience, and certifications. What specifically would you like to know?",
    "I'm trained on William's entire portfolio and resume. Try asking about his projects, technical skills, AI work, leadership experience, or background!",
    "Hmm, I'm not sure about that specific thing, but I can tell you about William's work, skills, projects, or experience. What interests you most?"
  ]
};

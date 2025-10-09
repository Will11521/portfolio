import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { X, Send, Brain } from 'lucide-react';
import { knowledgeBase, responsePatterns } from '../data/nerveKnowledge';

type Sender = 'user' | 'nerve';

interface Attachment {
  label: string;
  type: 'link' | 'scroll';
  url?: string;
  targetId?: string;
}

interface QuickReply {
  id: string;
  label: string;
  value: string;
}

interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  attachments?: Attachment[];
  quickReplies?: QuickReply[];
}

type Intent =
  | 'about'
  | 'skills'
  | 'projects'
  | 'project'
  | 'contact'
  | 'resume'
  | 'funfacts'
  | 'help'
  | 'experience'
  | 'default';

interface GeneratedResponse {
  text: string;
  intent: Intent;
  attachments?: Attachment[];
  quickReplies?: QuickReply[];
}

const makeId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const createQuickReply = (value: string, label?: string): QuickReply => ({
  id: makeId(`${value}-${label ?? ''}`),
  label: label ?? value.charAt(0).toUpperCase() + value.slice(1),
  value,
});

const buildProjectQuickReplies = (excludeName?: string): QuickReply[] =>
  knowledgeBase.projects
    .filter(project => (excludeName ? project.name !== excludeName : true))
    .slice(0, 6)
    .map(project => createQuickReply(`project: ${project.name}`, project.name));

const defaultQuickReplies: QuickReply[] = [
  createQuickReply('about', 'About'),
  createQuickReply('skills', 'Skills'),
  createQuickReply('projects', 'Projects'),
  createQuickReply('resume', 'Resume'),
  createQuickReply('contact', 'Contact'),
];

const THANK_YOU_RESPONSES = [
  "You're welcome! Let me know if you'd like a project summary, resume snapshot, or quick intro.",
  "Happy to help! Want to see William's projects, skills, or contact details next?",
  "Anytime! I can share William's resume highlights, project links, or set up a contact.",
];

const formatBulletList = (items: string[], prefix = '• ') =>
  items.map(item => `${prefix}${item}`).join('\n');

const detectProject = (input: string) => {
  const normalized = input.toLowerCase();
  const cleaned = normalized.replace(/^project:\s*/, '').trim();
  return knowledgeBase.projects.find(project => {
    const name = project.name.toLowerCase();
    const keywords = project.keywords?.map(keyword => keyword.toLowerCase()) ?? [];
    return (
      normalized.includes(name) ||
      cleaned === name ||
      keywords.some(keyword => normalized.includes(keyword) || cleaned.includes(keyword))
    );
  });
};

const pickFunFacts = (count = 3) => {
  const facts = [...knowledgeBase.funFacts];
  const chosen: string[] = [];
  while (facts.length && chosen.length < count) {
    const index = Math.floor(Math.random() * facts.length);
    chosen.push(facts.splice(index, 1)[0]);
  }
  return chosen;
};

const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const generateResponse = (userInput: string): GeneratedResponse => {
  const trimmed = userInput.trim();
  const lower = trimmed.toLowerCase();

  if (!trimmed) {
    return {
      text: randomItem(responsePatterns.default),
      intent: 'default',
      quickReplies: defaultQuickReplies,
    };
  }

  if (/(thank|thanks|appreciate)/.test(lower)) {
    return {
      text: randomItem(THANK_YOU_RESPONSES),
      intent: 'default',
      quickReplies: defaultQuickReplies,
    };
  }

  if (/(resume|recruiter|cv)/.test(lower)) {
    const summary = formatBulletList(knowledgeBase.resume.summary);
    const attachments: Attachment[] = [
      {
        label: 'View Resume (PDF)',
        type: 'link',
        url: knowledgeBase.resume.url,
      },
    ];
    if (knowledgeBase.contact.calendly) {
      attachments.push({
        label: 'Book a Call',
        type: 'link',
        url: knowledgeBase.contact.calendly,
      });
    }
    return {
      text: `Here's a recruiter-friendly snapshot:\n${summary}\n\nNeed anything else? I'm fluent in projects, skills, and contact info.`,
      intent: 'resume',
      attachments,
      quickReplies: [
        createQuickReply('projects', 'Projects'),
        createQuickReply('skills', 'Skills'),
        createQuickReply('contact', 'Contact'),
      ],
    };
  }

  if (/(contact|hire|reach|email|connect|phone|call|calendly)/.test(lower)) {
    const attachments: Attachment[] = [
      { label: 'Email William', type: 'link', url: `mailto:${knowledgeBase.contact.email}` },
      { label: 'Call William', type: 'link', url: `tel:${knowledgeBase.contact.phone}` },
    ];
    if (knowledgeBase.contact.calendly) {
      attachments.push({ label: 'Book a Call', type: 'link', url: knowledgeBase.contact.calendly });
    }
    attachments.push({ label: 'Open Contact Section', type: 'scroll', targetId: '#contact' });

    const text = `You can reach William at ${knowledgeBase.contact.email} or call ${knowledgeBase.contact.phone}. He's based in ${knowledgeBase.contact.location} and always open to thoughtful collaborations.`;
    return {
      text,
      intent: 'contact',
      attachments,
      quickReplies: [
        createQuickReply('resume', 'Resume'),
        createQuickReply('projects', 'Projects'),
        createQuickReply('about', 'About'),
      ],
    };
  }

  if (/(experience|background|career|history|previous|job|intern)/.test(lower)) {
    const experienceSummary = knowledgeBase.experience
      .map(exp => `${exp.role} @ ${exp.company} (${exp.period})`)
      .join('\n');
    return {
      text: `William's recent experience:\n${experienceSummary}\n\nWant details about a project or see his resume?`,
      intent: 'experience',
      quickReplies: [
        createQuickReply('projects', 'Projects'),
        createQuickReply('resume', 'Resume'),
        createQuickReply('fun facts', 'Fun Facts'),
      ],
    };
  }

  if (/(skill|skills|tech|stack|tools|language|code)/.test(lower)) {
    const text = [
      'Technical stack:',
      `• Frontend: ${knowledgeBase.skills.frontend.slice(0, 6).join(', ')}`,
      `• Backend: ${knowledgeBase.skills.backend.slice(0, 5).join(', ')}`,
      `• Design: ${knowledgeBase.skills.design.slice(0, 5).join(', ')}`,
      `• AI/ML: ${knowledgeBase.skills.aiml.slice(0, 5).join(', ')}`,
      `• Tools: ${knowledgeBase.skills.tools.slice(0, 5).join(', ')}`,
      'Want to see these in action? Ask about a project!',
    ].join('\n');
    return {
      text,
      intent: 'skills',
      quickReplies: [
        createQuickReply('projects', 'Projects'),
        createQuickReply('resume', 'Resume'),
        createQuickReply('contact', 'Contact'),
      ],
    };
  }

  if (/(fun fact|funfact|interesting|random)/.test(lower)) {
    const facts = pickFunFacts();
    return {
      text: `A few fun facts about William:\n${formatBulletList(facts)}`,
      intent: 'funfacts',
      quickReplies: [
        createQuickReply('about', 'About'),
        createQuickReply('projects', 'Projects'),
        createQuickReply('contact', 'Contact'),
      ],
    };
  }

  if (/(help|commands|what can you do|options)/.test(lower)) {
    const text = [
      'I can help with:',
      '• about — Learn about William',
      '• skills — Review his technical toolkit',
      '• projects — Browse featured work',
      '• project: [name] — Deep dive on a project',
      '• resume — Quick recruiter summary and PDF',
      '• contact — Ways to reach William',
      '• fun facts — Discover personality tidbits',
    ].join('\n');
    return {
      text,
      intent: 'help',
      quickReplies: defaultQuickReplies,
    };
  }

  const projectMatch = detectProject(lower);
  if (lower.startsWith('project:') || projectMatch) {
    if (projectMatch) {
      const highlights = formatBulletList(projectMatch.highlights.slice(0, 3));
      const tech = projectMatch.tech.join(', ');
      const attachments = projectMatch.link
        ? [{ label: `Open ${projectMatch.name}`, type: 'link', url: projectMatch.link }]
        : undefined;
      return {
        text: `${projectMatch.name}\n${projectMatch.description}\n\nTech: ${tech}\nHighlights:\n${highlights}`,
        intent: 'project',
        attachments,
        quickReplies: [
          ...buildProjectQuickReplies(projectMatch.name),
          createQuickReply('contact', 'Contact'),
          createQuickReply('resume', 'Resume'),
        ],
      };
    }
    return {
      text: "I can tell you about DreamSynth, Analytics Dashboard, EchoLink, The System, Online Therapy, or Nerve. Which one should we explore?",
      intent: 'project',
      quickReplies: buildProjectQuickReplies(),
    };
  }

  if (/(project|projects|portfolio|work|built|created)/.test(lower)) {
    const projectList = knowledgeBase.projects
      .map(project => `• ${project.name} — ${project.description}`)
      .join('\n');
    return {
      text: `Featured projects:\n${projectList}\n\nAsk for any project by name or type project: [name] for details.`,
      intent: 'projects',
      quickReplies: buildProjectQuickReplies(),
    };
  }

  if (/(about|who is|who's|tell me about|what is william)/.test(lower) || /(where|location|based)/.test(lower)) {
    const currentRole = knowledgeBase.experience[0];
    const text = [
      `William is ${knowledgeBase.personal.title} based in ${knowledgeBase.personal.location}.`,
      knowledgeBase.personal.bio,
      `Right now he's ${currentRole.role} at ${currentRole.company}, pushing AI-powered experiences while obsessing over calm, cinematic design.`,
    ].join('\n\n');
    return {
      text,
      intent: 'about',
      quickReplies: [
        createQuickReply('skills', 'Skills'),
        createQuickReply('projects', 'Projects'),
        createQuickReply('resume', 'Resume'),
        createQuickReply('contact', 'Contact'),
      ],
    };
  }

  if (/(nerve)/.test(lower)) {
    return {
      text: "That's me! I'm trained on William's resume, projects, and fun facts so you can explore his work without digging through endless sections. Ask me about anything you're curious about.",
      intent: 'default',
      quickReplies: defaultQuickReplies,
    };
  }

  return {
    text: randomItem(responsePatterns.default),
    intent: 'default',
    quickReplies: defaultQuickReplies,
  };
};

export function NerveChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: responsePatterns.greeting[0],
      sender: 'nerve',
      timestamp: new Date(),
      quickReplies: defaultQuickReplies,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleAttachmentClick = (attachment: Attachment) => {
    if (attachment.type === 'link' && attachment.url) {
      if (attachment.url.startsWith('mailto:') || attachment.url.startsWith('tel:')) {
        window.location.href = attachment.url;
      } else {
        window.open(attachment.url, '_blank', 'noopener,noreferrer');
      }
    }
    if (attachment.type === 'scroll' && attachment.targetId) {
      document.querySelector(attachment.targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessage = (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(trimmed);
      const nerveMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'nerve',
        timestamp: new Date(),
        attachments: response.attachments,
        quickReplies: response.quickReplies ?? defaultQuickReplies,
      };

      setMessages(prev => [...prev, nerveMessage]);
      setIsTyping(false);

      if (response.intent === 'contact') {
        setTimeout(() => {
          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      }
    }, 700 + Math.random() * 1000);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const value = inputValue;
    setInputValue('');
    sendMessage(value);
  };

  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.value);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!inputValue.trim()) return;
      const value = inputValue;
      setInputValue('');
      sendMessage(value);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        aria-label={isOpen ? 'Close Nerve AI chatbot' : 'Open Nerve AI chatbot'}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Brain className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="fixed bottom-28 right-8 z-50 w-96 h-[600px] bg-card border-2 border-primary/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              backdropFilter: 'blur(20px)',
              background: 'linear-gradient(135deg, rgba(245, 241, 235, 0.98) 0%, rgba(232, 222, 208, 0.98) 100%)',
            }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-6 flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Brain className="w-8 h-8" />
              </motion.div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'inherit' }}>
                  Nerve
                </h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.9, color: 'inherit' }}>
                  AI Assistant • Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                      {message.text}
                    </p>

                    {message.sender === 'nerve' && message.attachments?.length ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.attachments.map(attachment => (
                          <button
                            key={`${message.id}-${attachment.label}`}
                            onClick={() => handleAttachmentClick(attachment)}
                            className="px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm"
                          >
                            {attachment.label}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {message.sender === 'nerve' && message.quickReplies?.length ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.quickReplies.map(reply => (
                          <button
                            key={`${message.id}-${reply.id}`}
                            onClick={() => handleQuickReply(reply)}
                            className="px-3 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors text-sm"
                          >
                            {reply.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-3 flex gap-1">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-primary/10">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-secondary/50 text-foreground rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  style={{ fontSize: '0.95rem' }}
                />
                <motion.button
                  onClick={handleSend}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

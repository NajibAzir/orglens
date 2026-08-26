import { useState, useRef, useEffect, useCallback } from 'react';

// ══════════════════════════════════════════════════════════
// OrgLens Knowledge Base — Organisation Focused
// ══════════════════════════════════════════════════════════
const knowledgeBase = [
  {
    keywords: ['what', 'orglens', 'about', 'overview', 'does', 'do', 'tell', 'explain', 'introduction'],
    synonyms: { 'app': 'orglens', 'system': 'orglens', 'platform': 'orglens', 'this': 'orglens' },
    answer: "OrgLens is an Organizational Intelligence platform that gives you a complete, time-aware picture of how your organisation has evolved. It connects role changes (renames, splits, merges, reporting shifts) with people movements (promotions, transfers, departures) — so you can see the full story of who held what, when, and why things changed."
  },
  {
    keywords: ['employee', 'employees', 'how many', 'headcount', 'people', 'staff', 'total'],
    synonyms: { 'workers': 'employees', 'team size': 'headcount', 'members': 'employees' },
    answer: "The organisation currently has 26 employees across 6 departments. Staff members range from engineers and designers to data analysts, QA specialists, and platform engineers. Each employee's full career trajectory is tracked — from their hire date through every promotion, transfer, and role change."
  },
  {
    keywords: ['department', 'departments', 'teams', 'divisions', 'unit', 'groups'],
    synonyms: { 'division': 'department', 'business unit': 'department', 'group': 'teams' },
    answer: "The organisation has 6 departments: Engineering, Product & Design, Data & Analytics, Quality Assurance, Platform Engineering (spun out from Core Engineering in Q3 2023), and People & Culture. Each department has its own reporting lines, roles, and growth trajectory visible in the org chart."
  },
  {
    keywords: ['role', 'roles', 'positions', 'job', 'jobs', 'title', 'titles', 'how many roles'],
    synonyms: { 'designation': 'role', 'vacancy': 'positions', 'openings': 'positions' },
    answer: "There are 23 active roles across the organisation, spanning Engineering (CTO, VP, Tech Lead, Senior/Junior Engineers, DevOps, SRE), Product (Head of Product, Product Managers, UX), Data (Data Lead, Analysts, ML Engineer), QA (QA Lead, Automation Engineers), Platform (Head of Platform, Cloud Security), and People & Culture (HR, Talent). Each role has market-relevancy scoring and evolution history."
  },
  {
    keywords: ['relevancy', 'relevance', 'market', 'demand', 'score', 'index', 'percentage'],
    synonyms: { 'rating': 'score', 'how relevant': 'relevancy', 'future-proof': 'relevancy' },
    answer: "The average role relevancy across the organisation is 77%. This score reflects market demand and automation exposure for each position. For example, the CTO has 83% relevancy. Roles are badged as High Demand, Stable, Automation Risk, or Transforming — helping leadership understand which positions need upskilling investment or may face disruption."
  },
  {
    keywords: ['restructure', 'reorg', 'reorganisation', 'change', 'transformation', 'scenario', 'split'],
    synonyms: { 'restructuring': 'restructure', 'reorganization': 'reorganisation', 'shake-up': 'reorg' },
    answer: "The organisation has undergone 3 major structural changes: 1) Baseline structure in 2021 (founding setup), 2) Platform Engineering split in Q3 2023 — spun out from Core Engineering with new reporting lines, and 3) AI & Automation transformation in 2025 — reshaping QA and Data roles. Each restructuring is visible by scrubbing the org chart timeline."
  },
  {
    keywords: ['promotion', 'promoted', 'fast track', 'career growth', 'advance', 'progression'],
    synonyms: { 'rise': 'promotion', 'move up': 'promoted', 'climb': 'progression', 'growth': 'career growth' },
    answer: "The org tracks career velocity for each employee. Notable examples: one engineer went from Software Engineer → Senior Software Engineer → Tech Lead in just 2 years (fast-track). Career velocity badges (Fast Track, Steady Growth, Stagnation Risk) help identify high performers and those needing attention."
  },
  {
    keywords: ['stagnation', 'stuck', 'stagnant', 'no promotion', 'same role', 'risk'],
    synonyms: { 'plateaued': 'stagnation', 'not moving': 'stuck', 'static': 'stagnant' },
    answer: "OrgLens flags career stagnation when an employee has been in the same mid-level role for 3.5+ years without promotion or scope change. This is flagged as an anomaly so HR and managers can proactively address it — whether through upskilling, role redesign, or internal mobility opportunities."
  },
  {
    keywords: ['transfer', 'transferred', 'move', 'lateral', 'department change', 'mobility'],
    synonyms: { 'moved': 'transfer', 'shifted': 'move', 'reassigned': 'transfer', 'internal mobility': 'mobility' },
    answer: "The organisation tracks all lateral moves and cross-department transfers. In the 2023 Platform split, several engineers were transferred from Core Engineering to the new Platform Engineering department. Each transfer is logged with the date, reason, and reporting manager change — so you can trace exactly how people moved during restructurings."
  },
  {
    keywords: ['cto', 'chief technology', 'leadership', 'c-level', 'executive', 'tan wei ming'],
    synonyms: { 'tech leader': 'cto', 'head of tech': 'cto' },
    answer: "The Chief Technology Officer (CTO) is Tan Wei Ming, reporting to the Board of Directors. The role was created in 2021 with the company's founding. It oversees global technology strategy and organisational architecture. The CTO role has an 83% relevancy index — still highly relevant as it evolves toward AI governance, cybersecurity leadership, and digital P&L ownership."
  },
  {
    keywords: ['vp', 'vice president', 'engineering', 'marcus', 'wong'],
    synonyms: { 'vice pres': 'vp', 'eng lead': 'vp engineering' },
    answer: "Marcus Wong is the VP of Engineering, hired in 2021 and reporting to the CTO (Tan Wei Ming). He's been in the role for 5 years with 1 total career move. Marcus oversees Engineering department operations, distributed systems, and hiring. He's based at the Kuala Lumpur Hub (Hybrid)."
  },
  {
    keywords: ['muthu', 'krishnan', 'software engineer', 'senior'],
    synonyms: {},
    answer: "Muthu Krishnan is a Senior Software Engineer in the Engineering department. He joined in 2021 as a Software Engineer and was promoted to Senior Software Engineer in March 2022 — a well-paced progression. He has 5 years tenure, 1 promotion, and 2 total career moves. He reports to the Engineering leadership and is based at Kuala Lumpur Hub (Hybrid)."
  },
  {
    keywords: ['qa', 'quality', 'assurance', 'testing', 'automation', 'manual'],
    synonyms: { 'test': 'testing', 'tester': 'qa' },
    answer: "The QA department has undergone a major transformation. Manual testing roles were gradually phased out and replaced by automation-focused positions. In the 2025 AI & Automation scenario, QA roles shifted to Automation QA Engineers. Some manual testers exited while new automation specialists were hired — a visible evolution in the org chart timeline."
  },
  {
    keywords: ['platform', 'engineering', 'spin', 'split', '2023', 'devops', 'cloud', 'sre'],
    synonyms: { 'infra': 'platform', 'infrastructure': 'platform', 'ops': 'devops' },
    answer: "Platform Engineering was spun out as a separate department from Core Engineering in Q3 2023. This included new roles like Head of Platform Engineering, Senior DevOps Engineer, and Cloud Security & SRE. Several engineers were transferred during this restructuring, with new reporting lines established under the new department head."
  },
  {
    keywords: ['hire', 'hired', 'new', 'onboard', 'join', 'recent', 'latest'],
    synonyms: { 'recruit': 'hire', 'joined': 'join', 'newcomer': 'new', 'onboarding': 'onboard' },
    answer: "Recent hires include: Deepa Lakshmi as Senior QA Engineer (Automation) in March 2024, and Ravi Chandran as Automation QA Engineer in October 2023. These hires reflect the org's shift toward test automation. The full movements feed on the dashboard shows all hires, transfers, and role changes in chronological order."
  },
  {
    keywords: ['anomaly', 'anomalies', 'issue', 'problem', 'flag', 'warning', 'gap'],
    synonyms: { 'red flag': 'anomaly', 'concern': 'issue', 'alert': 'warning' },
    answer: "The anomaly detector flags organisational health issues: orphan roles (missing reporting lines), vacant positions (no current occupant), tenure stagnation (3.5+ years without movement), and reorg transition stress (too many changes in a short period). These are surfaced on the dashboard and on affected role/person pages to help HR act proactively."
  },
  {
    keywords: ['wellbeing', 'wellness', 'health', 'stress', 'support', 'care', 'mental'],
    synonyms: { 'burnout': 'stress', 'happiness': 'wellbeing', 'morale': 'wellbeing' },
    answer: "Change Wellbeing monitoring tracks how organisational changes impact employees. When someone goes through a reorg, new manager, or role change, the system can trigger wellbeing check-ins. This helps People & Culture identify who may need support during transitions — preventing burnout and disengagement during periods of structural change."
  },
  {
    keywords: ['wallet', 'solana', 'royalty', 'perk', 'benefit', 'cafeteria', 'parking', 'reward'],
    synonyms: { 'perks': 'perk', 'benefits': 'benefit', 'payment': 'wallet', 'spend': 'wallet' },
    answer: "Each employee has a Solana-based royalty wallet for company-funded perks. Staff can spend SOL at the cafeteria, parking, Grab Food, and vending machines via QR tap-to-pay. The company reloads wallets monthly, and rewards are issued for upskilling milestones and performance bonuses. The wallet dashboard shows company-wide spend, utilization rates, and low-balance alerts."
  },
  {
    keywords: ['upskill', 'upskilling', 'training', 'skill', 'learn', 'development', 'grow'],
    synonyms: { 'course': 'training', 'growth': 'develop', 'improve': 'upskill', 'reskill': 'upskill' },
    answer: "OrgLens provides personalised upskilling recommendations for each employee based on the gap between their current skills and their role's evolving market requirements. Staff see their own plan (My Upskill Plan) with priority courses and skills. Admin/HR sees a team-wide matrix to allocate training budgets where they matter most."
  },
  {
    keywords: ['reporting', 'manager', 'report to', 'reports to', 'line', 'hierarchy', 'chain'],
    synonyms: { 'boss': 'manager', 'superior': 'manager', 'chain of command': 'hierarchy' },
    answer: "The reporting hierarchy flows from Board of Directors → CTO (Tan Wei Ming) → VP Engineering, Head of Product, Data Lead, etc. → individual contributors. Each role's reporting line is tracked over time, so you can see when reporting structures changed (e.g., during the 2023 Platform split, engineers moved from Core Engineering managers to the new Head of Platform)."
  },
  {
    keywords: ['data', 'analytics', 'analyst', 'ml', 'machine learning', 'data team'],
    synonyms: { 'ai': 'ml', 'intelligence': 'analytics' },
    answer: "The Data & Analytics department includes roles like Data Lead, Data Analysts, and ML Engineers. The team focuses on insights, machine learning models, and data infrastructure. In the 2025 AI & Automation scenario, data roles are expanding as the org invests more in AI capabilities."
  },
  {
    keywords: ['product', 'design', 'ux', 'pm', 'product manager'],
    synonyms: { 'designer': 'ux', 'user experience': 'ux' },
    answer: "The Product & Design department includes the Head of Product, Product Managers, and UX Designers. They drive product strategy, user research, and design systems. The department has remained relatively stable across restructurings, with steady growth in headcount as the product portfolio expanded."
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    synonyms: {},
    answer: "Hello! 👋 I'm the OrgLens assistant. I can help you understand the organisation — ask me about departments, roles, people, recent changes, career journeys, or anything about how the org has evolved!"
  },
  {
    keywords: ['thank', 'thanks', 'bye', 'goodbye', 'cheers'],
    synonyms: {},
    answer: "You're welcome! Feel free to ask anytime you want to understand more about the organisation. 🙌"
  },
  {
    keywords: ['how many', 'count', 'number', 'total', 'stat', 'statistics', 'summary'],
    synonyms: { 'stats': 'statistics', 'overview': 'summary', 'numbers': 'stat' },
    answer: "Quick org stats: 26 employees, 23 active roles, 6 departments, 77% average role relevancy. The org has gone through 3 major structural scenarios between 2021-2025. Recent activity includes hires in QA automation and transfers during the Platform Engineering spin-out."
  },
  {
    keywords: ['location', 'office', 'where', 'based', 'kuala lumpur', 'kl', 'hybrid', 'remote'],
    synonyms: { 'work from': 'hybrid', 'wfh': 'remote' },
    answer: "The organisation is based at the Kuala Lumpur Hub with a hybrid work model. Employees work in a mix of on-site and remote arrangements. All employee profiles show their location and work arrangement."
  }
];

// ══════════════════════════════════════════════════════════
// Fuzzy Matching Engine
// ══════════════════════════════════════════════════════════
const stopwords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'of', 'in', 'to', 'for', 'with', 'on', 'at', 'from', 'by', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'they', 'them', 'and', 'or', 'but', 'if', 'so', 'as', 'just', 'also', 'very', 'really', 'up', 'out', 'some', 'any', 'all', 'more', 'other', 'into', 'over', 'please', 'tell', 'know', 'want', 'like']);

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const d = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = a[i - 1] === b[j - 1]
        ? d[i - 1][j - 1]
        : Math.min(d[i - 1][j - 1], d[i][j - 1], d[i - 1][j]) + 1;
    }
  }
  return d[m][n];
}

function isSimilar(word, target) {
  if (word === target) return 1.0;
  if (target.includes(word) || word.includes(target)) return 0.8;
  if (word.length < 3 || target.length < 3) return 0;
  const dist = levenshtein(word, target);
  const maxLen = Math.max(word.length, target.length);
  const similarity = 1 - dist / maxLen;
  return similarity >= 0.7 ? similarity : 0;
}

function findAnswer(input) {
  const lower = input.toLowerCase().trim().replace(/[?!.,;:'"]/g, '');
  const words = lower.split(/\s+/).filter(w => !stopwords.has(w) && w.length > 1);

  if (words.length === 0) {
    return "Could you rephrase that? I can help with questions about the organisation — departments, roles, people, restructurings, or career journeys!";
  }

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;

    for (const word of words) {
      for (const kw of entry.keywords) {
        if (kw.includes(' ')) {
          if (lower.includes(kw)) score += 2.0;
        } else {
          const sim = isSimilar(word, kw);
          if (sim > 0) score += sim * 1.5;
        }
      }

      if (entry.synonyms) {
        for (const [syn] of Object.entries(entry.synonyms)) {
          if (syn.includes(' ')) {
            if (lower.includes(syn)) score += 1.5;
          } else {
            const sim = isSimilar(word, syn);
            if (sim > 0) score += sim * 1.2;
          }
        }
      }
    }

    const matchedKeywords = entry.keywords.filter(kw =>
      kw.includes(' ') ? lower.includes(kw) : words.some(w => isSimilar(w, kw) > 0)
    );
    if (matchedKeywords.length > 1) {
      score *= 1 + (matchedKeywords.length * 0.15);
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestScore >= 1.0) return bestMatch.answer;

  return "I'm not sure about that one. I can help with questions about:\n• Organisation structure & departments\n• Roles and positions\n• People and career journeys\n• Promotions and transfers\n• Restructurings and changes\n• Wellbeing and upskilling\n• Wallet and perks";
}

// ══════════════════════════════════════════════════════════
// ChatbotWidget Component
// - Right side, vertical drag only, chat opens to the left
// ══════════════════════════════════════════════════════════
export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! 👋 I'm the OrgLens assistant. Ask me anything about the organisation — departments, roles, people, career journeys, restructurings, or stats!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [posY, setPosY] = useState(null); // vertical position only
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const widgetRef = useRef(null);

  // Initialize vertical position (bottom-right area)
  useEffect(() => {
    setPosY(window.innerHeight - 90);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ── Vertical-only drag handlers (mouse) ──
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.chatbot-window')) return;
    setIsDragging(true);
    const rect = widgetRef.current.getBoundingClientRect();
    setDragOffsetY(e.clientY - rect.top);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const newY = e.clientY - dragOffsetY;
    const maxY = window.innerHeight - 60;
    setPosY(Math.max(10, Math.min(newY, maxY)));
  }, [isDragging, dragOffsetY]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // ── Vertical-only drag handlers (touch) ──
  const handleTouchStart = useCallback((e) => {
    if (e.target.closest('.chatbot-window')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    const rect = widgetRef.current.getBoundingClientRect();
    setDragOffsetY(touch.clientY - rect.top);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newY = touch.clientY - dragOffsetY;
    const maxY = window.innerHeight - 60;
    setPosY(Math.max(10, Math.min(newY, maxY)));
  }, [isDragging, dragOffsetY]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = findAnswer(text);
      setMessages(prev => [...prev, { sender: 'bot', text: answer }]);
      setIsTyping(false);
    }, 600 + Math.random() * 500);
  };

  if (posY === null) return null;

  return (
    <div
      ref={widgetRef}
      className="fixed z-[9999] font-sans select-none"
      style={{
        right: '24px',
        top: `${posY}px`,
        cursor: isDragging ? 'ns-resize' : 'ns-resize'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Chat Window — opens to the LEFT of the button */}
      {isOpen && (
        <div
          className="chatbot-window absolute bottom-0 right-16 w-[370px] h-[500px] bg-slate-900 border border-cyan-500/20 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          style={{ cursor: 'default' }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-cyan-500/5 border-b border-cyan-500/10 flex items-center gap-3 flex-shrink-0">
            <span className="text-2xl">🤖</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-100">OrgLens Assistant</p>
              <p className="text-xs text-slate-400">Ask about the organisation</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-emerald-400">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {msg.sender === 'bot' ? '🤖' : '👤'}
                </span>
                <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed max-w-[260px] whitespace-pre-line ${
                  msg.sender === 'bot'
                    ? 'bg-cyan-500/10 border border-cyan-500/15 text-slate-200'
                    : 'bg-purple-500/15 border border-purple-500/20 text-slate-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <span className="text-lg flex-shrink-0">🤖</span>
                <div className="px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/15">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-cyan-500/10 bg-slate-950/50 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about the organisation..."
              className="flex-1 px-3 py-2 rounded-lg border border-cyan-500/20 bg-slate-800/80 text-slate-200 text-sm placeholder:text-slate-500 outline-none focus:border-cyan-500/50 transition-colors"
            />
            <button
              onClick={sendMessage}
              className="send-btn-chat w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 text-white flex items-center justify-center text-sm hover:scale-105 transition-transform cursor-pointer"
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button — right side */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-110 transition-transform cursor-pointer"
        aria-label={isOpen ? 'Close chat' : 'Open OrgLens Assistant'}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}

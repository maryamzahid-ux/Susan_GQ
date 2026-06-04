// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS — BIZremedies-inspired (forest green, warm gold, ivory)
// ─────────────────────────────────────────────────────────────
export const T = {
  green: "#1B4332", greenMid: "#2D6A4F", greenLight: "#40916C",
  gold: "#B7882C", goldLight: "#D4A847", goldPale: "#F5EDD4",
  ivory: "#FDFAF4", ivoryDark: "#F0EAD6", charcoal: "#1A1A1A",
  muted: "#6B6B5A", border: "#D9D2BE", white: "#FFFFFF",
  danger: "#C0392B", success: "#1B7A4F",
};

// ─────────────────────────────────────────────────────────────
// REAL CONTENT — sourced from bizremedies.com (Susan K. Wehrley)
// ─────────────────────────────────────────────────────────────

// Susan's 4 information centers — the actual basis of Gut Intelligence®
export const GQ_CENTERS = [
  { key: "gut",       label: "The Gut",       signal: "The Gut-Alert",          icon: "🧭",
    desc: "Your internal compass. A wake-up call to pay attention and bring unconscious neurons, neurotransmitters & hormones up the vagus nerve to be processed consciously." },
  { key: "heart",     label: "The Heart",     signal: "The Heart's Desire",     icon: "💚",
    desc: "Emotional data. The information system that reveals your emotions and helps you determine your direction." },
  { key: "head",      label: "The Head",      signal: "The Field of Possibilities", icon: "🧠",
    desc: "Cognitive awareness. Where you become aware of the various strategies available to you." },
  { key: "intuition", label: "Intuitive Knowing", signal: "The 'A-ha' Knowing", icon: "✨",
    desc: "A visceral response telling you your gut, heart, head & intuition all agree — you've found your just-right solution. The 'P' in S.T.O.P.: Perceive & Receive." },
];

// The S.T.O.P. Technique — verbatim from Susan's methodology
export const STOP_TECHNIQUE = [
  { letter: "S", title: "Slow down and breathe", desc: "Pause and regulate your internal state before reacting." },
  { letter: "T", title: "Tune in within",        desc: "Listen to the gut-alert and the wisdom of your body." },
  { letter: "O", title: "Observe what is happening", desc: "Step back and watch the situation from a fearlessly detached point of view." },
  { letter: "P", title: "Perceive a new possibility", desc: "Ask 'How might we...?' and attune to the 'a-ha' knowing to decide with purpose." },
];

// The SHIFT Effect — verbatim 5 steps
export const SHIFT_EFFECT = [
  { letter: "S", title: "Sense misalignment clearly", desc: "Trust the gut-alert that signals when something is out of alignment with your vision, values, and goals." },
  { letter: "H", title: "Harness your intuition", desc: "Breathe into your gut and integrate wisdom from gut, heart, head, and intuition." },
  { letter: "I", title: "Integrate your insights", desc: "Use the GQ Blueprint to synthesize information and decide like an inner Board of Directors." },
  { letter: "F", title: "Focus on creation, not reaction", desc: "Stay present, respond with purpose, align every action to your vision, values, and goals." },
  { letter: "T", title: "Take inspired action", desc: "Move forward with the speed and agility of a cheetah, aligned with the outcomes you want." },
];

// Susan's 12 real books (from bizremedies.com/books)
export const BOOKS = [
  { title: "The Cheetah Method", desc: "The branding book that catapulted Susan's business — 5 steps to align with your true essence and build a memorable brand.", tag: "Latest", url: "https://www.amazon.com/s?k=the+cheetah+method" },
  { title: "Gut Intelligence: ALIGN", desc: "The 3-step ALIGN Business Builder Process to align you to your goals.", tag: "GQ Core", url: "https://bizremedies.com/books/align/" },
  { title: "Gut Intelligence", desc: "The foundational text on synthesizing wisdom from gut, heart, head & intuition.", tag: "GQ Core", url: "https://bizremedies.com/books/gut-intelligence/" },
  { title: "Ego at Work", desc: "How the E.G.O. Edges Gut Intelligence Out — and how to SHIFT it.", tag: "Leadership", url: "https://bizremedies.com/books/ego-at-work/" },
  { title: "The Yogi Executive", desc: "Meditate and use yoga poses at your desk to become clearer, calmer, and more confident in decision-making.", tag: "Practice", url: "https://bizremedies.com/books/the-yogi-executive-book-teaches-you-how-to-meditate-and-use-yoga-poses-at-your-desk-to-become-more-clear-calm-and-confident-in-your-decision-making/" },
  { title: "AWAKEN: The 5 Levels of Consciousness", desc: "A journey through the five levels of consciousness toward enlightened leadership.", tag: "Consciousness", url: "https://bizremedies.com/books/awaken-the-5-levels-of-consciousness/" },
  { title: "PAUSE", desc: "The power of the pause in conscious decision-making.", tag: "Practice", url: "https://bizremedies.com/books/pause/" },
  { title: "The Personal Leadership Puzzle", desc: "Putting together the pieces of self-aware, values-driven leadership.", tag: "Leadership", url: "https://bizremedies.com/books/the-personal-leadership-puzzle/" },
  { title: "Ignite The Plan", desc: "Turning vision and values into actionable, aligned goals.", tag: "Goals", url: "https://bizremedies.com/books/ignite-the-plan/" },
  { title: "The Power to Believe", desc: "Building unshakeable belief in yourself and your vision.", tag: "Mindset", url: "https://bizremedies.com/books/the-power-to-believe/" },
  { title: "The Secret to 'I Am'", desc: "Aligning with your true identity and essence.", tag: "Mindset", url: "https://bizremedies.com/books/the-secret-to-i-am/" },
  { title: "Women's Leadership Handbook", desc: "A practical guide for women leaders to lead fearlessly and authentically.", tag: "Leadership", url: "https://bizremedies.com/books/womens-leadership-handbook/" },
];

// Real Forbes / BizTimes articles (from bizremedies.com/blogandarticles)
export const ARTICLES = [
  { title: "Gut Intelligence (GQ): Why Leaders Need it as Much as IQ & EQ", source: "Forbes", year: "2019",
    excerpt: "We've all had situations where our gut alerted us to pay attention. The problem is we didn't know what to do about that gut alert that sent us into fight, flight, or freeze.",
    url: "https://bizremedies.com/gut-intelligence-gq-why-leaders-need-it-as-much-as-iq-q/" },
  { title: "The Conscious Leader: Why Leadership Is An Inside-Out Job", source: "Forbes", year: "2019",
    excerpt: "True leadership begins within — raising your level of consciousness changes how your talent engages with the vision, values, and goals.",
    url: "https://bizremedies.com/the-conscious-leader-why-leadership-is-an-inside-out-job/" },
  { title: "Mindfulness: 7 Principles of Wise Leaders", source: "Forbes", year: "2019",
    excerpt: "Seven mindfulness principles that wise leaders use to stay present, aware, and aligned.",
    url: "https://bizremedies.com/2882-2/" },
  { title: "Feeling Burned Out? Techniques To Proactively Improve Your Mental And Physical Health", source: "Forbes", year: "2019",
    excerpt: "Proactive techniques to protect your wellbeing before burnout takes hold.",
    url: "https://bizremedies.com/feeling-burned-out-techniques-to-proactively-improve-your-mental-and-physical-health/" },
  { title: "The Importance Of Values: 12 Ways Startups Can Build Their Ethical Foundation", source: "Forbes", year: "2019",
    excerpt: "How startups can build an ethical foundation rooted in clearly articulated values.",
    url: "https://bizremedies.com/the-importance-of-values-12-ways-startups-can-build-their-ethical-foundation/" },
  { title: "Advice For Workaholics: 12 Helpful Ways To Attain Work-Life Balance", source: "Forbes", year: "2019",
    excerpt: "Practical ways for high-achievers to reclaim work-life balance.",
    url: "https://bizremedies.com/advice-for-workaholics-12-helpful-ways-to-attain-work-life-balance/" },
];

// Programs (real, from bizremedies.com)
export const PROGRAMS = [
  { title: "The Gut Intelligence® (GQ) Architectural Blueprint", format: "Org Digital Platform + 10 Tools",
    desc: "Create an aware and agile organization that stays aligned in uncertain times. Empower talent to notice cues before they hit the bottom line — moving from Fire-Fire-Fire to Ready-Aim-Fire leadership.",
    url: "https://bizremedies.com/the-gut-intelligence-gq-architectural-blueprint/" },
  { title: "Gut Intelligence® (GQ) Leadership Coaching", format: "1-on-1 Executive Coaching",
    desc: "Personalized coaching to raise your consciousness from fear, self-doubt, and judgment into clear, calm, confident leadership.",
    url: "https://bizremedies.com/gut-intelligence-gq-leadership-coaching/" },
  { title: "The Primal SHIFT", format: "Online Program + African Retreat",
    desc: "A transformation at the source — rewire how you operate by strengthening the gut-brain axis: Awaken, Attune, Align, Attract.",
    url: "https://bizremedies.com/the-primal-shift/" },
];

// Coaching library — modeled on Susan's real content (SHIFT app, videos, books, meditations)
export const MATERIALS = [
  { id: 1, type: "video", title: "SHIFT: Mastering Leadership from Ego to Enlightenment", duration: "24 min", category: "Core",
    desc: "The foundational SHIFT methodology — moving from reaction to conscious response." },
  { id: 2, type: "pdf", title: "The S.T.O.P. Technique Workbook", pages: 18, category: "Core",
    desc: "Slow down · Tune in · Observe · Perceive. A guided workbook to practice the core GQ technique." },
  { id: 3, type: "video", title: "The Gut-Brain Axis: The Neuroscience of GQ", duration: "31 min", category: "Core",
    desc: "How neurons, neurotransmitters & hormones travel the vagus nerve from gut to higher brain." },
  { id: 4, type: "audio", title: "The Yogi Executive: Desk Meditation", duration: "12 min", category: "Practice",
    desc: "Meditate and reset at your desk to become clear, calm, and confident." },
  { id: 5, type: "pdf", title: "Vision · Values · Goals Alignment Map", pages: 14, category: "Core",
    desc: "Map your decisions against your vision, values, and goals — the GQ Blueprint tool." },
  { id: 6, type: "video", title: "The GQ Architecture: Building an Aligned Org Culture", duration: "45 min", category: "Leadership",
    desc: "How leaders empower talent to notice misalignment cues early — Ready-Aim-Fire leadership." },
  { id: 7, type: "video", title: "How Might We…? Leading with Curiosity", duration: "16 min", category: "Leadership",
    desc: "The single most powerful GQ question to get out of the reaction center of the brain." },
  { id: 8, type: "audio", title: "AWAKEN: The 5 Levels of Consciousness", duration: "28 min", category: "Consciousness",
    desc: "An audio journey through the five levels of consciousness toward enlightened leadership." },
];

// Demo organizations (real client names Susan has publicly worked with)
export const ORGS = [
  { id: 1, name: "Harley-Davidson", users: 42, gqAvg: 74, progress: 68, license: "Enterprise", joined: "Jan 2024" },
  { id: 2, name: "Summit Credit Union", users: 18, gqAvg: 81, progress: 82, license: "Professional", joined: "Mar 2024" },
  { id: 3, name: "GMR Marketing", users: 31, gqAvg: 69, progress: 60, license: "Enterprise", joined: "Nov 2023" },
  { id: 4, name: "Dedicated Computing", users: 12, gqAvg: 86, progress: 88, license: "Professional", joined: "Jun 2024" },
];

export const INDIVIDUALS = [
  { id: 1, name: "Alex Rivera",   role: "CEO",             gqScore: 82, sessions: 12, lastActive: "2d ago", certified: true },
  { id: 2, name: "Priya Nair",    role: "VP Engineering",  gqScore: 71, sessions: 8,  lastActive: "1d ago", certified: false },
  { id: 3, name: "Marcus Chen",   role: "Director",        gqScore: 67, sessions: 5,  lastActive: "5d ago", certified: false },
  { id: 4, name: "Lisa Fontaine", role: "Entrepreneur",    gqScore: 90, sessions: 20, lastActive: "Today",  certified: true },
];

// Certification tracks
export const CERT_TRACKS = [
  { level: "Level 1", title: "GQ Foundations", badge: "🥉", modules: 4, gqReq: 60,
    desc: "Master the S.T.O.P. technique and the fundamentals of Gut Intelligence®." },
  { level: "Level 2", title: "GQ Practitioner", badge: "🥈", modules: 8, gqReq: 70,
    desc: "Advanced decision-making, the SHIFT Effect, values alignment & team facilitation." },
  { level: "Level 3", title: "GQ Master Facilitator", badge: "🥇", modules: 12, gqReq: 85,
    desc: "Certify to teach and facilitate the GQ Architecture inside organizations." },
];

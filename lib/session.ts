/**
 * lib/session.ts
 * Browser-side session persistence for NyayaSathi.
 * Stores chat history, document drafts, and usage statistics in localStorage.
 * All reads/writes are safe (no SSR crashes, no throwing on missing storage).
 */

export type Language = 'en' | 'hi' | 'mr';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string; // ISO string (safe to serialize)
}

export interface ChatSession {
  id: string;
  title: string;           // First user message (truncated)
  messages: ChatMessage[];
  language: Language;
  createdAt: string;       // ISO string
  updatedAt: string;       // ISO string
  messageCount: number;
}

export type DocumentType = 'rti' | 'complaint';

export interface DocumentDraft {
  id: string;
  type: DocumentType;
  title: string;           // e.g. "RTI to Municipal Corporation"
  department?: string;     // RTI dept or complaint location
  language: Language;
  preview: string;         // First 120 chars of generated text
  generatedAt: string;     // ISO string
}

export interface SessionStats {
  totalQuestions: number;
  totalDocuments: number;
  rtiDrafts: number;
  complaintDrafts: number;
  lastActiveAt: string | null;
  firstVisitAt: string | null;
  currentStreak: number;   // days
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  CHAT_SESSIONS: 'ns_chat_sessions',
  DOCUMENT_DRAFTS: 'ns_document_drafts',
  STATS: 'ns_stats',
  PREFERRED_LANG: 'ns_preferred_lang',
  ACTIVE_SESSION: 'ns_active_session_id',
} as const;

// ─── Safe storage helpers ─────────────────────────────────────────────────────

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or private mode — silently fail
  }
}

// ─── Chat Sessions ────────────────────────────────────────────────────────────

export function getAllChatSessions(): ChatSession[] {
  return safeRead<ChatSession[]>(KEYS.CHAT_SESSIONS, []);
}

export function getRecentChatSessions(limit = 5): ChatSession[] {
  const sessions = getAllChatSessions();
  return sessions
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export function getChatSessionById(id: string): ChatSession | null {
  const sessions = getAllChatSessions();
  return sessions.find(s => s.id === id) ?? null;
}

export function saveChatSession(session: ChatSession): void {
  const sessions = getAllChatSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.unshift(session);
  }
  // Keep only the last 50 sessions
  const trimmed = sessions.slice(0, 50);
  safeWrite(KEYS.CHAT_SESSIONS, trimmed);
}

export function deleteChatSession(id: string): void {
  const sessions = getAllChatSessions().filter(s => s.id !== id);
  safeWrite(KEYS.CHAT_SESSIONS, sessions);
}

export function clearAllChatSessions(): void {
  safeWrite(KEYS.CHAT_SESSIONS, []);
}

export function getActiveSessionId(): string | null {
  return safeRead<string | null>(KEYS.ACTIVE_SESSION, null);
}

export function setActiveSessionId(id: string | null): void {
  safeWrite(KEYS.ACTIVE_SESSION, id);
}

/**
 * Creates a new ChatSession object. Call saveChatSession() to persist it.
 */
export function createChatSession(
  firstMessage: string,
  language: Language = 'en'
): ChatSession {
  const now = new Date().toISOString();
  return {
    id: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: firstMessage.slice(0, 60) + (firstMessage.length > 60 ? '…' : ''),
    messages: [],
    language,
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
  };
}

// ─── Document Drafts ──────────────────────────────────────────────────────────

export function getAllDocumentDrafts(): DocumentDraft[] {
  return safeRead<DocumentDraft[]>(KEYS.DOCUMENT_DRAFTS, []);
}

export function getRecentDocumentDrafts(limit = 5): DocumentDraft[] {
  return getAllDocumentDrafts()
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
    .slice(0, limit);
}

export function saveDocumentDraft(draft: Omit<DocumentDraft, 'id' | 'generatedAt'>): DocumentDraft {
  const newDraft: DocumentDraft = {
    ...draft,
    id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    generatedAt: new Date().toISOString(),
  };
  const drafts = getAllDocumentDrafts();
  drafts.unshift(newDraft);
  // Keep only the last 30 drafts
  safeWrite(KEYS.DOCUMENT_DRAFTS, drafts.slice(0, 30));
  recordActivity('document');
  return newDraft;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function getStats(): SessionStats {
  return safeRead<SessionStats>(KEYS.STATS, {
    totalQuestions: 0,
    totalDocuments: 0,
    rtiDrafts: 0,
    complaintDrafts: 0,
    lastActiveAt: null,
    firstVisitAt: null,
    currentStreak: 0,
  });
}

export function recordActivity(type: 'question' | 'document' | 'rti' | 'complaint'): void {
  const stats = getStats();
  const now = new Date().toISOString();

  if (!stats.firstVisitAt) stats.firstVisitAt = now;
  stats.lastActiveAt = now;

  if (type === 'question') stats.totalQuestions++;
  if (type === 'document')  stats.totalDocuments++;
  if (type === 'rti') { stats.totalDocuments++; stats.rtiDrafts++; }
  if (type === 'complaint') { stats.totalDocuments++; stats.complaintDrafts++; }

  safeWrite(KEYS.STATS, stats);
}

// ─── Greeting ─────────────────────────────────────────────────────────────────

export function getTimeGreeting(lang: Language = 'en'): string {
  const hour = new Date().getHours();
  const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';

  const greetings: Record<Language, Record<string, string>> = {
    en: {
      morning:   'Good morning',
      afternoon: 'Good afternoon',
      evening:   'Good evening',
      night:     'Good evening',
    },
    hi: {
      morning:   'शुभ प्रभात',
      afternoon: 'नमस्ते',
      evening:   'शुभ संध्या',
      night:     'नमस्ते',
    },
    mr: {
      morning:   'शुभ सकाळ',
      afternoon: 'नमस्कार',
      evening:   'शुभ संध्याकाळ',
      night:     'नमस्कार',
    },
  };

  return greetings[lang][period];
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now  = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins  = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays  = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1)    return 'just now';
  if (diffMins < 60)   return `${diffMins}m ago`;
  if (diffHours < 24)  return `${diffHours}h ago`;
  if (diffDays === 1)  return 'yesterday';
  if (diffDays < 7)    return `${diffDays} days ago`;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function getPreferredLanguage(): Language {
  return safeRead<Language>(KEYS.PREFERRED_LANG, 'en');
}

export function setPreferredLanguage(lang: Language): void {
  safeWrite(KEYS.PREFERRED_LANG, lang);
}

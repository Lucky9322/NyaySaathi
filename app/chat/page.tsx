'use client';
import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Send, Bot, User, AlertTriangle, RefreshCw, Copy, Check,
  Sparkles, Plus, Trash2, Clock, Menu,
  MessageSquare, Shield,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { t } from '@/lib/translations';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  createChatSession,
  saveChatSession,
  getRecentChatSessions,
  getChatSessionById,
  deleteChatSession,
  setActiveSessionId,
  recordActivity,
  formatRelativeTime,
  type ChatSession,
  type ChatMessage,
  type Language,
} from '@/lib/session';

// ─── Suggested questions ──────────────────────────────────────────────────────

const CATEGORIES = {
  en: [
    {
      label: 'RTI',
      questions: [
        'How do I file an RTI application?',
        'Who can file RTI? Is there a fee?',
        'What if I get no reply in 30 days?',
        'How to file a first appeal under RTI?',
      ],
    },
    {
      label: 'FIR / Police',
      questions: [
        'What if police refuse to register my FIR?',
        'What is a Zero FIR?',
        'Can I file an e-FIR online?',
        'What are my rights after arrest?',
      ],
    },
    {
      label: 'Consumer',
      questions: [
        'How to file a consumer complaint online?',
        'What is the consumer complaint fee?',
        'Can I get a product refund forcefully?',
      ],
    },
    {
      label: 'Rights',
      questions: [
        'What are my fundamental rights?',
        'Can police search my house without a warrant?',
        'What is the right to silence?',
      ],
    },
  ],
  hi: [
    {
      label: 'RTI',
      questions: [
        'RTI आवेदन कैसे दाखिल करें?',
        'RTI फीस क्या है?',
        '30 दिन में जवाब न मिले तो?',
        'प्रथम अपील कैसे करें?',
      ],
    },
    {
      label: 'FIR / पुलिस',
      questions: [
        'पुलिस FIR दर्ज न करे तो क्या करें?',
        'Zero FIR क्या होता है?',
        'e-FIR ऑनलाइन कैसे दर्ज करें?',
        'गिरफ्तारी के बाद मेरे अधिकार क्या हैं?',
      ],
    },
    {
      label: 'उपभोक्ता',
      questions: [
        'उपभोक्ता शिकायत कैसे करें?',
        'शिकायत की फीस क्या है?',
        'रिफंड कैसे प्राप्त करें?',
      ],
    },
    {
      label: 'अधिकार',
      questions: [
        'मेरे मौलिक अधिकार क्या हैं?',
        'क्या पुलिस बिना वारंट तलाशी ले सकती है?',
        'मौन रहने का अधिकार क्या है?',
      ],
    },
  ],
  mr: [
    {
      label: 'RTI',
      questions: [
        'RTI अर्ज कसा दाखल करावा?',
        'RTI शुल्क किती आहे?',
        '30 दिवसांत उत्तर नाही तर?',
        'प्रथम अपील कसे करावे?',
      ],
    },
    {
      label: 'FIR / पोलीस',
      questions: [
        'पोलिस FIR नोंदवत नसल्यास काय?',
        'Zero FIR म्हणजे काय?',
        'e-FIR ऑनलाइन कशी नोंदवावी?',
        'अटकेनंतर माझे अधिकार काय?',
      ],
    },
    {
      label: 'ग्राहक',
      questions: [
        'ग्राहक तक्रार कशी करावी?',
        'तक्रारीचे शुल्क किती?',
        'परतावा कसा मिळवावा?',
      ],
    },
    {
      label: 'अधिकार',
      questions: [
        'माझे मूलभूत अधिकार काय?',
        'वॉरंटशिवाय पोलिस शोध घेऊ शकतात का?',
        'मौनाचा अधिकार काय आहे?',
      ],
    },
  ],
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function ChatSidebar({
  sessions,
  currentId,
  onSelect,
  onNew,
  onDelete,
  language,
}: {
  sessions: ChatSession[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  language: string;
}) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#f8f9fb', borderRight: '1px solid #e5e7eb' }}
    >
      {/* Header */}
      <div className="p-3" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <button
          id="new-chat-btn"
          onClick={onNew}
          className="btn-primary w-full text-xs py-2"
        >
          <Plus className="w-3.5 h-3.5" />
          {language === 'mr' ? 'नवी चॅट' : language === 'hi' ? 'नई चैट' : 'New Chat'}
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">
              {language === 'mr' ? 'अद्याप कोणतीही संभाषणे नाहीत'
              : language === 'hi' ? 'कोई बातचीत नहीं'
              : 'No conversations yet'}
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-start gap-2 px-2.5 py-2 rounded cursor-pointer transition-all duration-150 ${
                currentId === session.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-100 border border-transparent'
              }`}
              onClick={() => onSelect(session.id)}
            >
              <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                currentId === session.id ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate leading-snug ${
                  currentId === session.id ? 'text-blue-800' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {session.title}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="w-2.5 h-2.5 text-gray-400" />
                  <span className="text-[10px] text-gray-400">{formatRelativeTime(session.updatedAt)}</span>
                </div>
              </div>
              <button
                id={`delete-session-${session.id}`}
                onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-400 hover:text-red-500 transition-all"
                title="Delete conversation"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Suggested Questions ──────────────────────────────────────────────────────

function SuggestedQuestions({
  language,
  onSelect,
}: {
  language: string;
  onSelect: (q: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState(0);
  const cats = CATEGORIES[language as keyof typeof CATEGORIES] ?? CATEGORIES.en;
  const cat  = cats[activeCategory];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 max-w-xl mx-auto w-full">
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: '#1d4ed8', boxShadow: '0 4px 12px rgba(29,78,216,0.20)' }}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </div>

      <h2
        className="text-lg font-bold text-gray-900 mb-1"
        style={{ letterSpacing: '-0.02em' }}
      >
        {language === 'mr' ? 'नमस्कार! मी न्यायसाथी आहे.'
        : language === 'hi' ? 'नमस्ते! मैं न्यायसाथी हूं।'
        : 'Hello! I\'m NyayaSathi.'}
      </h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        {language === 'mr' ? 'कायदेशीर प्रश्न विचारा — Marathi, Hindi किंवा English मध्ये'
        : language === 'hi' ? 'कानूनी सवाल पूछें — हिंदी, मराठी या English में'
        : 'Ask legal questions in Marathi, Hindi, or English'}
      </p>

      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-4">
        {cats.map((c, i) => (
          <button
            key={i}
            onClick={() => setActiveCategory(i)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all border ${
              activeCategory === i
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="w-full space-y-2">
        {cat.questions.map((q, i) => (
          <button
            key={i}
            id={`suggested-q-${i}`}
            onClick={() => onSelect(q)}
            className="w-full text-left px-4 py-2.5 rounded-md text-sm text-gray-600
                       hover:text-gray-900 bg-white border border-gray-200
                       hover:border-blue-300 hover:shadow-sm
                       transition-all duration-150"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 flex items-start gap-2 text-left">
        <Shield className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-gray-400 leading-relaxed">
          {t(language as Language, 'disclaimer')}
        </p>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  copiedId,
  onCopy,
}: {
  msg: ChatMessage;
  copiedId: string | null;
  onCopy: (id: string, content: string) => void;
}) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 message-enter ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0`}
        style={isUser
          ? { background: '#eff6ff', border: '1px solid #bfdbfe' }
          : { background: '#f3f4f6', border: '1px solid #e5e7eb' }}
      >
        {isUser
          ? <User className="w-3.5 h-3.5 text-blue-600" />
          : <Bot className="w-3.5 h-3.5 text-gray-500" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[82%] flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}>
        <div
          className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
            isUser ? 'rounded-tr-sm' : 'rounded-tl-sm prose-legal'
          }`}
          style={isUser
            ? { background: '#1d4ed8', color: '#ffffff', border: '1px solid #1e40af' }
            : { background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <div className="prose-legal">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp + copy */}
        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-gray-400">
            {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && (
            <button
              onClick={() => onCopy(msg.id, msg.content)}
              title="Copy response"
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 transition-all"
            >
              {copiedId === msg.id
                ? <Check className="w-3 h-3 text-green-600" />
                : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Chat Inner (uses useSearchParams) ───────────────────────────────────────

function ChatInner() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const [sessions,       setSessions]       = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages,       setMessages]       = useState<ChatMessage[]>([]);
  const [input,          setInput]          = useState('');
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');
  const [copiedId,       setCopiedId]       = useState<string | null>(null);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const all = getRecentChatSessions(30);
    setSessions(all);

    const preQ = searchParams.get('q');
    if (preQ) setInput(preQ);

    const sessionId = searchParams.get('session');
    if (sessionId) {
      const found = getChatSessionById(sessionId);
      if (found) {
        setCurrentSession(found);
        setMessages(found.messages);
        setActiveSessionId(sessionId);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const refreshSessions = useCallback(() => setSessions(getRecentChatSessions(30)), []);

  const startNewChat = useCallback(() => {
    setCurrentSession(null);
    setMessages([]);
    setInput('');
    setError('');
    setActiveSessionId(null);
    setSidebarOpen(false);
  }, []);

  const selectSession = useCallback((id: string) => {
    const found = getChatSessionById(id);
    if (found) {
      setCurrentSession(found);
      setMessages(found.messages);
      setActiveSessionId(id);
      setSidebarOpen(false);
    }
  }, []);

  const removeSession = useCallback((id: string) => {
    deleteChatSession(id);
    refreshSessions();
    if (currentSession?.id === id) startNewChat();
  }, [currentSession, refreshSessions, startNewChat]);

  const copyMessage = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || loading) return;

    const now = new Date().toISOString();
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: now,
    };

    let session = currentSession;
    if (!session) {
      session = createChatSession(text, language as Language);
      setCurrentSession(session);
      setActiveSessionId(session.id);
    }

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setError('');
    recordActivity('question');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, parts: m.content })),
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get response');

      const modelMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'model',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, modelMsg];
      setMessages(finalMessages);

      const updatedSession: ChatSession = {
        ...session,
        messages: finalMessages,
        messageCount: finalMessages.length,
        updatedAt: new Date().toISOString(),
      };
      setCurrentSession(updatedSession);
      saveChatSession(updatedSession);
      refreshSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : t(language as Language, 'processingError'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 128) + 'px';
  };

  return (
    <div
      className="flex h-[calc(100vh-3.5rem-3rem)]"
      style={{ minHeight: 0, background: '#f5f6f8' }}
    >

      {/* ── Sidebar — Desktop ── */}
      <div className="hidden md:flex flex-col w-56 flex-shrink-0">
        <ChatSidebar
          sessions={sessions}
          currentId={currentSession?.id ?? null}
          onSelect={selectSession}
          onNew={startNewChat}
          onDelete={removeSession}
          language={language}
        />
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full z-50">
            <ChatSidebar
              sessions={sessions}
              currentId={currentSession?.id ?? null}
              onSelect={selectSession}
              onNew={startNewChat}
              onDelete={removeSession}
              language={language}
            />
          </div>
        </div>
      )}

      {/* ── Main Chat ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0"
          style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}
        >
          <button
            id="mobile-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden btn-ghost p-1.5"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div
            className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: '#1d4ed8' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 leading-tight">
              {currentSession?.title ?? (language === 'mr' ? 'AI कायदेशीर सहाय्यक' : language === 'hi' ? 'AI कानूनी सहायक' : 'AI Legal Assistant')}
            </h1>
            <p className="text-[10px] text-gray-400">Powered by Google Gemini · Marathi / Hindi / English</p>
          </div>
          {currentSession && (
            <button
              id="new-chat-header-btn"
              onClick={startNewChat}
              title="New conversation"
              className="btn-ghost p-1.5"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ minHeight: 0 }}>
          {messages.length === 0 ? (
            <SuggestedQuestions language={language} onSelect={sendMessage} />
          ) : (
            messages.map(msg => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                copiedId={copiedId}
                onCopy={copyMessage}
              />
            ))
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 message-enter">
              <div
                className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: '#f3f4f6', border: '1px solid #e5e7eb' }}
              >
                <Bot className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div
                className="px-4 py-3 rounded-xl rounded-tl-sm"
                style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
              >
                <div className="flex items-center gap-1.5 h-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 typing-dot" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 typing-dot" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 typing-dot" />
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert-error">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError('')}>
                <RefreshCw className="w-3.5 h-3.5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="flex-shrink-0 px-4 py-3"
          style={{ background: '#ffffff', borderTop: '1px solid #e5e7eb' }}
        >
          <div
            className="flex gap-2 items-end rounded-lg border border-gray-300 focus-within:border-blue-500 px-3 py-2.5 transition-all bg-white"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <textarea
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t(language as Language, 'placeholder')}
              rows={1}
              disabled={loading}
              className="flex-1 bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-400 text-sm min-h-[1.5rem] max-h-32 py-0 leading-relaxed"
              style={{ scrollbarWidth: 'none' }}
            />
            <button
              id="send-message-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              title="Send message"
              className="btn-primary px-3 py-1.5 flex-shrink-0 rounded disabled:opacity-30"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-center text-gray-400 text-[10px] mt-2">
            {language === 'mr' ? 'Enter पाठवा · Shift+Enter नवी ओळ'
            : language === 'hi' ? 'Enter भेजें · Shift+Enter नई लाइन'
            : 'Enter to send · Shift+Enter for new line'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="flex gap-1.5 items-center">
          <div className="w-2 h-2 rounded-full bg-blue-400 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-blue-400 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-blue-400 typing-dot" />
        </div>
      </div>
    }>
      <ChatInner />
    </Suspense>
  );
}

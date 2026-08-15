'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, RefreshCw, Copy, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { t } from '@/lib/translations';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS: Record<string, string[]> = {
  en: [
    'How do I file an RTI application?',
    'What are my rights if police refuse to register FIR?',
    'How to file a consumer complaint online?',
    'What are my fundamental rights under the Constitution?',
    'How long does RTI take? What if I get no reply?',
  ],
  hi: [
    'RTI आवेदन कैसे दाखिल करें?',
    'अगर पुलिस FIR दर्ज करने से मना करे तो क्या करें?',
    'ऑनलाइन उपभोक्ता शिकायत कैसे दर्ज करें?',
    'संविधान के तहत मेरे मौलिक अधिकार क्या हैं?',
    'RTI का जवाब न आने पर क्या करें?',
  ],
  mr: [
    'RTI अर्ज कसा दाखल करावा?',
    'पोलिस FIR नोंदवण्यास नकार दिल्यास काय करावे?',
    'ऑनलाइन ग्राहक तक्रार कशी दाखल करावी?',
    'राज्यघटनेनुसार माझे मूलभूत अधिकार काय आहेत?',
    'RTI ला उत्तर न आल्यास काय करावे?',
  ],
};

export default function ChatPage() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyMessage = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText ?? input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const allMessages = [...messages, userMessage];
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, parts: m.content })),
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get response');

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t(language, 'processingError'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = QUICK_PROMPTS[language] || QUICK_PROMPTS.en;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col" style={{ height: 'calc(100vh - 4rem - 3.5rem)' }}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">{t(language, 'chat')}</h1>
            <p className="text-white/50 text-xs">Powered by Google Gemini · Marathi / Hindi / English</p>
          </div>
        </div>
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-200/70 text-xs leading-relaxed">{t(language, 'disclaimer')}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 min-h-0">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-4 border border-orange-500/20">
              <Bot className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-white/60 mb-2">
              {language === 'mr' ? 'नमस्ते! मी तुमचा कायदेशीर सहाय्यक आहे.' : language === 'hi' ? 'नमस्ते! मैं आपका कानूनी सहायक हूं।' : 'Hello! I\'m your AI legal assistant.'}
            </p>
            <p className="text-white/40 text-sm mb-6">
              {language === 'mr' ? 'खालील प्रश्नांपैकी एक निवडा किंवा स्वतःचा प्रश्न विचारा' : language === 'hi' ? 'नीचे से कोई सवाल चुनें या अपना सवाल पूछें' : 'Choose a question below or ask your own'}
            </p>
            <div className="w-full max-w-lg space-y-2">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/30 text-white/70 hover:text-white text-sm transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 message-enter ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-blue-500/20 border border-blue-500/30'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-orange-400" /> : <Bot className="w-4 h-4 text-blue-400" />}
            </div>
            <div className={`max-w-[80%] group ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-orange-500/20 border border-orange-500/20 text-white rounded-tr-sm' : 'bg-white/5 border border-white/10 text-white/85 rounded-tl-sm prose-legal'}`}>
                {msg.role === 'user' ? (
                  <p>{msg.content}</p>
                ) : (
                  <div className="prose-legal text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-white/25 text-[10px]">
                  {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.role === 'model' && (
                  <button
                    onClick={() => copyMessage(msg.id, msg.content)}
                    className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/60 transition-all"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10">
              <div className="flex gap-1.5 items-center h-4">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 typing-dot" />
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 typing-dot" />
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 typing-dot" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto"><RefreshCw className="w-4 h-4" /></button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="card p-3 flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t(language, 'placeholder')}
          rows={1}
          disabled={loading}
          className="flex-1 bg-transparent border-none outline-none resize-none text-white placeholder-white/30 text-sm max-h-32 min-h-[2rem] py-1"
          style={{ scrollbarWidth: 'none' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="btn-primary px-3 py-2 flex-shrink-0 rounded-xl"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-center text-white/20 text-[10px] mt-2">Press Enter to send · Shift+Enter for new line</p>
    </div>
  );
}

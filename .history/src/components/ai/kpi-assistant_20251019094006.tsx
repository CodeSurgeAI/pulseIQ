"use client";

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X, Mic, Volume2, Square, Radio, Settings as Gear } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateSuggestions, answerLeadershipQuestion, detectIntent } from '@/utils/kpi-assistant';
import { cn } from '@/utils';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/use-auth';

interface KpiAssistantProps {
  className?: string;
}

type ChatMessage = { role: 'assistant' | 'user'; text: string };

export function KpiAssistant({ className }: KpiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [silenceMs, setSilenceMs] = useState<15000 | 25000 | 40000>(25000);
  const [concisePrompts, setConcisePrompts] = useState(false);
  const silenceTimerRef = useRef<number | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const configRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = usePermissions();

  // Speech recognition setup (Web Speech API)
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const supportsSpeech = typeof window !== 'undefined' && (
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
  const supportsTTS = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Speak helper (in-component to control speaking state)
  const speak = (text: string, onEnd?: () => void) => {
    if (!supportsTTS) { onEnd && onEnd(); return; }
    try {
      setSpeaking(true);
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1; utter.pitch = 1; utter.volume = 1;
      utter.onend = () => { setSpeaking(false); onEnd && onEnd(); };
      (window as any).speechSynthesis.cancel();
      (window as any).speechSynthesis.speak(utter);
    } catch {
      setSpeaking(false);
      onEnd && onEnd();
    }
  };

  const cancelSpeak = () => {
    if (!supportsTTS) return;
    try { (window as any).speechSynthesis.cancel(); } catch {}
  };

  const safeStartListening = () => {
    if (supportsSpeech && !listening && !speaking) startListening();
  };

  const startLiveTalk = () => {
    setLiveMode(true);
    const intro = "Live talk enabled. I'm listening. Ask a question or say a command.";
    speak(intro, () => { safeStartListening(); });
  };

  const stopLiveTalk = () => {
    setLiveMode(false);
    cancelSpeak();
    if (listening) stopListening();
  };

  // Initialize with greeting + top suggestions
  useEffect(() => {
    if (open) {
      const sugs = generateSuggestions();
      const top = sugs.slice(0, 2)
        .map(s => `• ${s.title}: ${s.actions[0]}`)
        .join('\n');
      setMessages([
        {
          role: 'assistant',
          text:
            'Hello leadership team — I’m your KPI assistant. I’ll keep this concise and actionable.\n' +
            'Here are quick wins based on current KPIs:\n' + top,
        },
      ]);
    }
  }, [open]);

  // Auto-scroll to latest
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Close behavior: keep popover unless explicit close; close config on outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // no auto-close to prevent accidental dismiss
      }
      // close settings panel if click outside
      if (showConfig && configRef.current && !configRef.current.contains(e.target as Node)) {
        setShowConfig(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showConfig]);

  const send = (q: string) => {
    const query = q.trim();
    if (!query) return;
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');
    setTyping(true);
    // Simulate small thinking delay
    setTimeout(() => {
      // Check intent for actions first
      const action = detectIntent(query);
      if (action.type === 'navigate') {
        router.push(action.path);
        const msg = `Navigating to ${action.path}…`;
        setMessages(prev => [...prev, { role: 'assistant', text: msg }]);
        if (ttsEnabled || liveMode) speak(msg, () => { if (liveMode) safeStartListening(); });
      } else if (action.type === 'markAllNotifications') {
        const event = new CustomEvent('pulseiq:markAllNotifications');
        window.dispatchEvent(event);
        const msg = 'All notifications marked as read.';
        setMessages(prev => [...prev, { role: 'assistant', text: msg }]);
        if (ttsEnabled || liveMode) speak(msg, () => { if (liveMode) safeStartListening(); });
      } else if (action.type === 'openSettings') {
        const event = new CustomEvent('pulseiq:openSettings');
        window.dispatchEvent(event);
        const msg = 'Opening settings.';
        setMessages(prev => [...prev, { role: 'assistant', text: msg }]);
        if (ttsEnabled || liveMode) speak(msg, () => { if (liveMode) safeStartListening(); });
      } else if (action.type === 'insight') {
        const msg = action.content;
        setMessages(prev => [...prev, { role: 'assistant', text: msg }]);
        if (ttsEnabled || liveMode) speak(msg, () => { if (liveMode) safeStartListening(); });
      } else {
        const a = answerLeadershipQuestion(query, user?.role);
        setMessages(prev => [...prev, { role: 'assistant', text: a }]);
        if (ttsEnabled || liveMode) speak(a, () => { if (liveMode) safeStartListening(); });
      }
      setTyping(false);
    }, 300);
  };

  const quickPrompts = [
    'How do we reduce readmissions?',
    'What’s our wait time and a quick fix?',
    'Ways to control costs without hurting care?',
  ];

  // Start speech recognition
  const startListening = () => {
    if (!supportsSpeech || listening) return;
    const SpeechRecognitionCtor: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition: SpeechRecognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    let finalTranscript = '';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalTranscript += res[0].transcript;
        else interim += res[0].transcript;
      }
      // Optionally show interim as typing indicator text later
      // Reset silence timer on any result
      resetSilenceTimer();
    };

    recognition.onend = () => {
      setListening(false);
      if (finalTranscript.trim()) {
        send(finalTranscript.trim());
      } else if (liveMode) {
        // No final speech; reprompt user if in live mode
        const msg = concisePrompts ? 'I’m listening.' : 'I didn’t catch that. What would you like to do?';
        speak(msg, () => safeStartListening());
      }
    };

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  // Stop speech recognition
  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
    clearSilenceTimer();
  };

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const resetSilenceTimer = () => {
    if (!liveMode) return;
    clearSilenceTimer();
    silenceTimerRef.current = window.setTimeout(() => {
      if (listening && !speaking) {
        const msg = concisePrompts ? 'I’m listening.' : 'Whenever you’re ready—what should we do next?';
        speak(msg, () => safeStartListening());
      }
    }, silenceMs);
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(v => !v)}
        className="relative"
        title="KPI Assistant"
        aria-label="Open KPI Assistant"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-[30rem] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 ring-1 ring-black/5 origin-top-right transition-all duration-150 ease-out animate-[fadeIn_100ms_ease-out]"
          style={{
            transformOrigin: 'top right',
          }}
        >
          {/* Header */}
          <div className="relative overflow-visible rounded-t-xl">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">AI</div>
                  <div>
                    <h3 className="font-semibold">Hospital KPI Assistant</h3>
                    <p className="text-[11px] text-white/80">Polite, actionable guidance — updated from your KPIs</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 relative">
                  {/* Live Talk (icon-only) */}
                  {supportsSpeech && supportsTTS && (
                    <button
                      onClick={() => { if (!liveMode) startLiveTalk(); else stopLiveTalk(); }}
                      className={cn('p-2 rounded-md hover:bg-white/10 transition', liveMode && 'bg-white/10')}
                      title={liveMode ? 'Live talk on' : 'Start live talk'}
                      aria-label="Live talk"
                    >
                      <Radio className={cn('h-4 w-4', liveMode && 'animate-pulse')} />
                    </button>
                  )}
                  {/* TTS (icon-only) */}
                  <button
                    onClick={() => setTtsEnabled(v => !v)}
                    className={cn('p-2 rounded-md hover:bg-white/10 transition', ttsEnabled && 'bg-white/10')}
                    title={ttsEnabled ? 'Voice answers on' : 'Voice answers off'}
                    aria-label="Toggle voice answers"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  {/* Mic (icon-only) */}
                  {supportsSpeech && !listening && (
                    <button
                      onClick={startListening}
                      className="p-2 rounded-md hover:bg-white/10 transition"
                      title="Start voice input"
                      aria-label="Start voice input"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  )}
                  {supportsSpeech && listening && (
                    <button
                      onClick={stopListening}
                      className="p-2 rounded-md hover:bg-white/10 transition"
                      title="Stop voice input"
                      aria-label="Stop voice input"
                    >
                      <Square className="h-4 w-4" />
                    </button>
                  )}
                  {/* Gear menu for advanced settings */}
                  <div className="relative" ref={configRef}>
                    <button
                      onClick={() => setShowConfig(v => !v)}
                      className={cn('p-2 rounded-md hover:bg-white/10 transition', showConfig && 'bg-white/10')}
                      title="Assistant settings"
                      aria-label="Assistant settings"
                    >
                      <Gear className="h-4 w-4" />
                    </button>
                    {showConfig && (
                      <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg border border-gray-200 z-50 p-3">
                        <div className="text-xs font-semibold text-gray-600 mb-2">Live Talk</div>
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-1">Silence timeout</div>
                          <div className="flex gap-2">
                            {[15000, 25000, 40000].map(val => (
                              <button
                                key={val}
                                onClick={() => setSilenceMs(val as any)}
                                className={cn('px-2.5 py-1 text-xs rounded border', silenceMs === val ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 hover:bg-gray-100')}
                              >
                                {val === 15000 ? 'Short' : val === 25000 ? 'Medium' : 'Long'}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Prompt style</div>
                          <button
                            onClick={() => setConcisePrompts(v => !v)}
                            className={cn('px-2.5 py-1 text-xs rounded border', concisePrompts ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 hover:bg-gray-100')}
                          >
                            {concisePrompts ? 'Concise' : 'Standard'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Close */}
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white hover:bg-white/10">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="px-4 pt-3 pb-2 bg-white">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => send(p)}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div ref={listRef} className="px-4 pb-3 max-h-96 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={cn('flex', m.role === 'assistant' ? 'justify-start' : 'justify-end')}>
                <div className={cn(
                  'max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm',
                  m.role === 'assistant'
                    ? 'bg-gray-100 text-gray-900 rounded-tl-none'
                    : 'bg-blue-600 text-white rounded-tr-none'
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-none px-3 py-2 text-sm shadow-sm">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-500/70 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500/70 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500/70 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  </span>
                </div>
              </div>
            )}
            {liveMode && listening && (
              <div className="flex justify-start">
                <div className="bg-green-50 text-green-800 rounded-2xl rounded-tl-none px-3 py-1.5 text-xs shadow-sm inline-flex items-center gap-2">
                  <Radio className="h-3 w-3 animate-pulse" /> Listening…
                </div>
              </div>
            )}
            {liveMode && speaking && (
              <div className="flex justify-start">
                <div className="bg-indigo-50 text-indigo-800 rounded-2xl rounded-tl-none px-3 py-1.5 text-xs shadow-sm inline-flex items-center gap-2">
                  <Volume2 className="h-3 w-3" /> Speaking…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(input); }}
                placeholder="Ask about wait times, readmissions, or costs…"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Ask a KPI question"
              />
              <Button size="sm" onClick={() => send(input)} className="rounded-full">
                <Send className="h-4 w-4 mr-1" /> Send
              </Button>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Local-only heuristics from your KPIs. No data leaves PulseIQ.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Voice helpers ---
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
  }
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    start: () => void;
    stop: () => void;
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }
}

// speak() moved inside component to control state


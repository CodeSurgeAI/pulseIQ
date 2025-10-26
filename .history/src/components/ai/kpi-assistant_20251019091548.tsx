"use client";

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateSuggestions, answerLeadershipQuestion } from '@/utils/kpi-assistant';
import { cn } from '@/utils';

interface KpiAssistantProps {
  className?: string;
}

type ChatMessage = { role: 'assistant' | 'user'; text: string };

export function KpiAssistant({ className }: KpiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  // Close behavior: keep popover unless explicit close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // no auto-close to prevent accidental dismiss
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const send = (q: string) => {
    const query = q.trim();
    if (!query) return;
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');
    setTyping(true);
    // Simulate small thinking delay
    setTimeout(() => {
      const a = answerLeadershipQuestion(query);
      setMessages(prev => [...prev, { role: 'assistant', text: a }]);
      setTyping(false);
    }, 300);
  };

  const quickPrompts = [
    'How do we reduce readmissions?',
    'What’s our wait time and a quick fix?',
    'Ways to control costs without hurting care?',
  ];

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
          <div className="relative overflow-hidden rounded-t-xl">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">AI</div>
                  <div>
                    <h3 className="font-semibold">Hospital KPI Assistant</h3>
                    <p className="text-[11px] text-white/80">Polite, actionable guidance — updated from your KPIs</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white hover:bg-white/10">
                  <X className="h-4 w-4" />
                </Button>
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

"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateSuggestions, answerLeadershipQuestion, AssistantSuggestion } from '@/utils/kpi-assistant';
import { cn } from '@/utils';

interface KpiAssistantProps {
  className?: string;
}

export function KpiAssistant({ className }: KpiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AssistantSuggestion[]>([]);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSuggestions(generateSuggestions());
    }
  }, [open]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // do not close automatically to avoid surprise dismissals
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleAsk = () => {
    const q = input.trim();
    if (!q) return;
    const a = answerLeadershipQuestion(q);
    setAnswers(prev => [
      `You: ${q}`,
      `Assistant: ${a}`,
      ...prev,
    ]);
    setInput('');
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(v => !v)}
        className="relative"
        title="KPI Assistant"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-[28rem] bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900">Hospital KPI Assistant</h3>
              <p className="text-xs text-gray-500">Polite guidance for leadership, based on real-time KPIs</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y">
            {suggestions.map(s => (
              <div key={s.id} className="p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{s.pillar.replace('_', ' ')}</div>
                <h4 className="font-medium text-gray-900">{s.title}</h4>
                <p className="text-sm text-gray-700 mt-1">{s.summary}</p>
                <ul className="list-disc pl-5 text-sm text-gray-700 mt-2 space-y-1">
                  {s.actions.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
            {answers.length > 0 && (
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">Recent Q&A</h4>
                <div className="space-y-2 text-sm">
                  {answers.map((a, i) => (
                    <div key={i} className="text-gray-700 whitespace-pre-wrap">{a}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
                placeholder="Ask about wait times, readmissions, cost…"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button size="sm" onClick={handleAsk}>
                <Send className="h-4 w-4 mr-1" /> Ask
              </Button>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">This assistant uses current dashboard KPIs and built-in heuristics. No data is sent outside PulseIQ.</p>
          </div>
        </div>
      )}
    </div>
  );
}

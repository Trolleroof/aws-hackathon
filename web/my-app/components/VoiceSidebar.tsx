'use client';

import { useEffect, useState, useRef } from 'react';
import { AgentNode } from '@/types/ideaGraph';
import { AGENT_DESCRIPTIONS } from '@/data/agentNodes';

type ChatLine = { role: 'assistant' | 'user'; text: string; time: string };

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
  error?: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const VISUALIZER_BARS = 14;
const VISUALIZER_DELAYS = Array.from({ length: VISUALIZER_BARS }, (_, i) => -(i % 5) * 0.12);

interface VoiceSidebarProps {
  selectedNode: AgentNode | null;
  onProcessIdea: (transcript: string) => void;
  isProcessing: boolean;
}

export function VoiceSidebar({ selectedNode, onProcessIdea, isProcessing }: VoiceSidebarProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<ChatLine[]>([
    {
      role: 'assistant',
      text: 'Ready to hear your startup idea. Click the mic and brain dump away!',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [draftIdea, setDraftIdea] = useState('');

  // Web Speech API ref (placeholder - will be replaced with Nova)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const isRecordingRef = useRef(false);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Initialize Web Speech API (placeholder for Nova)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      recognitionRef.current = null;
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const spokenText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += spokenText + ' ';
        }
      }

      if (finalTranscript) {
        setCurrentTranscript(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (isRecordingRef.current) {
        try {
          recognition.start();
        } catch {
          // no-op
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
      } catch {
        // no-op
      }
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) {
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setTranscript(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "Voice input isn't available in this browser. Type your idea below instead.",
          time
        }
      ]);
      return;
    }
    setCurrentTranscript('');
    setIsRecording(true);
    try {
      recognitionRef.current.start();
    } catch {
      // no-op
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    try {
      recognitionRef.current?.stop();
    } catch {
      // no-op
    }

    if (currentTranscript.trim()) {
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setTranscript(prev => [...prev, { role: 'user', text: currentTranscript.trim(), time }]);
    }
    setCurrentTranscript('');
  };

  const submitTypedIdea = () => {
    const text = draftIdea.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setTranscript(prev => [...prev, { role: 'user', text, time }]);
    setDraftIdea('');
  };

  const handleProcessIdea = () => {
    const pendingTyped = draftIdea.trim();
    const pendingSpoken = currentTranscript.trim();

    if (pendingTyped || pendingSpoken || transcript.some(t => t.role === 'user')) {
      const fullTranscript = transcript
        .filter(t => t.role === 'user')
        .map(t => t.text)
        .concat([pendingTyped, pendingSpoken].filter(Boolean))
        .join(' ');

      onProcessIdea(fullTranscript.trim());

      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setTranscript(prev => [
        ...prev,
        ...(pendingTyped ? [{ role: 'user' as const, text: pendingTyped, time }] : []),
        ...(pendingSpoken ? [{ role: 'user' as const, text: pendingSpoken, time }] : []),
        {
          role: 'assistant',
          text: 'Processing your idea through all 5 agents...',
          time
        }
      ]);
      setDraftIdea('');
      setCurrentTranscript('');
    }
  };

  // Get selected node info
  const nodeInfo = selectedNode ? AGENT_DESCRIPTIONS[selectedNode.type] : null;
  const visualizerActive = isRecording || isProcessing;

  return (
    <div className="w-[380px] h-full flex flex-col border-l border-white/10 bg-[#05070d]/90 relative overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xs font-semibold tracking-[0.18em] text-white uppercase">Brain Dump</h2>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Ready'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              isProcessing
                ? 'border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed'
                : isRecording
                  ? 'border-red-500/50 bg-red-500/20 hover:bg-red-500/30 text-red-400 scale-110'
                  : 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
            }`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Visualizer */}
      <div className="h-[140px] flex items-center justify-center gap-1.5 px-6 py-4 relative z-10 border-b border-white/5">
        {Array.from({ length: VISUALIZER_BARS }).map((_, idx) => (
          <div
            key={idx}
            className={`w-1 rounded-full ${
              isRecording ? 'bg-red-400/80' : isProcessing ? 'bg-amber-400/80' : 'bg-slate-700/50'
            } ${visualizerActive ? 'animate-music-bar' : ''}`}
            style={{
              height: '20%',
              animationDelay: `${VISUALIZER_DELAYS[idx]}s`
            }}
          />
        ))}
      </div>

      {/* Selected Node Info Panel */}
      {selectedNode && nodeInfo && (
        <div className="p-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{nodeInfo.icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-white">{nodeInfo.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedNode.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' :
                selectedNode.status === 'processing' ? 'bg-amber-500/20 text-amber-400' :
                selectedNode.status === 'error' ? 'bg-red-500/20 text-red-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {selectedNode.status}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{nodeInfo.description}</p>

          {/* Show content if available */}
          {selectedNode.content && (
            <div className="mt-3 p-3 bg-black/30 rounded-lg max-h-[200px] overflow-y-auto">
              <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                {JSON.stringify(selectedNode.content, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 z-10 scrollbar-hide">
        {transcript.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
              msg.role === 'assistant'
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-white/5 border-white/10'
            }`}>
              {msg.role === 'assistant' ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ) : (
                <span className="text-xs text-slate-200 font-medium">ME</span>
              )}
            </div>
            <div className={`space-y-1 flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`flex items-center justify-between ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                  {msg.role === 'assistant' ? 'System' : 'You'}
                </div>
                <span className="text-[10px] text-slate-600">{msg.time}</span>
              </div>
              <div className={`text-sm leading-relaxed ${msg.role === 'assistant' ? 'text-slate-300' : 'text-white'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Live transcript while recording */}
        {isRecording && currentTranscript && (
          <div className="flex gap-4 flex-row-reverse opacity-70">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-white/5 border-white/10">
              <span className="text-xs text-slate-200 font-medium">ME</span>
            </div>
            <div className="space-y-1 flex-1 text-right">
              <div className="flex items-center justify-between flex-row-reverse">
                <div className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">You</div>
                <span className="text-[10px] text-slate-700">Live...</span>
              </div>
              <div className="text-sm leading-relaxed text-slate-200">{currentTranscript}</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 bg-[#05070d]/90 z-20">
        <div className="text-center text-xs text-slate-500 mb-4">
          {isRecording
            ? 'Recording your brain dump...'
            : isProcessing
              ? 'Analyzing your idea...'
              : 'Click mic to start (or type below), then Process'}
        </div>

        {/* Typed fallback / quick edit */}
        <div className="mb-4 flex items-stretch gap-2">
          <textarea
            value={draftIdea}
            onChange={(e) => setDraftIdea(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submitTypedIdea();
              }
            }}
            placeholder="Type your startup idea…"
            disabled={isRecording || isProcessing}
            rows={2}
            className="flex-1 resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50"
          />
          <button
            onClick={submitTypedIdea}
            disabled={isRecording || isProcessing || !draftIdea.trim()}
            className={`w-11 rounded-lg border transition-all ${
              isRecording || isProcessing || !draftIdea.trim()
                ? 'border-white/10 bg-white/5 text-slate-600 cursor-not-allowed'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
            }`}
            title="Add to transcript (Ctrl/Cmd+Enter)"
          >
            <svg className="mx-auto h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>

        {/* Process Button */}
        <button
          onClick={handleProcessIdea}
          disabled={isRecording || isProcessing || (!draftIdea.trim() && !currentTranscript.trim() && !transcript.some(t => t.role === 'user'))}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
            isRecording || isProcessing || (!draftIdea.trim() && !currentTranscript.trim() && !transcript.some(t => t.role === 'user'))
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Process Idea'
          )}
        </button>

        {/* Nova placeholder notice */}
        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400 text-center">
            Nova integration coming soon. Using Web Speech API as placeholder.
          </p>
        </div>
      </div>
    </div>
  );
}

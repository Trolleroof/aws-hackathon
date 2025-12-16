'use client';

import { useEffect, useState, useRef } from 'react';
import { AgentNode } from '@/types/ideaGraph';
import { AGENT_DESCRIPTIONS } from '@/data/agentNodes';

type ChatLine = { role: 'assistant' | 'user'; text: string; time: string };

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

  // Audio visualizer state
  const [barHeights, setBarHeights] = useState<number[]>(Array(14).fill(20));
  const [barDelays, setBarDelays] = useState<number[]>(Array(14).fill(0));

  // Web Speech API ref (placeholder - will be replaced with Nova)
  const recognitionRef = useRef<any>(null);

  // Set stable delays on client
  useEffect(() => {
    setBarDelays(Array.from({ length: 14 }, (_, i) => -(i % 5) * 0.12));
  }, []);

  // Animate heights when recording
  useEffect(() => {
    if (!isRecording) {
      setBarHeights(Array(14).fill(20));
      return;
    }
    const interval = setInterval(() => {
      setBarHeights(Array.from({ length: 14 }, () => 15 + Math.random() * 60));
    }, 140);
    return () => clearInterval(interval);
  }, [isRecording]);

  // Initialize Web Speech API (placeholder for Nova)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setCurrentTranscript(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          // Restart if still supposed to be recording
          recognitionRef.current?.start();
        }
      };
    }
  }, [isRecording]);

  const startRecording = () => {
    setCurrentTranscript('');
    setIsRecording(true);
    recognitionRef.current?.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current?.stop();

    if (currentTranscript.trim()) {
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setTranscript(prev => [...prev, { role: 'user', text: currentTranscript.trim(), time }]);
    }
  };

  const handleProcessIdea = () => {
    if (currentTranscript.trim() || transcript.some(t => t.role === 'user')) {
      const fullTranscript = transcript
        .filter(t => t.role === 'user')
        .map(t => t.text)
        .join(' ') + ' ' + currentTranscript;

      onProcessIdea(fullTranscript.trim());

      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setTranscript(prev => [...prev, {
        role: 'assistant',
        text: 'Processing your idea through all 5 agents...',
        time
      }]);
    }
  };

  // Get selected node info
  const nodeInfo = selectedNode ? AGENT_DESCRIPTIONS[selectedNode.type] : null;

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
        {barHeights.map((height, idx) => (
          <div
            key={idx}
            className={`w-1 rounded-full ${isRecording ? 'bg-red-400/80' : isProcessing ? 'bg-amber-400/80' : 'bg-slate-700/50'}`}
            style={{
              height: `${height}%`,
              animationDelay: `${barDelays[idx]}s`,
              transition: 'height 0.12s ease'
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
              : 'Click mic to start, then Process when done'}
        </div>

        {/* Process Button */}
        <button
          onClick={handleProcessIdea}
          disabled={isRecording || isProcessing || (!currentTranscript.trim() && !transcript.some(t => t.role === 'user'))}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
            isRecording || isProcessing || (!currentTranscript.trim() && !transcript.some(t => t.role === 'user'))
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

'use client';

import { useState } from 'react';

export function VoiceSidebar() {
  const [isListening, setIsListening] = useState(true);
  
  // Fake audio visualizer bars
  const bars = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    height: Math.random() * 100,
    delay: i * 0.05
  }));

  return (
    <div className="w-[400px] h-full flex flex-col border-l border-white/10 bg-[#0a0a0a] relative overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xs font-semibold tracking-wide text-white uppercase">Voice Agent</h2>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {/* Visualizer Area */}
      <div className="h-[200px] flex items-center justify-center gap-1.5 p-8 relative z-10 border-b border-white/5">
        {bars.map((bar) => (
          <div
            key={bar.id}
            className="w-1 bg-emerald-500/80 rounded-full animate-music-bar"
            style={{
              height: `${15 + Math.random() * 60}%`,
              animationDelay: `-${Math.random()}s`,
              animationDuration: '1.2s'
            }}
          />
        ))}
      </div>

      {/* Transcript / Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 z-10 scrollbar-hide">
        {/* System Message */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">AI Assistant</div>
              <span className="text-[10px] text-slate-600">10:42 AM</span>
            </div>
            <div className="text-sm text-slate-300 leading-relaxed">
              Welcome back, Pavan. I've loaded your graph. You have <span className="text-white font-medium">3 active courses</span> and <span className="text-white font-medium">2 upcoming assignments</span> due this week.
            </div>
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-4 flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
            <span className="text-xs text-slate-300 font-medium">ME</span>
          </div>
          <div className="space-y-1 text-right flex-1">
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">You</div>
              <span className="text-[10px] text-slate-600">10:43 AM</span>
            </div>
            <div className="text-sm text-white leading-relaxed">
              Show me Math 18 modules.
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5 bg-[#0a0a0a] z-20">
        <div className="relative flex items-center bg-white/5 rounded-lg border border-white/5 overflow-hidden focus-within:border-white/20 transition-colors">
          <input
            type="text"
            placeholder="Ask anything..."
            className="w-full h-12 bg-transparent pl-4 pr-12 text-sm text-white placeholder-slate-600 focus:outline-none"
          />
          <button className="absolute right-2 w-8 h-8 rounded flex items-center justify-center hover:bg-white/5 transition-colors">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
        
        {/* User Profile Snippet */}
        <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-700" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-300">Pavan Kumar</span>
            </div>
          </div>
          <button className="text-[10px] font-medium text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wide">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}

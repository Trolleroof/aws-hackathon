'use client';

import { GraphView } from '@/components/GraphView';
import { VoiceSidebar } from '@/components/VoiceSidebar';
import { mockGraphData } from '@/data/mockGraphData';

export default function DashboardPage() {
  return (
    <main className="flex w-full h-screen bg-[#05070d] overflow-hidden font-sans selection:bg-white/20">
      {/* Left: Graph Visualization */}
      <div className="flex-1 relative">
        <GraphView data={mockGraphData} />
        
        {/* Minimal Header */}
        <div className="absolute top-8 left-8 pointer-events-none z-10">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            My Universe
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-500 font-medium">Fall 2025</span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-xs text-slate-500">3 Courses Active</span>
          </div>
        </div>

        {/* Minimal Bottom Controls */}
        <div className="absolute bottom-8 left-8 pointer-events-none z-10">
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            {mockGraphData.nodes.length} NODES LOADED
          </div>
        </div>
      </div>

      {/* Right: Voice Agent Sidebar */}
      <div className="shrink-0 z-20 border-l border-white/5">
        <VoiceSidebar />
      </div>
    </main>
  );
}

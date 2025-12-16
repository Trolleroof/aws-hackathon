'use client';

import { useState, useCallback } from 'react';
import { GraphView } from '@/components/GraphView';
import { VoiceSidebar } from '@/components/VoiceSidebar';
import { NodePopup } from '@/components/NodePopup';
import { getInitialGraphData } from '@/data/agentNodes';
import { GraphControlProvider } from '@/contexts/GraphControlContext';
import type { AgentContent, AgentNode, IdeaGraphData, AgentType } from '@/types/ideaGraph';

export default function DashboardPage() {
  const [graphData, setGraphData] = useState<IdeaGraphData>(getInitialGraphData());
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resetNonce, setResetNonce] = useState(0);

  const handleNodeSelect = useCallback((node: AgentNode | null) => {
    setSelectedNode(node);
  }, []);

  const handleProcessIdea = useCallback(async (transcript: string) => {
    setIsProcessing(true);
    console.log('Processing idea:', transcript);

    // Update center node with the idea
    setGraphData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === 'center'
          ? { ...node, status: 'complete' as const, name: 'Your Idea' }
          : { ...node, status: 'processing' as const }
      )
    }));

    // Simulate parallel processing of all agents
    const agentTypes: AgentType[] = ['problem', 'user', 'techstack', 'gaps'];

    // Process first 4 agents in parallel (simulated)
    await Promise.all(
      agentTypes.map(async (agentType, index) => {
        // Simulate different processing times
        await new Promise(resolve => setTimeout(resolve, 1500 + index * 500));

        setGraphData(prev => ({
          ...prev,
          nodes: prev.nodes.map(node =>
            node.id === agentType
              ? {
                  ...node,
                  status: 'complete' as const,
                  content: getMockContent(agentType)
                }
              : node
          )
        }));
      })
    );

    // Synthesis agent runs last (after others complete)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setGraphData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === 'synthesis'
          ? {
              ...node,
              status: 'complete' as const,
              content: getMockContent('synthesis')
            }
          : node
      )
    }));

    setIsProcessing(false);
  }, []);

  return (
    <GraphControlProvider>
      <main className="flex w-full h-screen bg-[#05070d] overflow-hidden font-sans selection:bg-white/15">
        {/* Left: Graph Visualization */}
        <div className="flex-1 relative">
          <GraphView
            data={graphData}
            onNodeSelect={handleNodeSelect}
            selectedNodeId={selectedNode?.id}
            resetNonce={resetNonce}
          />

          <NodePopup
            node={selectedNode}
            onClose={() => {
              setSelectedNode(null);
              setResetNonce(n => n + 1);
            }}
          />

          {/* Header */}
          <div className="absolute top-7 left-7 pointer-events-none z-10">
            <div className="inline-flex items-center gap-2 rounded-xl bg-black/50 px-3 py-2 border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
              <div className={`h-2 w-2 rounded-full ${isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                Idea Validator
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-slate-200">
              <span className="text-white font-semibold">Brain dump to validation</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">5 AI agents</span>
            </div>
            {selectedNode && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                <span className="text-slate-400">Selected:</span>
                <span className="font-semibold text-white">{selectedNode.name}</span>
                <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                  selectedNode.status === 'complete' ? 'bg-emerald-500/20 text-emerald-300' :
                  selectedNode.status === 'processing' ? 'bg-amber-500/20 text-amber-300' :
                  selectedNode.status === 'error' ? 'bg-red-500/20 text-red-300' :
                  'bg-slate-500/20 text-slate-300'
                }`}>
                  {selectedNode.status}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Status */}
          <div className="absolute bottom-7 left-7 pointer-events-none z-10">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.28em]">
              {graphData.nodes.filter(n => n.status === 'complete').length} / {graphData.nodes.length} agents complete
            </div>
          </div>

          {/* Instructions */}
          {!isProcessing && graphData.nodes.every(n => n.status === 'idle') && (
            <div className="absolute bottom-7 right-7 max-w-xs pointer-events-none z-10">
              <div className="space-y-2 text-right text-xs text-slate-500">
                <div>
                  Click the mic to brain dump your startup idea, then click Process to run it through 5 AI validation agents.
                </div>
                <div className="text-slate-600">
                  Tip: use the graph toolbar (top-right) to fit, reset, or auto-rotate.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Voice Sidebar */}
        <div className="shrink-0 z-20 border-l border-white/5 bg-black/50 backdrop-blur">
          <VoiceSidebar
            selectedNode={selectedNode}
            onProcessIdea={handleProcessIdea}
            isProcessing={isProcessing}
          />
        </div>
      </main>
    </GraphControlProvider>
  );
}

// Mock content generator (placeholder until real AI integration)
function getMockContent(agentType: AgentType): AgentContent | null {
  switch (agentType) {
    case 'problem':
      return {
        problems: [
          {
            statement: 'Users struggle to validate startup ideas quickly',
            frequency: 85,
            engagement: 234,
            emotionalIntensity: 8,
            sources: ['Reddit r/startups', 'Hacker News']
          },
          {
            statement: 'No easy way to get structured feedback on business concepts',
            frequency: 72,
            engagement: 189,
            emotionalIntensity: 7,
            sources: ['Twitter/X', 'Indie Hackers']
          },
          {
            statement: 'Existing validation tools are too expensive or complex',
            frequency: 68,
            engagement: 156,
            emotionalIntensity: 6,
            sources: ['Product Hunt', 'Reddit']
          }
        ],
        confidenceScore: 87
      };
    case 'user':
      return {
        primaryPersona: {
          title: 'Early-stage founders at pre-seed startups',
          role: 'Founder / CEO',
          seniority: 'First-time founder',
          companySize: '1-5 employees',
          industry: 'Tech / SaaS',
          toolsUsed: ['Notion', 'Figma', 'Slack', 'ChatGPT'],
          painPoints: ['Limited budget', 'Time constraints', 'Lack of feedback']
        }
      };
    case 'techstack':
      return {
        components: [
          { category: 'LLM / Reasoning', tools: ['OpenAI GPT-4', 'Anthropic Claude'], rationale: 'Best for synthesis and analysis' },
          { category: 'Data Ingestion', tools: ['Reddit API', 'Twitter API', 'Web scraping'], rationale: 'Real-time problem discovery' },
          { category: 'Search & Retrieval', tools: ['Pinecone', 'OpenAI Embeddings'], rationale: 'Semantic clustering of problems' },
          { category: 'Orchestration', tools: ['LangGraph', 'Custom router'], rationale: 'Multi-agent coordination' }
        ],
        architectureNotes: 'Modular design allows swapping providers easily'
      };
    case 'gaps':
      return {
        gaps: [
          {
            existingSolution: 'Manual market research',
            frictionPoint: 'Too time-consuming (weeks)',
            workaround: 'Founders skip validation entirely',
            opportunityZone: 'Automated, real-time validation'
          },
          {
            existingSolution: 'Expensive consulting firms',
            frictionPoint: 'Cost prohibitive for early-stage',
            workaround: 'DIY surveys with low response rates',
            opportunityZone: 'AI-powered validation at 1/100th cost'
          }
        ],
        summary: 'Major gap exists for fast, affordable, structured idea validation'
      };
    case 'synthesis':
      return {
        brief: {
          problemStatement: 'Early-stage founders lack quick, affordable tools to validate startup ideas before investing time and money',
          targetUser: 'First-time founders at pre-seed startups with limited budgets',
          coreUnmetNeed: 'Structured, AI-powered idea validation in minutes, not weeks',
          valueProposition: 'Turn your raw startup idea into a validated concept with actionable insights in under 5 minutes',
          mvpFeatures: [
            'Voice-based brain dump capture',
            'Automated problem discovery from social platforms',
            'Target user persona generation',
            'Competitive gap analysis',
            'One-page startup brief export'
          ],
          nextValidationStep: 'Create a landing page and run 10 user interviews with early-stage founders'
        }
      };
    default:
      return null;
  }
}

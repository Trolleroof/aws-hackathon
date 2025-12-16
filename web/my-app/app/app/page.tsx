'use client';

import { useState, useCallback } from 'react';
import { GraphView } from '@/components/GraphView';
import { VoiceSidebar } from '@/components/VoiceSidebar';
import { NodePopup } from '@/components/NodePopup';
import { getInitialGraphData } from '@/data/agentNodes';
import { GraphControlProvider } from '@/contexts/GraphControlContext';
import type { AgentContent, AgentNode, IdeaGraphData, AgentType } from '@/types/ideaGraph';

// Helper to safely get array data
function getArrayData(data: any, ...keys: string[]): any[] {
  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
  }
  return [];
}

// Helper to safely get string data
function getStringData(data: any, ...keys: string[]): string {
  for (const key of keys) {
    const value = data[key];
    if (value && typeof value === 'string') {
      return value;
    }
  }
  return '';
}

// Map backend response data to agent content structure (flexible/adaptive)
function mapBackendDataToContent(agentType: AgentType, data: any): AgentContent | null {
  switch (agentType) {
    case 'problem': {
      const problems = [];

      // Try multiple possible sources for problem data
      const problemSources = [
        { key: 'market_diagnosis', source: 'Market Analysis' },
        { key: 'key_findings', source: 'Research Findings', mapper: (f: any) => f.finding || f },
        { key: 'opportunity_statements', source: 'Opportunity Analysis' },
        { key: 'problems', source: 'Problem Discovery', mapper: (p: any) => p.statement || p },
        { key: 'pain_points', source: 'Pain Points' },
        { key: 'challenges', source: 'Challenges' }
      ];

      for (const { key, source, mapper } of problemSources) {
        const items = getArrayData(data, key);
        if (items.length > 0) {
          items.forEach((item: any, index: number) => {
            const statement = mapper ? mapper(item) : item;
            problems.push({
              statement: typeof statement === 'string' ? statement : JSON.stringify(statement),
              frequency: 80 - (index * 5),
              engagement: 200 - (index * 20),
              emotionalIntensity: Math.max(1, 8 - index),
              sources: [source]
            });
          });
          break; // Use first available source
        }
      }

      // Fallback to single problem statement
      if (problems.length === 0) {
        const statement = getStringData(data, 'problem_statement', 'problem', 'summary');
        problems.push({
          statement: statement || 'Problem identified from analysis',
          frequency: 75,
          engagement: 150,
          emotionalIntensity: 7,
          sources: ['AI Analysis']
        });
      }

      return {
        problems,
        confidenceScore: data.confidence_level === 'high' ? 85 :
                        data.confidence_level === 'medium' ? 70 :
                        data.confidence_score || 50
      };
    }

    case 'user': {
      // Flexibly extract user persona data
      const title = getStringData(data, 'icp_summary', 'target_user', 'persona_summary', 'user_profile');

      const attributes = data.icp_attributes || data.persona_attributes || data.user_attributes || {};

      // Try multiple sources for each field
      const role = getStringData(attributes, 'primary_role', 'role', 'job_title', 'title');
      const seniority = getStringData(attributes, 'seniority', 'level', 'seniority_level');
      const companySize = getStringData(attributes, 'company_size', 'org_size', 'team_size');
      const industry = getStringData(attributes, 'industry', 'sector', 'vertical');

      const toolsUsed = getArrayData(attributes, 'current_workflows', 'tools_used', 'tech_stack', 'software');
      const painPoints = getArrayData(attributes, 'trigger_events', 'pain_points', 'challenges') ||
                        getArrayData(data, 'assumptions', 'user_needs');

      return {
        primaryPersona: {
          title: title || 'Target User Persona',
          role: role || 'Professional',
          seniority: seniority || 'Mid-level',
          companySize: companySize || 'Unknown',
          industry: industry || 'Unknown',
          toolsUsed,
          painPoints
        }
      };
    }

    case 'techstack': {
      const components = [];

      // Try current_solutions first
      const solutions = getArrayData(data, 'current_solutions', 'existing_solutions', 'tech_landscape');
      if (solutions.length > 0) {
        solutions.forEach((solution: any) => {
          components.push({
            category: solution.category || solution.type || 'Solution Category',
            tools: solution.examples || solution.tools || [solution.name || solution.description || 'Tool'],
            rationale: solution.description || solution.rationale || 'Current market solution'
          });
        });
      }

      // Try tech stack recommendations
      if (components.length === 0) {
        const techStack = getArrayData(data, 'tech_stack', 'recommended_stack', 'technology_recommendations');
        techStack.forEach((tech: any) => {
          components.push({
            category: tech.category || tech.layer || 'Technology',
            tools: tech.tools || tech.technologies || [tech.name || tech],
            rationale: tech.rationale || tech.reason || 'Recommended technology'
          });
        });
      }

      // Fallback to MVP features
      if (components.length === 0) {
        const mvpFeatures = getArrayData(data.mvp_definition, 'must_have') ||
                           getArrayData(data, 'mvp_features', 'features');
        mvpFeatures.slice(0, 5).forEach((feature: string, index: number) => {
          components.push({
            category: `Feature ${index + 1}`,
            tools: [feature],
            rationale: 'From MVP definition'
          });
        });
      }

      const notes = getStringData(data, 'notes', 'notes_mvp', 'architecture_notes', 'tech_notes');

      return {
        components: components.length > 0 ? components : [
          { category: 'To Be Determined', tools: ['Pending analysis'], rationale: 'Technology analysis in progress' }
        ],
        architectureNotes: notes || 'Architecture based on requirements'
      };
    }

    case 'gaps': {
      const gaps = [];

      // Try failure_modes
      const failureModes = getArrayData(data, 'failure_modes', 'solution_gaps', 'competitive_gaps');
      const workarounds = getArrayData(data, 'workarounds', 'current_workarounds');
      const opportunities = getArrayData(data, 'opportunity_gaps', 'opportunities', 'market_gaps');

      if (failureModes.length > 0) {
        failureModes.forEach((failure: any, index: number) => {
          gaps.push({
            existingSolution: failure.solution_category || failure.category || failure.existing_solution || 'Current solution',
            frictionPoint: Array.isArray(failure.issues) ? failure.issues.join('; ') :
                          (failure.friction_point || failure.issues || 'Friction identified'),
            workaround: workarounds[index] || failure.workaround || 'Manual workaround',
            opportunityZone: opportunities[index] || failure.opportunity || 'Market opportunity'
          });
        });
      }

      // Fallback: create gaps from opportunities
      if (gaps.length === 0 && opportunities.length > 0) {
        opportunities.forEach((opp: string) => {
          gaps.push({
            existingSolution: 'Current solutions',
            frictionPoint: 'Identified gap',
            workaround: workarounds[0] || 'Manual processes',
            opportunityZone: opp
          });
        });
      }

      const summary = getStringData(data, 'gap_summary', 'opportunity_summary') ||
                     opportunities[0] ||
                     getArrayData(data, 'opportunity_statements')[0] ||
                     data.problem_statement ||
                     'Gap analysis complete';

      return {
        gaps: gaps.length > 0 ? gaps : [{
          existingSolution: 'Market solutions',
          frictionPoint: 'Identified friction',
          workaround: workarounds[0] || 'Manual processes',
          opportunityZone: opportunities[0] || 'Market opportunity exists'
        }],
        summary
      };
    }

    case 'synthesis': {
      const problemStatement = getStringData(data, 'problem_statement', 'problem', 'core_problem');
      const targetUser = getStringData(data, 'icp_summary', 'target_user', 'target_market');

      const unmetNeeds = getArrayData(data, 'unmet_needs', 'core_needs', 'user_needs');
      const coreUnmetNeed = unmetNeeds[0] || getStringData(data, 'core_unmet_need', 'primary_need');

      const opportunityStatements = getArrayData(data, 'opportunity_statements', 'value_propositions');
      const valueProposition = opportunityStatements[0] || getStringData(data, 'value_proposition', 'unique_value');

      const mvpFeatures = getArrayData(data.mvp_definition, 'must_have') ||
                         getArrayData(data, 'mvp_features', 'core_features', 'features');

      const nextStep = getStringData(data, 'next_validation_step', 'validation_step', 'next_steps');

      return {
        brief: {
          problemStatement: problemStatement || 'Problem statement from analysis',
          targetUser: targetUser || 'Target user identified',
          coreUnmetNeed: coreUnmetNeed || 'Core need identified',
          valueProposition: valueProposition || 'Value proposition defined',
          mvpFeatures,
          nextValidationStep: nextStep || 'Define validation approach'
        }
      };
    }

    default:
      return null;
  }
}

export default function DashboardPage() {
  const [graphData, setGraphData] = useState<IdeaGraphData>(getInitialGraphData());
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resetNonce, setResetNonce] = useState(0);

  const handleNodeSelect = useCallback((node: AgentNode | null) => {
    setSelectedNode(node);
  }, []);

  const handleLoadExample = useCallback(async () => {
    console.log('🎯 Load Example button clicked!');
    setIsProcessing(true);
    console.log('Loading example data...');

    // Update center node
    setGraphData(prev => {
      console.log('📊 Current graph data:', prev);
      return {
        ...prev,
        nodes: prev.nodes.map(node =>
          node.id === 'center'
            ? { ...node, status: 'complete' as const, name: 'Example Idea' }
            : { ...node, status: 'processing' as const }
        )
      };
    });

    try {
      // Load example.json from public folder
      console.log('📡 Fetching /example.json...');
      const response = await fetch('example.json');
      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Failed to load example data: ${response.status}`);
      }

      const resultData = await response.json();
      console.log('✅ Example data loaded successfully:', resultData);
      console.log('📝 Data keys:', Object.keys(resultData));

      // Map example data to agent content
      const agentTypes: AgentType[] = ['problem', 'user', 'techstack', 'gaps'];

      // Update nodes with example data
      agentTypes.forEach((agentType, index) => {
        setTimeout(() => {
          console.log(`🔄 Updating node: ${agentType}`);
          const content = mapBackendDataToContent(agentType, resultData);
          console.log(`📦 Mapped content for ${agentType}:`, content);

          setGraphData(prev => ({
            ...prev,
            nodes: prev.nodes.map(node =>
              node.id === agentType
                ? {
                    ...node,
                    status: 'complete' as const,
                    content
                  }
                : node
            )
          }));
        }, 1500 + index * 500);
      });

      // Synthesis agent runs last
      setTimeout(() => {
        setGraphData(prev => ({
          ...prev,
          nodes: prev.nodes.map(node =>
            node.id === 'synthesis'
              ? {
                  ...node,
                  status: 'complete' as const,
                  content: mapBackendDataToContent('synthesis', resultData)
                }
              : node
          )
        }));
        setIsProcessing(false);
      }, 1500 + agentTypes.length * 500 + 1000);

    } catch (error) {
      console.error('Error loading example:', error);
      setGraphData(prev => ({
        ...prev,
        nodes: prev.nodes.map(node =>
          node.id !== 'center'
            ? { ...node, status: 'error' as const }
            : node
        )
      }));
      setIsProcessing(false);
    }
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

    try {
      // Call the backend API through our Next.js API route
      const response = await fetch('/api/tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: transcript }),
      });

      if (!response.ok) {
        throw new Error('Failed to process idea');
      }

      const backendResponse = await response.json();
      console.log('Backend response:', backendResponse);

      // Parse the result JSON string
      const resultData = JSON.parse(backendResponse.result);
      console.log('Parsed result:', resultData);

      // Map backend data to agent content
      const agentTypes: AgentType[] = ['problem', 'user', 'techstack', 'gaps'];

      // Update nodes with backend data
      agentTypes.forEach((agentType, index) => {
        setTimeout(() => {
          setGraphData(prev => ({
            ...prev,
            nodes: prev.nodes.map(node =>
              node.id === agentType
                ? {
                    ...node,
                    status: 'complete' as const,
                    content: mapBackendDataToContent(agentType, resultData)
                  }
                : node
            )
          }));
        }, 1500 + index * 500);
      });

      // Synthesis agent runs last
      setTimeout(() => {
        setGraphData(prev => ({
          ...prev,
          nodes: prev.nodes.map(node =>
            node.id === 'synthesis'
              ? {
                  ...node,
                  status: 'complete' as const,
                  content: mapBackendDataToContent('synthesis', resultData)
                }
              : node
          )
        }));
      }, 1500 + agentTypes.length * 500 + 1000);

    } catch (error) {
      console.error('Error processing idea:', error);
      // Update all nodes to error state
      setGraphData(prev => ({
        ...prev,
        nodes: prev.nodes.map(node =>
          node.id !== 'center'
            ? { ...node, status: 'error' as const }
            : node
        )
      }));
    } finally {
      setIsProcessing(false);
    }
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
            <div className="absolute bottom-7 right-7 max-w-xs z-10">
              <div className="space-y-3 text-right">
                <div className="space-y-2 text-xs text-slate-500 pointer-events-none">
                  <div>
                    Click the mic to brain dump your startup idea, then click Process to run it through 5 AI validation agents.
                  </div>
                  <div className="text-slate-600">
                    Tip: use the graph toolbar (top-right) to fit, reset, or auto-rotate.
                  </div>
                </div>
                <button
                  onClick={handleLoadExample}
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 hover:border-emerald-500/50 active:scale-[0.98]"
                >
                  <span>📊</span>
                  Load Example Data
                </button>
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
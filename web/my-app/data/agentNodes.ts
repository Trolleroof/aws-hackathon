import { AgentNode, AgentLink, IdeaGraphData } from '@/types/ideaGraph';

// Initial agent node definitions (before processing)
export const INITIAL_AGENT_NODES: AgentNode[] = [
  {
    id: 'center',
    name: 'Your Idea',
    type: 'center',
    status: 'idle',
    content: null,
    color: '#10B981', // emerald-500
    val: 30,
  },
  {
    id: 'problem',
    name: 'Problem Discovery',
    type: 'problem',
    status: 'idle',
    content: null,
    color: '#F59E0B', // amber-500
    val: 24,
  },
  {
    id: 'user',
    name: 'Target User',
    type: 'user',
    status: 'idle',
    content: null,
    color: '#3B82F6', // blue-500
    val: 24,
  },
  {
    id: 'techstack',
    name: 'Tech Stack',
    type: 'techstack',
    status: 'idle',
    content: null,
    color: '#8B5CF6', // violet-500
    val: 24,
  },
  {
    id: 'gaps',
    name: 'Solution Gaps',
    type: 'gaps',
    status: 'idle',
    content: null,
    color: '#EF4444', // red-500
    val: 24,
  },
  {
    id: 'synthesis',
    name: 'Startup Brief',
    type: 'synthesis',
    status: 'idle',
    content: null,
    color: '#EC4899', // pink-500
    val: 24,
  },
];

// Links connecting agents to center only (star topology)
export const AGENT_LINKS: AgentLink[] = [
  { source: 'center', target: 'problem' },
  { source: 'center', target: 'user' },
  { source: 'center', target: 'techstack' },
  { source: 'center', target: 'gaps' },
  { source: 'center', target: 'synthesis' },
];

// Get initial graph data
export function getInitialGraphData(): IdeaGraphData {
  return {
    nodes: [...INITIAL_AGENT_NODES],
    links: [...AGENT_LINKS],
  };
}

// Agent descriptions for UI
export const AGENT_DESCRIPTIONS: Record<string, { title: string; description: string; icon: string }> = {
  center: {
    title: 'Your Idea',
    description: 'The core of your brain dump - your raw startup idea',
    icon: '💡',
  },
  problem: {
    title: 'Problem Discovery & Validation',
    description: 'Find real, repeated, emotionally charged problems worth solving by analyzing Reddit, HN, Stack Overflow, X, and niche forums.',
    icon: '🔍',
  },
  user: {
    title: 'Target User Identification',
    description: 'Define who experiences the problem - role, seniority, company size, industry.',
    icon: '👤',
  },
  techstack: {
    title: 'Tech Stack Research',
    description: 'Practical, buildable stack recommendations: LLM, data ingestion, search, orchestration, and output layers.',
    icon: '🛠️',
  },
  gaps: {
    title: 'Solution Gaps & Alternatives',
    description: 'Understand why existing solutions fail - too expensive, too complex, missing functionality.',
    icon: '⚡',
  },
  synthesis: {
    title: 'Startup Brief',
    description: 'Synthesized findings: problem statement, target user, value proposition, MVP features, next validation step.',
    icon: '📋',
  },
};

// Color mapping for different statuses
export const STATUS_COLORS: Record<string, string> = {
  idle: '#6B7280', // gray-500
  pending: '#F59E0B', // amber-500
  processing: '#3B82F6', // blue-500 (pulsing)
  complete: '#10B981', // emerald-500
  error: '#EF4444', // red-500
};

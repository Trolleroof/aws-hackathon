// Type definitions for the Idea Validation Tool

export type AgentType = 'center' | 'problem' | 'user' | 'techstack' | 'gaps' | 'synthesis';
export type AgentStatus = 'idle' | 'pending' | 'processing' | 'complete' | 'error';

// Brain dump from voice recording
export interface BrainDump {
  id: string;
  rawTranscript: string;
  timestamp: Date;
  duration: number; // in seconds
}

// Problem Discovery Agent output
export interface ProblemStatement {
  statement: string; // In users' own words
  frequency: number; // How often this appears
  engagement: number; // Replies, "same here" count
  emotionalIntensity: number; // 1-10 scale
  sources: string[]; // Where found (Reddit, HN, etc.)
}

export interface ProblemDiscoveryContent {
  problems: ProblemStatement[];
  confidenceScore: number; // 0-100
}

// Target User Identification Agent output
export interface UserPersona {
  title: string; // e.g., "Ops managers at 50-200 person logistics companies"
  role: string;
  seniority: string;
  companySize: string;
  industry: string;
  toolsUsed: string[];
  painPoints: string[];
}

export interface TargetUserContent {
  primaryPersona: UserPersona;
  secondaryPersonas?: UserPersona[];
}

// Tech Stack Agent output
export interface TechComponent {
  category: string; // e.g., "LLM / Reasoning", "Data Ingestion"
  tools: string[];
  rationale: string;
}

export interface TechStackContent {
  components: TechComponent[];
  architectureNotes: string;
}

// Solution Gap Agent output
export interface SolutionGap {
  existingSolution: string;
  frictionPoint: string; // Too expensive, too complex, etc.
  workaround: string; // Manual hacks users resort to
  opportunityZone: string;
}

export interface SolutionGapContent {
  gaps: SolutionGap[];
  summary: string;
}

// Synthesis Agent output
export interface StartupBrief {
  problemStatement: string;
  targetUser: string;
  coreUnmetNeed: string;
  valueProposition: string; // 1-sentence
  mvpFeatures: string[];
  nextValidationStep: string;
}

export interface SynthesisContent {
  brief: StartupBrief;
}

// Union type for all agent content
export type AgentContent =
  | ProblemDiscoveryContent
  | TargetUserContent
  | TechStackContent
  | SolutionGapContent
  | SynthesisContent;

// Graph node structure
export interface AgentNode {
  id: string;
  type: AgentType;
  name: string;
  status: AgentStatus;
  content: AgentContent | null;
  color: string;
  val: number; // Node size
  x?: number;
  y?: number;
  z?: number;
  fx?: number;
  fy?: number;
  fz?: number;
}

// Graph link structure
export interface AgentLink {
  source: string;
  target: string;
}

// Complete graph data
export interface IdeaGraphData {
  nodes: AgentNode[];
  links: AgentLink[];
}

// Processing state
export interface ProcessingState {
  brainDump: BrainDump | null;
  isProcessing: boolean;
  agentStatuses: Record<AgentType, AgentStatus>;
  error: string | null;
}

'use client';

import { createContext, useContext, useRef, ReactNode } from 'react';
import type { ForceGraphMethods, LinkObject, NodeObject } from 'react-force-graph-3d';
import type { AgentLink, AgentNode } from '@/types/ideaGraph';

interface GraphControlContextType {
  graphRef: React.MutableRefObject<
    ForceGraphMethods<NodeObject<AgentNode>, LinkObject<AgentNode, AgentLink>> | undefined
  >;
}

const GraphControlContext = createContext<GraphControlContextType | null>(null);

export function GraphControlProvider({ children }: { children: ReactNode }) {
  const graphRef = useRef<
    ForceGraphMethods<NodeObject<AgentNode>, LinkObject<AgentNode, AgentLink>> | undefined
  >(undefined);

  return (
    <GraphControlContext.Provider value={{ graphRef }}>
      {children}
    </GraphControlContext.Provider>
  );
}

export function useGraphControl() {
  const context = useContext(GraphControlContext);
  if (!context) {
    throw new Error('useGraphControl must be used within GraphControlProvider');
  }
  return context;
}

'use client';

import { createContext, useContext, useRef, ReactNode } from 'react';

interface GraphControlContextType {
  graphRef: React.MutableRefObject<any>;
  zoomToNode: (nodeId: string) => void;
  resetView: () => void;
}

const GraphControlContext = createContext<GraphControlContextType | null>(null);

export function GraphControlProvider({ children }: { children: ReactNode }) {
  const graphRef = useRef<any>(null);

  const zoomToNode = (nodeId: string) => {
    if (!graphRef.current) {
      console.warn('Graph ref not initialized yet');
      return;
    }

    // Check if graphData method exists (graph is fully loaded)
    if (typeof graphRef.current.graphData !== 'function') {
      console.warn('Graph not fully loaded yet, retrying...');
      setTimeout(() => zoomToNode(nodeId), 500);
      return;
    }

    const graphData = graphRef.current.graphData();
    const node = graphData.nodes.find((n: any) => n.id === nodeId);

    if (!node) {
      console.warn(`Node not found: ${nodeId}`);
      return;
    }

    // Check if node has coordinates (physics simulation has run)
    if (typeof node.x !== 'number' || typeof node.y !== 'number' || typeof node.z !== 'number') {
      console.warn(`Node ${nodeId} doesn't have coordinates yet, retrying...`);
      setTimeout(() => zoomToNode(nodeId), 500);
      return;
    }

    const distance = 200; // Closer for sparse graph
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    graphRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node,
      1500
    );
  };

  const resetView = () => {
    if (!graphRef.current) return;

    graphRef.current.cameraPosition(
      { x: 0, y: 0, z: 300 },
      { x: 0, y: 0, z: 0 },
      1500
    );
  };

  return (
    <GraphControlContext.Provider value={{ graphRef, zoomToNode, resetView }}>
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

'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import SpriteText from 'three-spritetext';
import * as d3 from 'd3';
import { useGraphControl } from '@/contexts/GraphControlContext';
import { AgentNode, IdeaGraphData, AgentStatus } from '@/types/ideaGraph';
import { AGENT_DESCRIPTIONS, STATUS_COLORS } from '@/data/agentNodes';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-emerald-400">Loading...</div>
});

interface GraphViewProps {
  data: IdeaGraphData;
  focusNodeId?: string | null;
  onNodeSelect?: (node: AgentNode | null) => void;
  selectedNodeId?: string | null;
}

export function GraphView({ data, focusNodeId, onNodeSelect, selectedNodeId }: GraphViewProps) {
  const { graphRef } = useGraphControl();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleNodeClick = useCallback((node: unknown) => {
    const agentNode = node as AgentNode;
    console.log('Node clicked:', agentNode.name, agentNode.id);

    // Notify parent of selection
    if (onNodeSelect) {
      // Toggle selection if clicking same node
      if (selectedNodeId === agentNode.id) {
        onNodeSelect(null);
      } else {
        onNodeSelect(agentNode);
      }
    }

    // Zoom to node
    const distance = 200; // Closer for sparse graph
    const distRatio = 1 + distance / Math.hypot(agentNode.x || 0, agentNode.y || 0, agentNode.z || 0);

    graphRef.current?.cameraPosition(
      { x: (agentNode.x || 0) * distRatio, y: (agentNode.y || 0) * distRatio, z: (agentNode.z || 0) * distRatio },
      agentNode,
      1500
    );
  }, [graphRef, onNodeSelect, selectedNodeId]);

  // Handle external focus changes
  useEffect(() => {
    if (focusNodeId && graphRef.current) {
      const node = data.nodes.find(n => n.id === focusNodeId);
      if (node) {
        handleNodeClick(node);
      }
    }
  }, [focusNodeId, data.nodes, handleNodeClick]);

  // Physics configuration - optimized for sparse 6-node layout
  useEffect(() => {
    if (graphRef.current) {
      // Stronger repulsion for spacing
      graphRef.current.d3Force('charge').strength(-300);

      // Longer links for clearer connections
      graphRef.current.d3Force('link').distance(80);

      // Gentle centering
      graphRef.current.d3Force('center', d3.forceCenter(0, 0));

      // No radial force - let it spread naturally
      graphRef.current.d3Force('radial', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resize Observer
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Get node color based on status
  const getNodeColor = (node: AgentNode): string => {
    if (node.status === 'idle') {
      return node.color;
    }
    return STATUS_COLORS[node.status] || node.color;
  };

  // Get node size based on selection and status
  const getNodeSize = (node: AgentNode): number => {
    let size = node.val;
    if (selectedNodeId === node.id) {
      size *= 1.3; // Selected node is larger
    }
    if (node.status === 'processing') {
      size *= 1.1; // Processing nodes pulse slightly larger
    }
    return size;
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ForceGraph3D
          ref={graphRef}
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}

          // Visuals
          backgroundColor="#05070d"
          showNavInfo={false}

          // Node Styling
          nodeThreeObject={(node) => {
            const agentNode = node as AgentNode;
            const desc = AGENT_DESCRIPTIONS[agentNode.type];
            const displayName = desc?.icon ? `${desc.icon} ${agentNode.name}` : agentNode.name;

            const sprite = new SpriteText(displayName);
            sprite.color = getNodeColor(agentNode);
            sprite.textHeight = getNodeSize(agentNode) / 2;
            sprite.fontFace = 'Space Grotesk, Space Mono, JetBrains Mono, monospace';
            sprite.fontWeight = '700';
            sprite.strokeWidth = 0.5;
            sprite.strokeColor = 'rgba(0, 0, 0, 0.8)';
            sprite.backgroundColor = selectedNodeId === agentNode.id
              ? 'rgba(16, 185, 129, 0.2)'
              : 'transparent';

            return sprite;
          }}

          // Links
          linkColor={() => 'rgba(255,255,255,0.3)'}
          linkWidth={2}
          linkOpacity={0.5}

          // Interaction
          onNodeClick={handleNodeClick}
          onBackgroundClick={() => onNodeSelect?.(null)}

          // Physics
          d3VelocityDecay={0.4}
          warmupTicks={50}
          cooldownTicks={100}
        />
      )}

      {/* Node count indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500">
        {data.nodes.length} agents
      </div>
    </div>
  );
}

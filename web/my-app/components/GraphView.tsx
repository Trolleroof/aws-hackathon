'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import SpriteText from 'three-spritetext';
import * as d3 from 'd3';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-emerald-400">Loading Universe...</div>
});

interface GraphData {
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    color: string;
    val: number;
    fx?: number;
    fy?: number;
    fz?: number;
  }>;
  links: Array<{
    source: string;
    target: string;
  }>;
}

export function GraphView({ data }: { data: GraphData }) {
  const graphRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleNodeClick = useCallback((node: any) => {
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    graphRef.current?.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node,
      3000
    );
  }, []);

  useEffect(() => {
    if (graphRef.current) {
      // Physics: Orb Layout
      // 1. Repel nodes locally so they don't overlap
      graphRef.current.d3Force('charge').strength(-20);
      
      // 2. Keep links tight
      graphRef.current.d3Force('link').distance(30);

      // 3. Radial Force: Pull everything to a sphere surface
      // Radius = 100 seems good for this amount of nodes
      graphRef.current.d3Force('radial', d3.forceRadial(100).strength(0.8));
    }
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

  return (
    <div ref={containerRef} className="w-full h-full">
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
          nodeThreeObject={(node: any) => {
            const sprite = new SpriteText(node.name);
            sprite.color = node.color;
            sprite.textHeight = node.val ? node.val / 2 : 6;
            sprite.fontFace = 'Geist Sans, Inter, sans-serif';
            sprite.fontWeight = '500'; // Lighter weight
            sprite.strokeWidth = 0; // No stroke for cleaner look, or very thin
            sprite.backgroundColor = 'transparent'; // No background
            return sprite;
          }}
          
          // Links
          linkColor={() => 'rgba(255,255,255,0.1)'}
          linkWidth={1}
          linkDirectionalParticles={1} // Minimal particles
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleColor={() => '#ffffff'}
          
          // Interaction
          onNodeClick={handleNodeClick}
          
          // Physics
          d3VelocityDecay={0.3}
        />
      )}
    </div>
  );
}

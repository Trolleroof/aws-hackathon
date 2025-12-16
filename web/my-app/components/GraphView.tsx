'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import type { LinkObject } from 'react-force-graph-3d';
import { useGraphControl } from '@/contexts/GraphControlContext';
import type { AgentLink, AgentNode, IdeaGraphData } from '@/types/ideaGraph';
import { AGENT_DESCRIPTIONS, STATUS_COLORS } from '@/data/agentNodes';

const ForceGraph3DClient = dynamic(
  () => import('@/components/ForceGraph3DClient').then((m) => m.ForceGraph3DClient),
  {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-emerald-400">Loading...</div>
  }
);

interface GraphViewProps {
  data: IdeaGraphData;
  focusNodeId?: string | null;
  onNodeSelect?: (node: AgentNode | null) => void;
  selectedNodeId?: string | null;
}

type OrbitControlsLike = {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableDamping?: boolean;
  dampingFactor?: number;
};

export function GraphView({ data, focusNodeId, onNodeSelect, selectedNodeId }: GraphViewProps) {
  const { graphRef } = useGraphControl();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitializedForces = useRef(false);
  const animatedObjects = useRef<Map<string, THREE.Object3D>>(new Map());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isAutoRotate, setIsAutoRotate] = useState(false);

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
    const distance = 150; // Good distance for star layout
    const distRatio = 1 + distance / Math.hypot(agentNode.x || 0, agentNode.y || 0, agentNode.z || 0);

    graphRef.current?.cameraPosition(
      { x: (agentNode.x || 0) * distRatio, y: (agentNode.y || 0) * distRatio, z: (agentNode.z || 0) * distRatio },
      { x: agentNode.x || 0, y: agentNode.y || 0, z: agentNode.z || 0 },
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
  }, [focusNodeId, data.nodes, graphRef, handleNodeClick]);

  // Physics configuration - robust initialization
  useEffect(() => {
    const applyForces = () => {
      if (!graphRef.current) return false;

      // Weak repulsion - just enough to prevent overlap
      const chargeForce = graphRef.current.d3Force('charge');
      if (chargeForce) {
        chargeForce.strength(-200);
        chargeForce.distanceMax(200);
      }

      // Very strong links to create tight star pattern
      const linkForce = graphRef.current.d3Force('link');
      if (linkForce) {
        linkForce.distance(80);
        linkForce.strength(2); // Extra strong to pull nodes to center
      }

      // Center force - keep them somewhat grounded but allow spread
      const centerForce = graphRef.current.d3Force('center');
      if (centerForce) {
         // Weak centering is usually default, ensuring we don't drift to infinity
         // We'll leave it as is or could relax it if needed
      }

      // Disable conflicting forces
      graphRef.current.d3Force('collision', null);
      graphRef.current.d3Force('radial', null);

      // Controls setup
      const controls = graphRef.current.controls() as OrbitControlsLike | undefined;
      if (controls) {
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.45;
      }

      // Essential: Reheat to apply new forces
      graphRef.current.d3ReheatSimulation();

      // Set initial camera position
      graphRef.current.cameraPosition({ x: 0, y: 0, z: 150 }, { x: 0, y: 0, z: 0 }, 0);

      console.log('Graph forces applied successfully');
      return true;
    };

    // Try immediately
    if (applyForces()) {
      hasInitializedForces.current = true;
      return;
    }

    // Poll until graph is ready (dynamic import takes time)
    const intervalId = setInterval(() => {
      if (applyForces()) {
        hasInitializedForces.current = true;
        clearInterval(intervalId);
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, [graphRef]);

  type GraphLinkObject = LinkObject<AgentNode, AgentLink>;

  const getGraphNodeId = (nodeOrId: unknown): string | null => {
    if (!nodeOrId) return null;
    if (typeof nodeOrId === 'string' || typeof nodeOrId === 'number') return String(nodeOrId);
    if (typeof nodeOrId === 'object' && 'id' in nodeOrId) {
      const maybeId = (nodeOrId as { id?: unknown }).id;
      if (typeof maybeId === 'string' || typeof maybeId === 'number') return String(maybeId);
    }
    return null;
  };

  const isLinkSelected = (link: GraphLinkObject) => {
    if (!selectedNodeId) return false;
    const sourceId = getGraphNodeId(link.source);
    const targetId = getGraphNodeId(link.target);
    return sourceId === selectedNodeId || targetId === selectedNodeId;
  };

  const getLinkTargetNode = (link: GraphLinkObject) => {
    const targetId = getGraphNodeId(link.target);
    return targetId ? data.nodes.find(n => n.id === targetId) : undefined;
  };

  const handleZoomToFit = () => {
    graphRef.current?.zoomToFit?.(700, 90);
  };

  const handleResetView = () => {
    onNodeSelect?.(null);
    graphRef.current?.cameraPosition?.({ x: 0, y: 0, z: 150 }, { x: 0, y: 0, z: 0 }, 900);
  };

  const toggleAutoRotate = () => {
    const controls = graphRef.current?.controls?.() as OrbitControlsLike | undefined;
    if (!controls) return;
    const next = !controls.autoRotate;
    controls.autoRotate = next;
    controls.autoRotateSpeed = 0.45;
    setIsAutoRotate(next);
  };

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

  // Animation loop for node decorations
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      animatedObjects.current.forEach((obj) => {
        if (obj.userData.type === 'spin') {
          obj.rotation.z += obj.userData.speed || 0.01;
        } else if (obj.userData.type === 'pulse') {
          const scale = 1 + Math.sin(Date.now() * obj.userData.speed) * 0.15;
          obj.scale.set(scale, scale, scale);
        } else if (obj.userData.type === 'orbit') {
          obj.rotation.z += obj.userData.speed || 0.005;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Clean up animated objects when nodes are removed
  useEffect(() => {
    const currentNodeIds = new Set(data.nodes.map(n => n.id));
    animatedObjects.current.forEach((_, key) => {
      const nodeId = key.split('-')[0];
      if (!currentNodeIds.has(nodeId)) {
        animatedObjects.current.delete(key);
      }
    });
  }, [data.nodes]);

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
        <ForceGraph3DClient
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}

          // Force complete replacement of node objects instead of extending
          nodeThreeObjectExtend={false}

          // Visuals
          backgroundColor="#05070d"
          showNavInfo={false}

          // Node Styling
          // Node Styling
          nodeThreeObject={(node) => {
            const agentNode = node as AgentNode;
            const desc = AGENT_DESCRIPTIONS[agentNode.type];
            const displayName = desc?.icon ? `${desc.icon} ${agentNode.name}` : agentNode.name;
            const size = getNodeSize(agentNode);
            const color = getNodeColor(agentNode);
            const isSelected = selectedNodeId === agentNode.id;
            const isProcessing = agentNode.status === 'processing';
            const isComplete = agentNode.status === 'complete';

            // Container group
            const group = new THREE.Group();

            // 0. Core Sphere (always visible)
            const sphereGeo = new THREE.SphereGeometry(size, 32, 32);
            const sphereMat = new THREE.MeshBasicMaterial({
              color: color,
              transparent: true,
              opacity: 1.0
            });
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            group.add(sphere);

            // 1. Text Sprite
            const sprite = new SpriteText(displayName);
            sprite.color = color;
            sprite.textHeight = size / 0.8;
            sprite.fontFace = 'Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif';
            sprite.fontWeight = '700';
            sprite.strokeWidth = 0.5;
            sprite.strokeColor = 'rgba(0, 0, 0, 0.8)';
            sprite.backgroundColor = isSelected
              ? 'rgba(16, 185, 129, 0.2)'
              : 'transparent';
            
            // Lift text slightly so rings don't cut through (though in 3D billboarding it's tricky, group helps)
            sprite.position.y = 2; 
            group.add(sprite);

            // 2. Animated Geometry based on status
            if (isSelected || isProcessing) {
               // Outer Ring (Spinning)
               const ringGeo = new THREE.TorusGeometry(size * 0.6, 1.5, 8, 32);
               const ringMat = new THREE.MeshBasicMaterial({
                 color: isSelected ? 0x10B981 : 0x3B82F6,
                 transparent: true,
                 opacity: 0.4,
                 wireframe: false,
                 side: THREE.DoubleSide
               });
               const ring = new THREE.Mesh(ringGeo, ringMat);
               ring.userData = { type: 'spin', speed: isProcessing ? 0.05 : 0.01, offset: Math.random() * 100 };
               group.add(ring);
               animatedObjects.current.set(`${agentNode.id}-ring`, ring);

               // Glow Sphere (Pulsing)
               const glowGeo = new THREE.SphereGeometry(size * 0.4, 16, 16);
               const glowMat = new THREE.MeshBasicMaterial({
                 color: color,
                 transparent: true,
                 opacity: 0.15,
                 blending: THREE.AdditiveBlending
               });
               const glow = new THREE.Mesh(glowGeo, glowMat);
               glow.userData = { type: 'pulse', speed: 0.003, offset: Math.random() * 100 };
               group.add(glow);
               animatedObjects.current.set(`${agentNode.id}-glow`, glow);
            }

            if (isComplete && !isSelected) {
               // Stable Halo
               const haloGeo = new THREE.RingGeometry(size * 0.5, size * 0.55, 32);
               const haloMat = new THREE.MeshBasicMaterial({ 
                 color: 0x10B981, 
                 transparent: true, 
                 opacity: 0.3, 
                 side: THREE.DoubleSide 
               });
               const halo = new THREE.Mesh(haloGeo, haloMat);
               halo.lookAt(0,0,1); // Face camera roughly (billboarding simulated)
               group.add(halo);
               // Rotate halo slowly
               halo.userData = { type: 'orbit', speed: 0.005 };
               animatedObjects.current.set(`${agentNode.id}-halo`, halo);
            }

            return group;
          }}

          // Links
          linkColor={(link) => {
            if (!selectedNodeId) return 'rgba(255,255,255,0.22)';
            return isLinkSelected(link as GraphLinkObject) ? 'rgba(16,185,129,0.55)' : 'rgba(255,255,255,0.08)';
          }}
          linkWidth={(link) => (isLinkSelected(link as GraphLinkObject) ? 2.8 : 1.2)}
          linkOpacity={selectedNodeId ? 0.45 : 0.55}
          linkDirectionalParticles={(link) => {
            const targetNode = getLinkTargetNode(link as GraphLinkObject);
            if (targetNode?.status === 'processing') return 6;
            if (targetNode?.status === 'complete') return 2;
            return 0;
          }}
          linkDirectionalParticleSpeed={(link) => {
            const targetNode = getLinkTargetNode(link as GraphLinkObject);
            return targetNode?.status === 'processing' ? 0.014 : 0.006;
          }}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={(link) => {
            const targetNode = getLinkTargetNode(link as GraphLinkObject);
            return targetNode ? getNodeColor(targetNode) : 'rgba(255,255,255,0.35)';
          }}

          // Interaction
          onNodeClick={handleNodeClick}
          onBackgroundClick={() => onNodeSelect?.(null)}

          // Physics - faster settling for tight star pattern
          d3VelocityDecay={0.3}
          warmupTicks={200}
          cooldownTicks={300}
        />
      )}

      {/* Subtle glow overlay (keeps graph readable) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(900px circle at 18% 18%, rgba(16, 185, 129, 0.10), transparent 55%), radial-gradient(900px circle at 80% 72%, rgba(59, 130, 246, 0.08), transparent 55%)'
        }}
      />

      {/* Graph controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1.5 backdrop-blur shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
        <button
          type="button"
          onClick={handleZoomToFit}
          className="h-9 w-9 rounded-lg text-slate-200/90 transition hover:bg-white/5 hover:text-white"
          title="Fit graph"
        >
          <svg className="mx-auto h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M16 3h3a2 2 0 0 1 2 2v3" />
            <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleResetView}
          className="h-9 w-9 rounded-lg text-slate-200/90 transition hover:bg-white/5 hover:text-white"
          title="Reset view"
        >
          <svg className="mx-auto h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={toggleAutoRotate}
          className={`h-9 w-9 rounded-lg transition hover:bg-white/5 hover:text-white ${
            isAutoRotate ? 'text-emerald-300' : 'text-slate-200/90'
          }`}
          title={isAutoRotate ? 'Stop rotation' : 'Auto-rotate'}
        >
          <svg className="mx-auto h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3a9 9 0 1 0 9 9" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>
      </div>

      {/* Node count indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500">
        {data.nodes.length} agents
      </div>
    </div>
  );
}

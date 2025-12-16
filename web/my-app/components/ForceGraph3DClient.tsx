'use client';

import ForceGraph3D from 'react-force-graph-3d';
import type { ForceGraphProps } from 'react-force-graph-3d';
import { useGraphControl } from '@/contexts/GraphControlContext';
import type { AgentLink, AgentNode } from '@/types/ideaGraph';

type Props = ForceGraphProps<AgentNode, AgentLink>;

export function ForceGraph3DClient(props: Props) {
  const { graphRef } = useGraphControl();
  return <ForceGraph3D ref={graphRef} {...props} />;
}


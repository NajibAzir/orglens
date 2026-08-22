import { useContext, useState, useEffect, useCallback } from 'react';
import { 
  ReactFlow, Controls, Background, useNodesState, useEdgesState, 
  MarkerType 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { AppContext } from '../context/AppContext';
import { getOrgTree } from '../utils/api';
import OrgChartNode from '../components/OrgChartNode';
import TimelineScrubber from '../components/TimelineScrubber';

const nodeTypes = { custom: OrgChartNode };

const NODE_WIDTH = 270;
const NODE_HEIGHT = 180;

// Automated Dagre hierarchical tree layout
const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: 'TB',
    nodesep: 60,  // Horizontal distance between parallel sibling nodes
    ranksep: 80,  // Vertical distance between hierarchy levels
    align: 'DL',
    ranker: 'tight-tree'
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Traverse backend org tree response and extract raw nodes & edges
function extractNodesAndEdges(treeArray, isDark) {
  let rawNodes = [];
  let rawEdges = [];
  const visited = new Set();

  function walk(node, parentId = null) {
    if (!node || !node.role_id) return;
    const nodeId = String(node.role_id);

    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      rawNodes.push({
        id: nodeId,
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
          roleId: node.role_id,
          title: node.title,
          department: node.department,
          department_color: node.department_color,
          level: node.level,
          skills: node.skills,
          trend: node.trend,
          occupant: node.occupant_name || 'Vacant',
          occupant_avatar: node.occupant_avatar,
          employeeId: node.employee_id
        }
      });
    }

    if (parentId && parentId !== nodeId) {
      const strokeColor = isDark ? '#00BFFF' : '#3B82F6';
      rawEdges.push({
        id: `e-${parentId}-${nodeId}`,
        source: String(parentId),
        target: nodeId,
        type: 'smoothstep',
        animated: false,
        style: { stroke: strokeColor, strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: strokeColor,
        },
      });
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(child => walk(child, nodeId));
    }
  }

  treeArray.forEach(root => walk(root, null));
  return { rawNodes, rawEdges };
}

export default function OrgChart() {
  const { selectedDate, theme } = useContext(AppContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isDark = theme === 'dark';

  const fetchAndLayoutTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrgTree(selectedDate);
      const treeArray = res.data || [];
      
      const { rawNodes, rawEdges } = extractNodesAndEdges(treeArray, isDark);
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges);
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } catch (err) {
      setError('Failed to load org tree.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, setNodes, setEdges, isDark]);

  useEffect(() => {
    fetchAndLayoutTree();
  }, [fetchAndLayoutTree]);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Top Header & Lightweight Status Bar */}
      <div className="flex-shrink-0 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Interactive Organization Chart</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Live organizational hierarchy positioned automatically with structured reporting lines.
            </p>
          </div>

          {/* Department Legend Chips */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            {[
              { name: 'Engineering', color: '#00BFFF' },
              { name: 'Product', color: '#8B5CF6' },
              { name: 'Data', color: '#10B981' },
              { name: 'QA', color: '#F59E0B' },
              { name: 'Platform', color: '#253DE8' },
              { name: 'People & Culture', color: '#EC4899' },
            ].map(d => (
              <span key={d.name} className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 px-2.5 py-1 rounded-xl shadow-xs text-slate-700 dark:text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: d.color, boxShadow: `0 0 8px ${d.color}60` }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>

        <TimelineScrubber />
      </div>
      
      {error && <div className="text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-4 rounded-xl border border-rose-200 dark:border-rose-800 text-xs font-semibold">{error}</div>}
      
      {/* React Flow Glass Canvas */}
      <div className="flex-1 bg-slate-50/60 dark:bg-[#030712]/50 backdrop-blur-xl rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/10 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-[#030712]/70 backdrop-blur-sm flex items-center justify-center z-20 font-bold text-xs text-slate-700 dark:text-cyan-300">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping mr-2" />
            Calculating optimal tree layout...
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15, minZoom: 0.4, maxZoom: 1.2 }}
          minZoom={0.2}
          maxZoom={1.5}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          colorMode={isDark ? 'dark' : 'light'}
        >
          <Background color={isDark ? '#1E293B' : '#cbd5e1'} gap={24} size={1.2} />
          <Controls className="!bg-white/90 dark:!bg-[#0C1527]/80 !backdrop-blur-md !border !border-slate-200 dark:!border-white/10 !shadow-md !rounded-2xl overflow-hidden [&>button]:!bg-transparent [&>button]:!border-b [&>button]:!border-slate-200 dark:[&>button]:!border-white/10 [&>button:last-child]:!border-none dark:[&>button>path]:!fill-slate-300 dark:[&>button:hover>path]:!fill-cyan-400 [&>button:hover]:!bg-slate-100 dark:[&>button:hover]:!bg-white/5" />
        </ReactFlow>
      </div>
    </div>
  );
}

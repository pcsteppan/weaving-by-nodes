import React, { useCallback, useMemo } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, Background } from 'reactflow';
import CanvasNode from './CanvasNode';
import TextileNode from './TextileNode';
 
import 'reactflow/dist/style.css';
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'tieup' }, type: 'canvasNode' },
  { id: '2', position: { x: 0, y: 140 }, data: { label: 'threading' }, type: 'canvasNode' },
  { id: '3', position: { x: 0, y: 280 }, data: { label: 'treadling' }, type: 'canvasNode' },
  { id: '4', position: { x: 400, y: 0 }, data: { label: 'textile' }, type: 'textileNode' },
];

const initialEdges = [
  { id: 'e1-4', source: '1', target: '4', targetHandle: 'tieup' },
  { id: 'e2-4', source: '2', target: '4', targetHandle: 'treadling' },
  { id: 'e3-4', source: '3', target: '4', targetHandle: 'threading' },
];

export default function App() {
  const nodeTypes = useMemo(() => ({ 
    canvasNode: CanvasNode,
    textileNode: TextileNode,
  }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        snapGrid={[20, 20]}
        snapToGrid={true} 
      >
        <Background variant="dots" gap={20} size={1} color="white" style={{
          backgroundColor: '#000',
        }}/>
        <Controls />
      </ReactFlow>
    </div>
  );
}
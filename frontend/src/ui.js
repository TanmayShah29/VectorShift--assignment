import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { TextNode } from './nodes/textNode';
import { ConfigNode } from './nodes/ConfigNode';
import { getNodeDefaults, nodeDefinitions } from './nodes/nodeDefinitions';

const gridSize = 20;
const accentColors = {
  green: '#12805c',
  purple: '#6d4aff',
  orange: '#c96710',
  blue: '#2454ff',
  teal: '#0f7f8c',
  pink: '#c73573',
  yellow: '#a76f00',
  red: '#c23b35',
  slate: '#475569',
};
const getMiniMapNodeColor = (node) => accentColors[nodeDefinitions[node.type]?.accent] || '#94a3c4';
const proOptions = { hideAttribution: true };
const nodeTypes = {
  // InputNode, LLMNode, and OutputNode had no behavior beyond what ConfigNode
  // already provides — they just read from nodeDefinitions and forwarded to
  // BaseNode.  Consolidating them here removes the duplication.
  customInput: ConfigNode,
  llm: ConfigNode,
  customOutput: ConfigNode,
  text: TextNode,
  prompt: ConfigNode,
  transform: ConfigNode,
  filter: ConfigNode,
  api: ConfigNode,
  database: ConfigNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setConnectingHandle: state.setConnectingHandle,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      setConnectingHandle,
    } = useStore(selector, shallow);

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
          if (!reactFlowInstance) {
            return;
          }
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getNodeDefaults(type, nodeID),
            };
      
            addNode(newNode);
          }
        },
        [addNode, getNodeID, reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Highlight every compatible handle on other nodes while the user is
    // dragging a new connection, and clear the highlight once they let go
    // (whether or not the drag resulted in an actual edge).
    const onConnectStart = useCallback(
        (event, { nodeId, handleType }) => {
          setConnectingHandle(nodeId, handleType);
        },
        [setConnectingHandle]
    );

    const onConnectEnd = useCallback(() => {
        setConnectingHandle(null, null);
    }, [setConnectingHandle]);

    return (
        <main className="canvas-shell">
          <div className="canvas-header">
            <div className="canvas-header__left">
              <span className="canvas-header__eyebrow">Pipeline Editor</span>
              <input
                className="canvas-header__title"
                defaultValue="Untitled Pipeline"
                aria-label="Pipeline name"
                spellCheck={false}
              />
            </div>
            <div className="canvas-stats">
              <span className="canvas-stat canvas-stat--nodes">
                <span className="canvas-stat__dot" aria-hidden="true" />
                <span>{nodes.length} nodes</span>
              </span>
              <span className="canvas-stat canvas-stat--edges">
                <span className="canvas-stat__dot" aria-hidden="true" />
                <span>{edges.length} edges</span>
              </span>
            </div>
          </div>

        <div ref={reactFlowWrapper} className="reactflow-wrapper">
            {nodes.length === 0 && (
              <div className="canvas-empty-state" aria-hidden="true">
                <div className="canvas-empty-state__icon">+</div>
                <p className="canvas-empty-state__title">Your canvas is empty</p>
                <p className="canvas-empty-state__hint">Drag a node from the sidebar to get started</p>
              </div>
            )}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType="default"
                connectionLineStyle={{ stroke: '#2454ff', strokeWidth: 2.5 }}
                fitView
            >
                <Background variant="cross" color="#c8d3e8" gap={22} size={1} />
                <Controls />
                <MiniMap
                  className="pipeline-minimap"
                  nodeColor={getMiniMapNodeColor}
                  nodeStrokeWidth={0}
                  maskColor="rgba(244, 246, 251, 0.75)"
                  pannable
                  zoomable
                />
            </ReactFlow>
        </div>
        </main>
    )
}

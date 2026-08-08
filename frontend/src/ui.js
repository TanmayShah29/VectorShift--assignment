import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { ConfigNode } from './nodes/ConfigNode';
import { getNodeDefaults } from './nodes/nodeDefinitions';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
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
            <div>
              <span className="eyebrow">Workflow Canvas</span>
              <h2>Design your AI pipeline</h2>
            </div>
            <div className="canvas-stats">
              <span>{nodes.length} nodes</span>
              <span>{edges.length} edges</span>
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
                connectionLineType='smoothstep'
                fitView
            >
                <Background color="#d5dae8" gap={gridSize} />
                <Controls />
                <MiniMap className="pipeline-minimap" />
            </ReactFlow>
        </div>
        </main>
    )
}

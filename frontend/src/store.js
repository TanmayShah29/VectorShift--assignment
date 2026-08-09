// Zustand store — the single source of truth for all pipeline state: the
// node/edge lists, per-type id counters, connection-drag highlight state, and
// the last /pipelines/parse result. React Flow's nodes/edges are derived from
// here and every mutation (add/delete/update/connect) goes through these
// actions, which is also where self-loops and duplicate edges are rejected.
import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    // Tracks the node/handle a connection drag started from, so handles on
    // other nodes can highlight themselves as valid drop targets while the
    // user is dragging a new edge.
    connectingNodeId: null,
    connectingHandleType: null,
    setConnectingHandle: (nodeId, handleType) => {
      set({ connectingNodeId: nodeId, connectingHandleType: handleType });
    },
    // Result of the last /pipelines/parse submission, surfaced via the
    // in-app ResultModal instead of a native browser alert.
    pipelineResult: null,
    pipelineResultStatus: null,
    setPipelineResult: (result, status) => {
      set({ pipelineResult: result, pipelineResultStatus: status });
    },
    clearPipelineResult: () => {
      set({ pipelineResult: null, pipelineResultStatus: null });
    },
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    deleteNode: (nodeId) => {
      set({
        nodes: get().nodes.filter((node) => node.id !== nodeId),
        edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      });
    },
    // Called by ReactFlow's onNodesDelete (fires on keyboard Delete/Backspace
    // for the current selection). Removes edges connected to any deleted node.
    onNodesDelete: (deletedNodes) => {
      const ids = new Set(deletedNodes.map((n) => n.id));
      set({
        edges: get().edges.filter(
          (edge) => !ids.has(edge.source) && !ids.has(edge.target)
        ),
      });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      // Guard against self-loops (a node connecting to itself) and against
      // creating an exact duplicate of an edge that already exists.
      if (connection.source === connection.target) {
        return;
      }

      const isDuplicate = get().edges.some(
        (edge) =>
          edge.source === connection.source &&
          edge.target === connection.target &&
          edge.sourceHandle === connection.sourceHandle &&
          edge.targetHandle === connection.targetHandle
      );
      if (isDuplicate) {
        return;
      }

      set({
        edges: addEdge(
          {
            ...connection,
            type: 'default',
            // No animated:true — solid lines read as "connected"
            style: { stroke: '#94a3b8', strokeWidth: 1.6 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8', width: 14, height: 14 },
          },
          get().edges
        ),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, [fieldName]: fieldValue },
            };
          }
  
          return node;
        }),
      });
    },
  }));

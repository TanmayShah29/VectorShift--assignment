// Left sidebar. Renders the brand header plus one DraggableNode button for
// every type in the nodePalette (ordered in nodes/nodeDefinitions.js).
import { DraggableNode } from './draggableNode';
import { nodeDefinitions, nodePalette } from './nodes/nodeDefinitions';

export const PipelineToolbar = () => {
  return (
    <aside className="pipeline-toolbar">
      <div className="toolbar__brand">
        <div className="toolbar__mark">VS</div>
        <div>
          <h1>Pipeline Builder</h1>
          <p>Drag nodes onto the canvas</p>
        </div>
      </div>

      <div className="toolbar__section">
        <span className="toolbar__section-label">Nodes</span>
        <div className="toolbar__nodes">
          {nodePalette.map((type) => (
            <DraggableNode key={type} type={type} definition={nodeDefinitions[type]} />
          ))}
        </div>
      </div>
    </aside>
  );
};

// A single draggable button in the left palette. On drag start it writes its
// node type into the 'application/reactflow' dataTransfer payload, which ui.js
// reads back when the node is dropped onto the canvas.
export const DraggableNode = ({ type, definition }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.currentTarget.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <button
      className={`draggable-node draggable-node--${definition.accent}`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => {
        event.currentTarget.style.cursor = 'grab';
      }}
      draggable
      type="button"
    >
      <span className="draggable-node__icon">{definition.icon}</span>
      <span className="draggable-node__label">{definition.label}</span>
    </button>
  );
};

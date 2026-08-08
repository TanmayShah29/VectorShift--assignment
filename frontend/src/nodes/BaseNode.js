import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const getHandlePosition = (index, total) => {
  if (total <= 1) {
    return '50%';
  }

  return `${((index + 1) * 100) / (total + 1)}%`;
};

const Field = ({ nodeId, field }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const value = field.value ?? '';

  const handleChange = (event) => {
    updateNodeField(nodeId, field.name, event.target.value);
  };

  if (field.type === 'select') {
    return (
      <label className="node-field">
        <span>{field.label}</span>
        <select value={value} onChange={handleChange}>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === 'textarea') {
    return (
      <label className="node-field node-field--full">
        <span>{field.label}</span>
        <textarea
          value={value}
          onChange={handleChange}
          rows={field.rows || 3}
          placeholder={field.placeholder}
        />
      </label>
    );
  }

  return (
    <label className="node-field">
      <span>{field.label}</span>
      <input
        type={field.type || 'text'}
        value={value}
        onChange={handleChange}
        placeholder={field.placeholder}
      />
    </label>
  );
};

export const BaseNode = memo(
  ({
    id,
    title,
    description,
    icon,
    accent = 'blue',
    inputs = [],
    outputs = [],
    fields = [],
    children,
    style,
    className = '',
  }) => {
    const deleteNode = useStore((state) => state.deleteNode);
    const connectingNodeId = useStore((state) => state.connectingNodeId);
    const connectingHandleType = useStore((state) => state.connectingHandleType);

    // While the user drags a new edge from a source handle, every target
    // handle on every *other* node is a valid drop point (and vice versa if
    // they start the drag from a target handle) - highlight those so it's
    // obvious at a glance where the connection can land.
    const isConnecting = connectingNodeId !== null && connectingNodeId !== id;
    const targetsHighlighted = isConnecting && connectingHandleType === 'source';
    const sourcesHighlighted = isConnecting && connectingHandleType === 'target';

    const handleDelete = (event) => {
      event.stopPropagation();
      deleteNode(id);
    };

    return (
      <div className={`base-node base-node--${accent} ${className}`} style={style}>
        <button
          className="base-node__delete nodrag"
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${title} node`}
          title="Delete node"
        >
          x
        </button>

        {inputs.map((input, index) => (
          <Handle
            key={input.id}
            type="target"
            position={Position.Left}
            id={`${id}-${input.id}`}
            className={`node-handle node-handle--target ${targetsHighlighted ? 'node-handle--highlight' : ''}`}
            style={{ top: input.top || getHandlePosition(index, inputs.length) }}
          />
        ))}

        <div className="base-node__header">
          <div className="base-node__icon" aria-hidden="true">
            {icon}
          </div>
          <div>
            <div className="base-node__title">{title}</div>
            {description && <div className="base-node__description">{description}</div>}
          </div>
        </div>

        {fields.length > 0 && (
          <div className="base-node__fields">
            {fields.map((field) => (
              <Field key={field.name} nodeId={id} field={field} />
            ))}
          </div>
        )}

        {children}

        {outputs.map((output, index) => (
          <Handle
            key={output.id}
            type="source"
            position={Position.Right}
            id={`${id}-${output.id}`}
            className={`node-handle node-handle--source ${sourcesHighlighted ? 'node-handle--highlight' : ''}`}
            style={{ top: output.top || getHandlePosition(index, outputs.length) }}
          />
        ))}
      </div>
    );
  }
);

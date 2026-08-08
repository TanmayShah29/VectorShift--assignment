import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

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
    selected = false,
  }) => {
    const deleteNode = useStore((state) => state.deleteNode);

    // Use a single shallow-compared selector that derives the three boolean
    // flags this node needs from the global connecting state.  This means
    // the component only re-renders when *its own* highlight state changes,
    // instead of every node re-rendering whenever any edge drag starts.
    const { targetsHighlighted, sourcesHighlighted } = useStore(
      useCallback(
        (state) => {
          const draggingFromOtherNode =
            state.connectingNodeId !== null && state.connectingNodeId !== id;
          return {
            targetsHighlighted:
              draggingFromOtherNode && state.connectingHandleType === 'source',
            sourcesHighlighted:
              draggingFromOtherNode && state.connectingHandleType === 'target',
          };
        },
        [id]
      ),
      shallow
    );

    const handleDelete = (event) => {
      event.stopPropagation();
      deleteNode(id);
    };

    return (
      <div
        className={`base-node base-node--${accent} ${selected ? 'base-node--selected' : ''} ${className}`}
        style={style}
      >
        <button
          className="base-node__delete nodrag"
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${title} node`}
          title="Delete node"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path
              d="M1 1L9 9M9 1L1 9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
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

import { useMemo } from 'react';
import { BaseNode } from './BaseNode';
import { nodeDefinitions } from './nodeDefinitions';
import { useStore } from '../store';
import { getVariables, getTextNodeDimensions } from './textNodeUtils';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const definition = nodeDefinitions.text;
  const text = data.text ?? '';
  const variables = useMemo(() => getVariables(text), [text]);
  const { width, rows } = useMemo(() => getTextNodeDimensions(text), [text]);

  const handleTextChange = (event) => {
    updateNodeField(id, 'text', event.target.value);
  };

  const dynamicInputs = variables.map((variable) => ({
    id: `var-${variable}`,
    label: variable,
  }));

  return (
    <BaseNode
      id={id}
      title={definition.title}
      description={definition.description}
      icon={definition.icon}
      accent={definition.accent}
      inputs={dynamicInputs}
      outputs={definition.outputs}
      className="text-node"
      style={{ width }}
    >
      <label className="node-field node-field--full">
        <span>Text</span>
        <textarea
          value={text}
          onChange={handleTextChange}
          rows={rows}
          placeholder="Write text and reference variables like {{ customer_name }}"
          aria-label="Text node content"
        />
      </label>

      {variables.length > 0 && (
        <div className="variable-list">
          {variables.map((variable) => (
            <span key={variable} className="variable-pill">
              {variable}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};

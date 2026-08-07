import { useMemo } from 'react';
import { BaseNode } from './BaseNode';
import { nodeDefinitions } from './nodeDefinitions';
import { useStore } from '../store';

const variablePattern = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;

const getVariables = (text) => {
  const matches = [...text.matchAll(variablePattern)].map((match) => match[1]);
  return [...new Set(matches)];
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const definition = nodeDefinitions.text;
  const text = data.text ?? '';
  const variables = useMemo(() => getVariables(text), [text]);

  const handleTextChange = (event) => {
    updateNodeField(id, 'text', event.target.value);
  };

  const textLength = Math.max(text.length, 1);
  const width = Math.min(440, Math.max(240, textLength * 6.4));
  const rows = Math.min(8, Math.max(3, Math.ceil(textLength / 36)));
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

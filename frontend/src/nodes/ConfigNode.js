import { BaseNode } from './BaseNode';
import { nodeDefinitions } from './nodeDefinitions';

export const ConfigNode = ({ id, data, selected }) => {
  const definition = nodeDefinitions[data.nodeType];

  if (!definition) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[ConfigNode] Unknown nodeType "${data.nodeType}" — no definition found in nodeDefinitions.js.`
      );
    }
    return null;
  }

  const fields = (definition.fields || []).map((field) => ({
    ...field,
    value: data[field.name],
  }));

  return (
    <BaseNode
      id={id}
      title={definition.title}
      description={definition.description}
      icon={definition.icon}
      accent={definition.accent}
      inputs={definition.inputs}
      outputs={definition.outputs}
      fields={fields}
      selected={selected}
    />
  );
};

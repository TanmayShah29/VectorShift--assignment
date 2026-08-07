import { BaseNode } from './BaseNode';
import { nodeDefinitions } from './nodeDefinitions';

export const ConfigNode = ({ id, data }) => {
  const definition = nodeDefinitions[data.nodeType];

  if (!definition) {
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
    />
  );
};

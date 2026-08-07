import { BaseNode } from './BaseNode';
import { nodeDefinitions } from './nodeDefinitions';

export const InputNode = ({ id, data }) => {
  const definition = nodeDefinitions.customInput;

  const fields = definition.fields.map((field) => ({
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
      outputs={definition.outputs}
      fields={fields}
    />
  );
};

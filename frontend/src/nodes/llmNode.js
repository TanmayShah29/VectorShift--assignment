import { BaseNode } from './BaseNode';
import { nodeDefinitions } from './nodeDefinitions';

export const LLMNode = ({ id, data, selected }) => {
  const definition = nodeDefinitions.llm;

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
      inputs={definition.inputs}
      outputs={definition.outputs}
      fields={fields}
      selected={selected}
    />
  );
};

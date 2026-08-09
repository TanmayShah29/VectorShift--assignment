// LLM node component. Reads the 'llm' definition from nodeDefinitions and
// composes BaseNode with its system/prompt inputs, response output, and model
// + temperature fields. Kept as its own file for clarity even though the
// generic ConfigNode can render the same shape.
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

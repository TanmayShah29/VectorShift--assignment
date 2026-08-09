// Input node component. Reads the 'customInput' definition from
// nodeDefinitions and composes BaseNode with its output handle and editable
// fields (name + type). Kept as its own file for clarity even though the
// generic ConfigNode can render the same shape.
import { BaseNode } from './BaseNode';
import { nodeDefinitions } from './nodeDefinitions';

export const InputNode = ({ id, data, selected }) => {
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
      selected={selected}
    />
  );
};

// Output node component. Reads the 'customOutput' definition from
// nodeDefinitions and composes BaseNode with its value input and editable
// fields (name + type). Kept as its own file for clarity even though the
// generic ConfigNode can render the same shape.
import { BaseNode } from './BaseNode';
import { nodeDefinitions } from './nodeDefinitions';

export const OutputNode = ({ id, data, selected }) => {
  const definition = nodeDefinitions.customOutput;

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
      fields={fields}
      selected={selected}
    />
  );
};

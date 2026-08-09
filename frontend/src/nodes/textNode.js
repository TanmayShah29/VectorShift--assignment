// Text node — the node type with genuinely custom behavior. Parses
// {{ variable }} references out of the text, exposes each one as a dynamic
// input handle, shows clickable pills that re-insert a variable at the cursor,
// and auto-resizes the node's width/rows as the user types. Everything else
// delegates to BaseNode.
import { useMemo, useRef } from 'react';
import { BaseNode } from './BaseNode';
import { nodeDefinitions } from './nodeDefinitions';
import { useStore } from '../store';
import { getVariables, getTextNodeDimensions } from './textNodeUtils';

export const TextNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const definition = nodeDefinitions.text;
  const text = data.text ?? '';
  const variables = useMemo(() => getVariables(text), [text]);
  const { width, rows } = useMemo(() => getTextNodeDimensions(text), [text]);
  const textareaRef = useRef(null);

  const handleTextChange = (event) => {
    updateNodeField(id, 'text', event.target.value);
  };

  // Clicking a variable pill re-inserts `{{ variable }}` at the current
  // cursor position, so users can reference the same variable more than
  // once without retyping the curly-brace syntax by hand.
  const insertVariableAtCursor = (variable) => {
    const el = textareaRef.current;
    const insertion = `{{ ${variable} }}`;

    if (!el) {
      updateNodeField(id, 'text', `${text}${insertion}`);
      return;
    }

    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const nextText = text.slice(0, start) + insertion + text.slice(end);
    updateNodeField(id, 'text', nextText);

    const cursor = start + insertion.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
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
      selected={selected}
    >
      <label className="node-field node-field--full">
        <span>Text</span>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          rows={rows}
          placeholder="Write text and reference variables like {{ customer_name }}"
          aria-label="Text node content"
        />
      </label>

      {variables.length > 0 && (
        <div className="variable-list">
          <span className="variable-list__label">
            {variables.length} variable{variables.length !== 1 ? 's' : ''} detected — click to
            insert
          </span>
          <div className="variable-list__pills">
            {variables.map((variable) => (
              <button
                key={variable}
                type="button"
                className="variable-pill nodrag"
                onClick={() => insertVariableAtCursor(variable)}
                title={`Insert {{ ${variable} }} at the cursor`}
              >
                {variable}
              </button>
            ))}
          </div>
        </div>
      )}
    </BaseNode>
  );
};

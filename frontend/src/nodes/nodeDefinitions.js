// Data-driven registry of every node type: title, icon, accent color,
// input/output handles, editable fields, and per-node default values. Also
// exports the ordered palette used by the toolbar and the getNodeDefaults()
// factory that seeds the data of a freshly dropped node. Adding a standard
// node type usually means adding one entry here and nothing else.
export const nodeDefinitions = {
  customInput: {
    label: 'Input',
    title: 'Input',
    icon: 'I',
    accent: 'green',
    description: 'Pipeline entry value',
    outputs: [{ id: 'value' }],
    defaults: (id) => ({
      inputName: id.replace('customInput-', 'input_'),
      inputType: 'Text',
    }),
    fields: [
      { name: 'inputName', label: 'Name', type: 'text' },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
          { value: 'Number', label: 'Number' },
        ],
      },
    ],
  },
  llm: {
    label: 'LLM',
    title: 'LLM',
    icon: 'L',
    accent: 'purple',
    description: 'Generate a response',
    inputs: [
      { id: 'system', label: 'System' },
      { id: 'prompt', label: 'Prompt' },
    ],
    outputs: [{ id: 'response' }],
    defaults: () => ({
      model: 'gpt-4o-mini',
      temperature: '0.7',
    }),
    fields: [
      {
        name: 'model',
        label: 'Model',
        type: 'select',
        options: [
          { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
          { value: 'gpt-4o', label: 'GPT-4o' },
          { value: 'claude-sonnet', label: 'Claude Sonnet' },
        ],
      },
      { name: 'temperature', label: 'Temp', type: 'text' },
    ],
  },
  customOutput: {
    label: 'Output',
    title: 'Output',
    icon: 'O',
    accent: 'orange',
    description: 'Final pipeline result',
    inputs: [{ id: 'value' }],
    defaults: (id) => ({
      outputName: id.replace('customOutput-', 'output_'),
      outputType: 'Text',
    }),
    fields: [
      { name: 'outputName', label: 'Name', type: 'text' },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' },
          { value: 'File', label: 'File' },
        ],
      },
    ],
  },
  text: {
    label: 'Text',
    title: 'Text',
    icon: 'T',
    accent: 'blue',
    description: 'Template text with variables',
    outputs: [{ id: 'output' }],
    defaults: () => ({
      text: '{{ input }}',
    }),
  },
  prompt: {
    label: 'Prompt',
    title: 'Prompt',
    icon: 'P',
    accent: 'teal',
    description: 'Reusable instruction',
    inputs: [{ id: 'context' }],
    outputs: [{ id: 'prompt' }],
    defaults: () => ({
      promptName: 'Research Prompt',
      tone: 'Concise',
    }),
    fields: [
      { name: 'promptName', label: 'Name', type: 'text' },
      {
        name: 'tone',
        label: 'Tone',
        type: 'select',
        options: [
          { value: 'Concise', label: 'Concise' },
          { value: 'Friendly', label: 'Friendly' },
          { value: 'Formal', label: 'Formal' },
        ],
      },
    ],
  },
  transform: {
    label: 'Transform',
    title: 'Transform',
    icon: 'Fx',
    accent: 'pink',
    description: 'Map data into a new shape',
    inputs: [{ id: 'input' }],
    outputs: [{ id: 'result' }],
    defaults: () => ({
      operation: 'Summarize',
    }),
    fields: [
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        options: [
          { value: 'Summarize', label: 'Summarize' },
          { value: 'Extract JSON', label: 'Extract JSON' },
          { value: 'Normalize', label: 'Normalize' },
        ],
      },
    ],
  },
  filter: {
    label: 'Filter',
    title: 'Filter',
    icon: 'F',
    accent: 'yellow',
    description: 'Route matching records',
    inputs: [{ id: 'items' }],
    outputs: [
      { id: 'pass', label: 'Pass' },
      { id: 'fail', label: 'Fail' },
    ],
    defaults: () => ({
      condition: 'score > 0.8',
    }),
    fields: [{ name: 'condition', label: 'Condition', type: 'text' }],
  },
  api: {
    label: 'API',
    title: 'API Request',
    icon: 'A',
    accent: 'red',
    description: 'Call an external service',
    inputs: [
      { id: 'url', label: 'URL' },
      { id: 'body', label: 'Body' },
    ],
    outputs: [{ id: 'response' }],
    defaults: () => ({
      method: 'POST',
      endpoint: 'https://api.example.com',
    }),
    fields: [
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
        ],
      },
      { name: 'endpoint', label: 'URL', type: 'text' },
    ],
  },
  database: {
    label: 'Database',
    title: 'Database',
    icon: 'DB',
    accent: 'slate',
    description: 'Read or write records',
    inputs: [{ id: 'query' }],
    outputs: [{ id: 'rows' }],
    defaults: () => ({
      table: 'customers',
      action: 'Select',
    }),
    fields: [
      { name: 'table', label: 'Table', type: 'text' },
      {
        name: 'action',
        label: 'Action',
        type: 'select',
        options: [
          { value: 'Select', label: 'Select' },
          { value: 'Insert', label: 'Insert' },
          { value: 'Update', label: 'Update' },
        ],
      },
    ],
  },
};

export const nodePalette = [
  'customInput',
  'llm',
  'customOutput',
  'text',
  'prompt',
  'transform',
  'filter',
  'api',
  'database',
];

export const getNodeDefaults = (type, id) => {
  const definition = nodeDefinitions[type];
  const defaults = definition?.defaults?.(id) || {};
  return {
    id,
    nodeType: type,
    ...defaults,
  };
};

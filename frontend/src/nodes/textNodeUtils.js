// Shared logic for the Text node, pulled out of textNode.js so it can be
// unit-tested independently of React/reactflow.

const variablePattern = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;

/**
 * Returns the unique, ordered list of valid JS-identifier variable names
 * referenced in `text` via the {{ variable }} syntax. Invalid identifiers
 * (e.g. {{ 1abc }} or {{ a-b }}) are ignored, matching JS variable naming
 * rules.
 */
export const getVariables = (text) => {
  if (!text) {
    return [];
  }

  const matches = [...text.matchAll(variablePattern)].map((match) => match[1]);
  return [...new Set(matches)];
};

const MIN_WIDTH = 240;
const MAX_WIDTH = 480;
const MIN_ROWS = 3;
const MAX_ROWS = 12;
const CHAR_WIDTH = 6.4;
const AVG_CHARS_PER_ROW = 36;

/**
 * Computes the pixel width and textarea row count that should be used to
 * size the Text node as the user types. Grows with both explicit newlines
 * and long unbroken lines, and clamps to sane min/max bounds so the node
 * never becomes unusably small or huge.
 */
export const getTextNodeDimensions = (text = '') => {
  const lines = text.length > 0 ? text.split('\n') : [''];
  const longestLine = lines.reduce((max, line) => Math.max(max, line.length), 0);

  const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, longestLine * CHAR_WIDTH));

  // Rows needed = explicit line breaks + wrapping within long lines.
  const wrappedRows = lines.reduce(
    (sum, line) => sum + Math.max(1, Math.ceil(line.length / AVG_CHARS_PER_ROW)),
    0
  );
  const rows = Math.min(MAX_ROWS, Math.max(MIN_ROWS, wrappedRows));

  return { width, rows };
};

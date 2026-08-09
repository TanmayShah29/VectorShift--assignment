// Unit tests for textNodeUtils.js: variable extraction and auto-resize
// dimension logic for the Text node. Run from the frontend directory with
// `npm test`.
import { getVariables, getTextNodeDimensions } from './textNodeUtils';

describe('getVariables', () => {
  test('returns an empty array for text with no variables', () => {
    expect(getVariables('hello world')).toEqual([]);
  });

  test('extracts a single variable', () => {
    expect(getVariables('Hello {{ name }}!')).toEqual(['name']);
  });

  test('extracts multiple unique variables in order of first appearance', () => {
    expect(getVariables('{{ greeting }}, {{ name }}! Again: {{ greeting }}')).toEqual([
      'greeting',
      'name',
    ]);
  });

  test('ignores invalid JS identifiers', () => {
    expect(getVariables('{{ 1abc }} {{ a-b }} {{ }}')).toEqual([]);
  });

  test('allows underscores and dollar signs, and tolerates extra whitespace', () => {
    expect(getVariables('{{_private}} {{ $value }} {{  spaced_out  }}')).toEqual([
      '_private',
      '$value',
      'spaced_out',
    ]);
  });

  test('handles empty or undefined input', () => {
    expect(getVariables('')).toEqual([]);
    expect(getVariables(undefined)).toEqual([]);
  });
});

describe('getTextNodeDimensions', () => {
  test('returns minimum size for empty text', () => {
    const { width, rows } = getTextNodeDimensions('');
    expect(width).toBe(240);
    expect(rows).toBe(3);
  });

  test('grows rows with explicit newlines', () => {
    const { rows } = getTextNodeDimensions('line1\nline2\nline3\nline4\nline5');
    expect(rows).toBeGreaterThanOrEqual(5);
  });

  test('grows width with a long single line, up to the max', () => {
    const longLine = 'a'.repeat(200);
    const { width } = getTextNodeDimensions(longLine);
    expect(width).toBe(480);
  });

  test('never exceeds the max row count', () => {
    const manyLines = new Array(50).fill('x').join('\n');
    const { rows } = getTextNodeDimensions(manyLines);
    expect(rows).toBeLessThanOrEqual(12);
  });
});

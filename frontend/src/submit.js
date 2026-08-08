import { useState } from 'react';
import { useStore } from './store';

// Configurable via .env (REACT_APP_BACKEND_URL) so the same build can point
// at a different backend without code changes; falls back to the local dev
// server used throughout this assessment.
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export const SubmitButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const setPipelineResult = useStore((state) => state.setPipelineResult);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Send only the fields the backend actually uses — avoids leaking
      // ReactFlow's internal state (position, selected, dragging, …) over the wire.
      const payload = {
        nodes: nodes.map(({ id }) => ({ id })),
        edges: edges.map(({ source, target, sourceHandle, targetHandle }) => ({
          source,
          target,
          sourceHandle,
          targetHandle,
        })),
      };

      const response = await fetch(`${BACKEND_URL}/pipelines/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Unable to parse pipeline');
      }

      const result = await response.json();
      setPipelineResult(result, 'success');
    } catch (error) {
      setPipelineResult(
        { message: `Please make sure FastAPI is running on ${BACKEND_URL}.` },
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-bar">
      <div>
        <strong>Ready to validate?</strong>
        <span>Submit sends the current graph to FastAPI for analysis.</span>
      </div>
      <button className="submit-button" type="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Checking...' : 'Submit Pipeline'}
      </button>
    </div>
  );
};

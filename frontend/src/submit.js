import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error('Unable to parse pipeline');
      }

      const result = await response.json();
      const dagText = result.is_dag ? 'is a DAG' : 'contains a cycle';

      alert(
        `Pipeline summary\n\nNodes: ${result.num_nodes}\nEdges: ${result.num_edges}\nStatus: This pipeline ${dagText}.`
      );
    } catch (error) {
      alert(
        'Could not reach the backend. Please make sure FastAPI is running on http://localhost:8000.'
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

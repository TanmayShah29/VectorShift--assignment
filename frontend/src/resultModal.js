import { useEffect, useRef } from 'react';
import { useStore } from './store';

/**
 * In-app replacement for window.alert() when a pipeline submission returns.
 * Satisfies the "create an alert that displays num_nodes/num_edges/is_dag
 * in a user-friendly manner" requirement, but as a real UI surface instead
 * of a native browser popup - it's keyboard-dismissable, screen-reader
 * announced (role="alert"), and communicates the DAG/cycle outcome with
 * color and iconography instead of plain text.
 */
export const ResultModal = () => {
  const pipelineResult = useStore((state) => state.pipelineResult);
  const pipelineResultStatus = useStore((state) => state.pipelineResultStatus);
  const clearPipelineResult = useStore((state) => state.clearPipelineResult);
  const closeButtonRef = useRef(null);

  const isOpen = pipelineResult !== null;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        clearPipelineResult();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, clearPipelineResult]);

  if (!isOpen) {
    return null;
  }

  const isError = pipelineResultStatus === 'error';
  const isCycle = !isError && pipelineResult.is_dag === false;
  const tone = isError ? 'error' : isCycle ? 'warning' : 'success';

  const heading = isError
    ? 'Could not reach the backend'
    : isCycle
    ? 'Cycle detected'
    : 'Valid pipeline';

  return (
    <div className="result-modal-overlay" onClick={clearPipelineResult}>
      <div
        className="result-modal"
        role="alert"
        aria-live="assertive"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`result-modal__icon result-modal__icon--${tone}`} aria-hidden="true">
          {tone === 'success' ? '✓' : '!'}
        </div>

        <h3 className="result-modal__title">{heading}</h3>

        {isError ? (
          <p className="result-modal__message">{pipelineResult.message}</p>
        ) : (
          <>
            <p className="result-modal__message">
              {isCycle
                ? 'This pipeline contains a cycle, so it is not a valid DAG.'
                : 'This pipeline forms a valid directed acyclic graph.'}
            </p>
            <div className="result-modal__stats">
              <div className="result-modal__stat">
                <span className="result-modal__stat-value">{pipelineResult.num_nodes}</span>
                <span className="result-modal__stat-label">Nodes</span>
              </div>
              <div className="result-modal__stat">
                <span className="result-modal__stat-value">{pipelineResult.num_edges}</span>
                <span className="result-modal__stat-label">Edges</span>
              </div>
              <div className="result-modal__stat">
                <span className="result-modal__stat-value">
                  {pipelineResult.is_dag ? 'Yes' : 'No'}
                </span>
                <span className="result-modal__stat-label">Is DAG</span>
              </div>
            </div>
          </>
        )}

        <button
          ref={closeButtonRef}
          className="result-modal__close"
          type="button"
          onClick={clearPipelineResult}
        >
          Close
        </button>
      </div>
    </div>
  );
};

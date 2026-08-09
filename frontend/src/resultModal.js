// In-app dialog that presents the pipeline parse result returned by the
// backend: node/edge/component counts, the DAG verdict, the topological order
// (or the detected cycle path when invalid), and any isolated nodes. Replaces
// window.alert() and is keyboard-dismissable (Esc) + screen-reader announced.
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
          <div className="result-modal__content-wrapper">
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
                <span className="result-modal__stat-value">{pipelineResult.components}</span>
                <span className="result-modal__stat-label">Components</span>
              </div>
            </div>

            {/* Topological Sort OR Cycle Path */}
            {pipelineResult.is_dag ? (
                <div className="result-modal__section">
                    <h4 className="result-modal__section-title">Topological Order</h4>
                    {pipelineResult.topological_sort?.length > 0 ? (
                        <div className="result-modal__path">
                            {pipelineResult.topological_sort.map((nodeId, idx) => (
                                <div key={idx} className="result-modal__path-item">
                                    <span className="result-modal__node-id">{nodeId}</span>
                                    {idx < pipelineResult.topological_sort.length - 1 && (
                                        <span className="result-modal__path-arrow">→</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="result-modal__empty-text">Graph is empty.</p>
                    )}
                </div>
            ) : (
                <div className="result-modal__section">
                    <h4 className="result-modal__section-title">Cycle Path</h4>
                    {pipelineResult.cycle_path?.length > 0 ? (
                         <div className="result-modal__path result-modal__path--cycle">
                            {pipelineResult.cycle_path.map((nodeId, idx) => (
                                <div key={idx} className="result-modal__path-item">
                                    <span className="result-modal__node-id">{nodeId}</span>
                                    {idx < pipelineResult.cycle_path.length - 1 && (
                                        <span className="result-modal__path-arrow">→</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                         <p className="result-modal__empty-text">No path returned.</p>
                    )}
                </div>
            )}

            {/* Isolated Nodes */}
            {pipelineResult.isolated_nodes?.length > 0 && (
                 <div className="result-modal__section">
                 <h4 className="result-modal__section-title">Isolated Nodes</h4>
                 <div className="result-modal__chip-list">
                     {pipelineResult.isolated_nodes.map(nodeId => (
                         <span key={nodeId} className="result-modal__chip">{nodeId}</span>
                     ))}
                 </div>
             </div>
            )}
          </div>
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

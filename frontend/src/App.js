// Root component. Composes the four surfaces of the pipeline builder:
// the node palette (PipelineToolbar), the React Flow canvas (PipelineUI)
// with its submit bar (SubmitButton), and the results dialog (ResultModal).
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { ResultModal } from './resultModal';

function App() {
  return (
    <div className="app-shell">
      <PipelineToolbar />
      <section className="workspace">
        <PipelineUI />
        <SubmitButton />
      </section>
      <ResultModal />
    </div>
  );
}

export default App;

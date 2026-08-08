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

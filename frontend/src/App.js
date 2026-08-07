import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="app-shell">
      <PipelineToolbar />
      <section className="workspace">
        <PipelineUI />
        <SubmitButton />
      </section>
    </div>
  );
}

export default App;

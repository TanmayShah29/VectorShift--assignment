# VectorShift--assignment

A visual pipeline builder built with React Flow (frontend) and FastAPI (backend). Drag nodes onto the canvas, connect them, and submit the pipeline to check if the graph is a DAG.

## Project Structure

```
.
├── backend/          # FastAPI server (pipeline validation)
│   ├── main.py       # API endpoints
│   ├── graph.py      # DAG-checking logic
│   └── requirements.txt
└── frontend/         # React app (React Flow canvas)
    └── src/          # Components, nodes, state
```

## Node Abstraction

All node types render through two shared components in `frontend/src/nodes/`:

- **`BaseNode.js`** — the visual shell every node uses: delete button, positioned input/output handles, header (icon/title/description), and an auto-generated field list (text, select, textarea). It knows nothing about any specific node type.
- **`nodeDefinitions.js`** — a plain data object describing each node type (title, icon, accent color, handles, fields, default values). Adding a new node type is usually just adding an entry here.
- **`ConfigNode.js`** — a generic node component that reads a definition from `nodeDefinitions` and feeds it to `BaseNode`. Most node types (`prompt`, `transform`, `filter`, `api`, `database`) render through this with no extra code.
- Nodes with real custom behavior (`InputNode`, `OutputNode`, `LLMNode`, and `TextNode`) still compose `BaseNode` directly, but only add the logic that's actually unique to them — e.g. `TextNode` derives its `{{ variable }}` handles and auto-resize dimensions (see `textNodeUtils.js`) and passes everything else through to `BaseNode`.

This means styling or structural changes (spacing, handle placement, the delete button, focus states, etc.) are made once in `BaseNode`/`index.css` and apply to every node automatically, and new nodes with standard field types cost a single object literal rather than a new component file.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Python](https://www.python.org/) (v3.9 or newer)

## Getting Started

### 1. Clone and enter the repo

```bash
git clone https://github.com/TanmayShah29/VectorShift--assignment.git
cd VectorShift--assignment
```

### 2. Run the backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000.

### 3. Run the frontend (React)

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000 to use the app.

## Configuration

The frontend talks to the backend at `http://localhost:8000` by default. To point it somewhere else, copy `frontend/.env.example` to `frontend/.env` and set `REACT_APP_BACKEND_URL`. Likewise, the backend allows CORS requests from `http://localhost:3000` by default; override with a comma-separated `FRONTEND_ORIGINS` env var (e.g. `FRONTEND_ORIGINS=https://myapp.com uvicorn main:app`).

## Testing

Backend (DAG-detection logic — empty graphs, chains, diamonds, cycles, self-loops, disconnected components, and dangling edge references):

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

Frontend (variable-extraction and auto-resize logic used by the Text node):

```bash
cd frontend
npm test
```

## Usage

1. Drag nodes from the sidebar onto the canvas.
2. Connect them with edges.
3. Click **Submit Pipeline** to send the graph to the backend.
4. A popup shows the number of nodes, edges, and whether the pipeline is a DAG.

## API

| Method | Endpoint            | Description                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/`                 | Health check                         |
| POST   | `/pipelines/parse`  | Validate a pipeline (nodes + edges)  |

Example POST body:

```json
{
  "nodes": [{ "id": "1" }, { "id": "2" }],
  "edges": [{ "source": "1", "target": "2" }]
}
```

Response:

```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
```

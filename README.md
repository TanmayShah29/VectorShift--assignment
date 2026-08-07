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

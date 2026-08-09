# FastAPI application for the assignment backend.
#
# Exposes the pipeline-validation API the frontend submits to:
#   GET  /                 -> health check
#   POST /pipelines/parse  -> validate a pipeline (nodes + edges)
#
# CORS is permissive for the local React dev server by default and can be
# overridden via the FRONTEND_ORIGINS env var. All graph analysis is
# delegated to graph.analyze_graph().
import os
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from graph import analyze_graph


class Pipeline(BaseModel):
    nodes: list[dict[str, Any]] = []
    edges: list[dict[str, Any]] = []

app = FastAPI()

# Configurable via env (comma-separated) so the same backend can be pointed
# at a deployed frontend origin without a code change; defaults to the
# local CRA dev server used throughout this assessment.
_default_origins = "http://localhost:3000"
allowed_origins = [
    origin.strip()
    for origin in os.environ.get("FRONTEND_ORIGINS", _default_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    return analyze_graph(pipeline.nodes, pipeline.edges)

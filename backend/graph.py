# Pure graph-analysis logic used by the /pipelines/parse endpoint.
#
# Given a list of nodes and directed edges, computes:
#   - is_dag and a topological order (Kahn's algorithm)
#   - a concrete cycle path when the graph is NOT a DAG (DFS back-edge)
#   - the number of weakly connected components
#   - which nodes are isolated (no edges in either direction)
#
# Returns a single dict that main.py sends straight back to the frontend.
from collections import defaultdict, deque
from typing import Any


def analyze_graph(nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> dict[str, Any]:
    node_ids = {node.get("id") for node in nodes}
    graph = defaultdict(list)
    undirected_graph = defaultdict(list)
    in_degree = {node_id: 0 for node_id in node_ids}
    out_degree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")

        if source not in node_ids or target not in node_ids:
            continue

        graph[source].append(target)
        undirected_graph[source].append(target)
        undirected_graph[target].append(source)
        out_degree[source] += 1
        in_degree[target] += 1

    # Isolated nodes (degree 0 in both directions)
    isolated_nodes = [n for n in node_ids if in_degree[n] == 0 and out_degree[n] == 0]

    # Weakly connected components (BFS on undirected graph)
    visited_undirected = set()
    components = 0
    for n in node_ids:
        if n not in visited_undirected:
            components += 1
            queue = deque([n])
            visited_undirected.add(n)
            while queue:
                curr = queue.popleft()
                for neighbor in undirected_graph[curr]:
                    if neighbor not in visited_undirected:
                        visited_undirected.add(neighbor)
                        queue.append(neighbor)

    # Topological sort & cycle detection (Kahn's algorithm)
    queue = deque([n for n in node_ids if in_degree[n] == 0])
    topological_sort = []
    
    in_degree_copy = in_degree.copy()
    while queue:
        curr = queue.popleft()
        topological_sort.append(curr)
        for neighbor in graph[curr]:
            in_degree_copy[neighbor] -= 1
            if in_degree_copy[neighbor] == 0:
                queue.append(neighbor)

    is_dag = len(topological_sort) == len(node_ids)

    # If it's not a DAG, find a specific cycle path using DFS
    cycle_path = []
    if not is_dag:
        visited = set()
        rec_stack = set()
        path = []

        def dfs(curr):
            visited.add(curr)
            rec_stack.add(curr)
            path.append(curr)

            for neighbor in graph[curr]:
                if neighbor not in visited:
                    if dfs(neighbor):
                        return True
                elif neighbor in rec_stack:
                    path.append(neighbor)
                    return True

            rec_stack.remove(curr)
            path.pop()
            return False

        for n in node_ids:
            if n not in visited:
                if dfs(n):
                    # Extract just the cycle portion of the path
                    cycle_start_index = path.index(path[-1])
                    cycle_path = path[cycle_start_index:]
                    break

    return {
        "num_nodes": len(nodes),
        "num_edges": len(edges),
        "is_dag": is_dag,
        "topological_sort": topological_sort if is_dag else [],
        "isolated_nodes": isolated_nodes,
        "components": components,
        "cycle_path": cycle_path,
    }

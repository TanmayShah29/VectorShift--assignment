# pytest suite for graph.analyze_graph() — covers empty graphs, single nodes,
# chains, diamonds, cycles, self-loops, disconnected components, and edges
# that reference unknown nodes. Run from the backend directory with: pytest
import os
import sys

# Allow running `pytest` from the backend/ directory without a package install.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from graph import analyze_graph


def is_directed_acyclic_graph(nodes, edges):
    # Thin adapter so the tests below stay readable after graph.py's API was
    # upgraded from a boolean helper to analyze_graph() returning a dict.
    return analyze_graph(nodes, edges)["is_dag"]


def make_nodes(ids):
    return [{"id": node_id} for node_id in ids]


def make_edges(pairs):
    return [{"source": source, "target": target} for source, target in pairs]


def test_empty_graph_is_a_dag():
    assert is_directed_acyclic_graph([], []) is True


def test_single_node_no_edges_is_a_dag():
    assert is_directed_acyclic_graph(make_nodes(["a"]), []) is True


def test_linear_chain_is_a_dag():
    nodes = make_nodes(["a", "b", "c"])
    edges = make_edges([("a", "b"), ("b", "c")])
    assert is_directed_acyclic_graph(nodes, edges) is True


def test_disconnected_components_are_a_dag():
    nodes = make_nodes(["a", "b", "c", "d"])
    edges = make_edges([("a", "b"), ("c", "d")])
    assert is_directed_acyclic_graph(nodes, edges) is True


def test_diamond_shape_is_a_dag():
    # a -> b -> d, a -> c -> d (a DAG despite two paths converging on d)
    nodes = make_nodes(["a", "b", "c", "d"])
    edges = make_edges([("a", "b"), ("a", "c"), ("b", "d"), ("c", "d")])
    assert is_directed_acyclic_graph(nodes, edges) is True


def test_simple_cycle_is_not_a_dag():
    nodes = make_nodes(["a", "b", "c"])
    edges = make_edges([("a", "b"), ("b", "c"), ("c", "a")])
    assert is_directed_acyclic_graph(nodes, edges) is False


def test_self_loop_is_not_a_dag():
    nodes = make_nodes(["a"])
    edges = make_edges([("a", "a")])
    assert is_directed_acyclic_graph(nodes, edges) is False


def test_cycle_with_extra_disconnected_node_is_not_a_dag():
    nodes = make_nodes(["a", "b", "c", "isolated"])
    edges = make_edges([("a", "b"), ("b", "a")])
    assert is_directed_acyclic_graph(nodes, edges) is False


def test_edges_referencing_unknown_nodes_are_ignored():
    # An edge pointing at a node id that isn't in `nodes` shouldn't crash
    # or otherwise affect the result for the known nodes.
    nodes = make_nodes(["a", "b"])
    edges = make_edges([("a", "b"), ("b", "ghost")])
    assert is_directed_acyclic_graph(nodes, edges) is True

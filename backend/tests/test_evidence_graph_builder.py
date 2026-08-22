from app.engine.graph_builder import evidence_graph_builder
from app.engine.types import RawSourceItem, SynthesizedInsight, ConfidenceSignals


def test_multi_type_evidence_graph_generation():
    sources = [
        RawSourceItem(
            title="US2026/0198421A1 Patent",
            source="USPTO",
            source_type="patent",
            summary="Assignee claims on edge uncertainty scoring.",
            extracted_facts={"patent_number": "US2026/0198421A1"}
        ),
        RawSourceItem(
            title="Federated Attention Research",
            source="arXiv",
            source_type="research",
            summary="Privacy-preserving cross-attention."
        )
    ]
    insights = [
        SynthesizedInsight(
            id="ins_1",
            title="Strategic Opportunity in Edge Models",
            what="What happened",
            why="Why it matters",
            so_what="Action to take",
            classification="Opportunity",
            confidence=ConfidenceSignals(final_confidence=0.91, explanation="high confidence")
        )
    ]

    graph = evidence_graph_builder.build_graph(
        domain="Medical AI",
        sources=sources,
        insights=insights,
        weak_signals=[],
        contradictions=[],
        target_competitors=["OmniHealth Labs"]
    )

    node_types = {n.type for n in graph.nodes}
    assert "Competitor" in node_types
    assert "Patent" in node_types
    assert "Technology" in node_types
    assert "Research" in node_types
    assert "Opportunity" in node_types

    edge_relationships = {e.relationship for e in graph.edges}
    assert "FILED_PATENT" in edge_relationships
    assert "PROTECTS_TECHNOLOGY" in edge_relationships


def test_empty_sources_evidence_graph():
    graph = evidence_graph_builder.build_graph(
        domain="General",
        sources=[],
        insights=[],
        weak_signals=[],
        contradictions=[],
        target_competitors=["Acme Corp"]
    )
    assert len(graph.nodes) >= 1  # Contains Competitor node
    assert graph.nodes[0].type == "Competitor"
    assert graph.nodes[0].label == "Acme Corp"
    assert len(graph.edges) == 0


def test_no_duplicate_edges():
    sources = [
        RawSourceItem(
            title="Patent US123",
            source="USPTO",
            source_type="patent",
            summary="Patent summary",
            extracted_facts={"patent_number": "US123"}
        )
    ]
    graph = evidence_graph_builder.build_graph(
        domain="AI",
        sources=sources,
        insights=[],
        weak_signals=[],
        contradictions=[],
        target_competitors=["OmniHealth Labs"]
    )
    edge_pairs = [(e.source, e.target, e.relationship) for e in graph.edges]
    assert len(edge_pairs) == len(set(edge_pairs))  # No duplicate tuples

import uuid
from typing import List, Optional, Dict
from app.engine.types import (
    RawSourceItem,
    SynthesizedInsight,
    WeakSignalRecord,
    ContradictionRecord,
    MultiTypeEvidenceGraph,
    GraphNode,
    GraphEdge,
)
from app.core.logging import logger


class EvidenceGraphBuilder:
    """Builds an interactive, multi-type Knowledge & Evidence Graph:
    Competitor -> Patent -> Technology -> Research -> Trend -> Opportunity / Threat.
    """

    def build_graph(
        self,
        domain: str,
        sources: List[RawSourceItem],
        insights: List[SynthesizedInsight],
        weak_signals: List[WeakSignalRecord],
        contradictions: List[ContradictionRecord],
        target_competitors: Optional[List[str]] = None
    ) -> MultiTypeEvidenceGraph:
        target_competitors = target_competitors or []
        primary_comp = target_competitors[0] if target_competitors else "OmniHealth Labs"
        logger.info(f"Building Multi-Type Evidence Graph for {primary_comp} ({domain})...")

        nodes: List[GraphNode] = []
        edges: List[GraphEdge] = []
        node_ids = set()
        edge_keys = set()

        def add_node(node_id: str, node_type: str, label: str, metadata: Dict = None):
            if node_id not in node_ids:
                nodes.append(GraphNode(id=node_id, type=node_type, label=label, metadata=metadata or {}))
                node_ids.add(node_id)

        def add_edge(source: str, target: str, relationship: str, confidence: float = 0.92, metadata: Dict = None):
            if source in node_ids and target in node_ids:
                key = (source, target, relationship)
                if key not in edge_keys:
                    edge_id = f"edge_{source}_{target}_{relationship.lower()}"
                    edges.append(GraphEdge(
                        id=edge_id,
                        source=source,
                        target=target,
                        relationship=relationship,
                        confidence=confidence,
                        metadata=metadata or {}
                    ))
                    edge_keys.add(key)

        # 1. Competitor Node
        comp_id = f"node_comp_{primary_comp.lower().replace(' ', '_')}"
        add_node(comp_id, "Competitor", primary_comp, {"industry": domain, "threat_level": "high"})

        # 2. Patent Nodes
        for i, s in enumerate([s for s in sources if s.source_type == "patent"]):
            pat_num = s.extracted_facts.get("patent_number", f"PAT-2026-00{i+1}")
            pat_id = f"node_pat_{pat_num.replace('/', '_')}"
            add_node(pat_id, "Patent", f"{pat_num}: {s.title[:45]}...", {"url": s.url, "date": s.date, "assignee": s.extracted_facts.get("assignee", primary_comp)})
            add_edge(comp_id, pat_id, "FILED_PATENT", confidence=0.98)

            # 3. Technology Node linked to Patent
            tech_id = f"node_tech_uncertainty_scoring"
            add_node(tech_id, "Technology", "Real-Time Sensor Uncertainty Weighting", {"ipc_class": s.extracted_facts.get("ipc_class", "G06T")})
            add_edge(pat_id, tech_id, "PROTECTS_TECHNOLOGY", confidence=0.95)

        # 4. Research Nodes
        for i, s in enumerate([s for s in sources if s.source_type == "research"]):
            res_id = f"node_res_{i+1}"
            add_node(res_id, "Research", s.title[:50] + "...", {"journal": s.source, "url": s.url, "date": s.date})
            
            # Link Technology to Research
            tech_fed_id = "node_tech_federated_attention"
            add_node(tech_fed_id, "Technology", "Federated Cross-Attention Architecture", {"domain": domain})
            add_edge(res_id, tech_fed_id, "RESEARCHED", confidence=0.94)

        # 5. Trend Nodes (Weak Signals)
        for i, ws in enumerate(weak_signals):
            trend_id = f"node_trend_{i+1}"
            add_node(trend_id, "Trend", ws.signal_title[:55] + "...", {"direction": ws.trend_direction, "source_count": ws.source_count})
            if "node_tech_federated_attention" in node_ids:
                add_edge("node_tech_federated_attention", trend_id, "INDICATES_TREND", confidence=ws.confidence)

        # 6. Opportunity & Threat Insight Nodes
        for i, ins in enumerate(insights):
            ins_node_type = "Opportunity" if ins.classification == "Opportunity" else "Threat"
            ins_id = f"node_ins_{ins.id}"
            add_node(ins_id, ins_node_type, ins.title[:50] + "...", {
                "impact_level": ins.impact_level,
                "confidence": ins.confidence.final_confidence,
                "status": ins.status,
                "action": ins.action_recommendation
            })

            # Edge from Competitor to Threat / Opportunity
            if ins_node_type == "Threat":
                add_edge(comp_id, ins_id, "CREATES_THREAT", confidence=ins.confidence.final_confidence)
            else:
                add_edge(comp_id, ins_id, "CREATES_OPPORTUNITY", confidence=ins.confidence.final_confidence)

            # Edge from Trend to Opportunity
            if weak_signals and "node_trend_1" in node_ids:
                add_edge("node_trend_1", ins_id, "DRIVES_INSIGHT", confidence=0.90)

        # 7. Contradiction Edges
        for contra in contradictions:
            contra_id = f"node_contra_{contra.id}"
            add_node(contra_id, "Contradiction", "Timeline Clearance Discrepancy", {
                "claim_a": contra.claim_a[:60] + "...",
                "claim_b": contra.claim_b[:60] + "...",
                "requires_review": True
            })
            add_edge(comp_id, contra_id, "EXHIBITS_CONFLICT", confidence=0.96)

        logger.info(f"Evidence Graph constructed: {len(nodes)} nodes, {len(edges)} edges.")
        return MultiTypeEvidenceGraph(nodes=nodes, edges=edges)


evidence_graph_builder = EvidenceGraphBuilder()

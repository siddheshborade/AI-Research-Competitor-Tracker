from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.evidence import Evidence, EvidenceRelationship
from app.models.insight import Insight
from app.models.competitor import Competitor
from app.core.exceptions import EntityNotFoundException


class EvidenceService:
    @staticmethod
    def get_all_evidence(db: Session, run_id: Optional[str] = None, limit: int = 50) -> List[Evidence]:
        stmt = select(Evidence)
        if run_id:
            stmt = stmt.where(Evidence.run_id == run_id)
        stmt = stmt.limit(limit)
        return list(db.execute(stmt).scalars().all())

    @staticmethod
    def get_evidence_by_id(db: Session, evidence_id: str) -> Evidence:
        stmt = select(Evidence).where(Evidence.id == evidence_id)
        evidence = db.execute(stmt).scalars().first()
        if not evidence:
            raise EntityNotFoundException("Evidence", evidence_id)
        return evidence

    @staticmethod
    def get_evidence_graph(db: Session, run_id: Optional[str] = None, objective_id: Optional[str] = None) -> dict:
        stmt = select(Evidence)
        if run_id:
            stmt = stmt.where(Evidence.run_id == run_id)
        elif objective_id:
            stmt = stmt.where(Evidence.objective_id == objective_id)

        evidence_items = list(db.execute(stmt).scalars().all())
        evidence_ids = {e.id for e in evidence_items}

        # Query relationships
        edge_stmt = select(EvidenceRelationship).where(
            EvidenceRelationship.source_evidence_id.in_(evidence_ids),
            EvidenceRelationship.target_evidence_id.in_(evidence_ids)
        )
        edges = list(db.execute(edge_stmt).scalars().all()) if evidence_ids else []

        nodes: List[Dict[str, Any]] = [
            {
                "id": e.id,
                "label": e.content[:60] + "..." if len(e.content) > 60 else e.content,
                "type": "Evidence",
                "is_contradiction": e.is_contradiction,
                "is_weak_signal": e.is_weak_signal,
                "confidence_score": e.confidence_score,
                "source_type": e.source.source_type if e.source else None,
                "metadata": {"tags": e.tags, "facts": e.extracted_facts}
            }
            for e in evidence_items
        ]

        formatted_edges: List[Dict[str, Any]] = [
            {
                "id": edge.id,
                "source": edge.source_evidence_id,
                "target": edge.target_evidence_id,
                "relationship_type": edge.relationship_type,
                "confidence": edge.confidence,
                "metadata": {"explanation": edge.explanation}
            }
            for edge in edges
        ]

        return {"nodes": nodes, "edges": formatted_edges}

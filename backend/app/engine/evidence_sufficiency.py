from typing import List, Dict, Any
from app.engine.tools.schemas import NormalizedEvidence
from app.engine.types import ContradictionRecord
from app.core.logging import logger


class EvidenceSufficiencyChecker:
    """Evaluates whether the gathered multi-source evidence is sufficient to address the user's objective."""

    def evaluate(
        self,
        objective: str,
        evidence: List[NormalizedEvidence],
        contradictions: List[ContradictionRecord]
    ) -> Dict[str, Any]:
        if not evidence:
            return {
                "is_sufficient": False,
                "sufficiency_score": 0.0,
                "status": "INSUFFICIENT",
                "missing_aspects": ["No evidence collected"],
                "explanation": "No external evidence has been gathered yet."
            }

        types_present = {e.source_type for e in evidence}
        total_items = len(evidence)
        missing_aspects = []

        # Check source diversity
        if "paper" not in types_present and ("threat" in objective.lower() or "research" in objective.lower() or "technology" in objective.lower()):
            missing_aspects.append("Scientific or technical research evidence")

        if "web" not in types_present and ("competitor" in objective.lower() or "market" in objective.lower() or "pricing" in objective.lower()):
            missing_aspects.append("Commercial market and press announcements")

        # Base score calculation
        score = 0.0
        score += min(total_items * 0.20, 0.50)  # Up to 0.50 for volume
        score += min(len(types_present) * 0.25, 0.50)  # Up to 0.50 for source diversity

        # Penalize for active unresolved contradictions
        if contradictions:
            score -= len(contradictions) * 0.15
            score = max(0.20, score)

        is_sufficient = score >= 0.65 and len(missing_aspects) == 0

        status = "SUFFICIENT" if is_sufficient else ("CONFLICTING" if contradictions else ("PARTIALLY_SUFFICIENT" if score >= 0.40 else "INSUFFICIENT"))

        explanation = f"Evidence sufficiency score is {score:.2f}/1.00 based on {total_items} items across {len(types_present)} source types."
        if contradictions:
            explanation += f" Active contradiction detected requiring verification."
        elif is_sufficient:
            explanation += " Sufficient multi-source evidence gathered to answer the objective."
        else:
            explanation += f" Missing: {', '.join(missing_aspects)}."

        logger.info(f"[EvidenceSufficiency] Result: {status} ({score:.2f}) -> {explanation}")
        return {
            "is_sufficient": is_sufficient,
            "sufficiency_score": round(score, 2),
            "status": status,
            "missing_aspects": missing_aspects,
            "explanation": explanation
        }


evidence_sufficiency_checker = EvidenceSufficiencyChecker()

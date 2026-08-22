from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc
from app.models.research import ResearchObjective, ResearchRun
from app.models.competitor import Competitor
from app.models.evidence import Evidence, EvidenceRelationship
from app.models.insight import Insight
from app.models.verification import VerificationRecord
from app.core.config import settings


class DashboardService:
    @staticmethod
    def get_summary(db: Session) -> dict:
        total_objectives = db.scalar(select(func.count(ResearchObjective.id))) or 0
        active_runs = db.scalar(
            select(func.count(ResearchRun.id)).where(ResearchRun.status.in_(["queued", "planning", "searching", "synthesizing"]))
        ) or 0
        completed_runs = db.scalar(
            select(func.count(ResearchRun.id)).where(ResearchRun.status == "completed")
        ) or 0
        total_competitors = db.scalar(select(func.count(Competitor.id))) or 0
        total_evidence = db.scalar(select(func.count(Evidence.id))) or 0
        evidence_edges = db.scalar(select(func.count(EvidenceRelationship.id))) or 0
        total_insights = db.scalar(select(func.count(Insight.id))) or 0
        pending_verifications_count = db.scalar(
            select(func.count(Insight.id)).where(Insight.status == "pending_review")
        ) or 0

        # Breakdown
        opps = db.scalar(select(func.count(Insight.id)).where(Insight.category == "opportunity")) or 0
        threats = db.scalar(select(func.count(Insight.id)).where(Insight.category == "threat")) or 0
        weak_signals = db.scalar(
            select(func.count(Evidence.id)).where(Evidence.is_weak_signal.is_(True))
        ) or 0
        contradictions = db.scalar(
            select(func.count(Evidence.id)).where(Evidence.is_contradiction.is_(True))
        ) or 0
        emerging_trends = db.scalar(select(func.count(Insight.id)).where(Insight.category == "trend")) or 0
        gaps = db.scalar(select(func.count(Insight.id)).where(Insight.category == "gap")) or 0

        # Recent insights
        recent_insights_stmt = select(Insight).order_by(desc(Insight.created_at)).limit(6)
        recent_insights = list(db.execute(recent_insights_stmt).scalars().all())

        # Top threats
        top_threats_stmt = select(Insight).where(Insight.category == "threat").order_by(desc(Insight.confidence_score)).limit(4)
        top_threats = list(db.execute(top_threats_stmt).scalars().all())

        # Top opportunities
        top_opps_stmt = select(Insight).where(Insight.category == "opportunity").order_by(desc(Insight.confidence_score)).limit(4)
        top_opps = list(db.execute(top_opps_stmt).scalars().all())

        # Pending verification insights (Human Gate queue)
        pending_stmt = select(Insight).where(Insight.status == "pending_review").order_by(desc(Insight.impact_level)).limit(4)
        pending_insights = list(db.execute(pending_stmt).scalars().all())

        # Tracked competitors
        competitors_stmt = select(Competitor).order_by(Competitor.name).limit(10)
        competitors = list(db.execute(competitors_stmt).scalars().all())

        return {
            "stats": {
                "total_objectives": total_objectives,
                "active_runs": active_runs,
                "completed_runs": completed_runs,
                "total_competitors_tracked": total_competitors,
                "total_evidence_nodes": total_evidence,
                "evidence_graph_edges": evidence_edges,
                "total_insights": total_insights,
                "pending_verifications_count": pending_verifications_count
            },
            "breakdown": {
                "opportunities": opps,
                "threats": threats,
                "weak_signals": weak_signals,
                "contradictions": contradictions,
                "emerging_trends": emerging_trends,
                "gaps": gaps
            },
            "recent_insights": recent_insights,
            "top_threats": top_threats,
            "top_opportunities": top_opps,
            "pending_verification_insights": pending_insights,
            "tracked_competitors": competitors,
            "meta": {
                "engine": "AGENTX24 ReAct Intelligence Core",
                "framework": "WHAT -> WHY -> SO WHAT",
                "trust_layer": "Multi-Source Verification & Human Gate",
                "environment": settings.APP_ENV,
                "demo_mode": settings.APP_ENV == "development" or not settings.LLM_API_KEY
            }
        }

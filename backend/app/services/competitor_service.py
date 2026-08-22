from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.competitor import Competitor
from app.models.insight import Insight
from app.core.exceptions import EntityNotFoundException


class CompetitorService:
    @staticmethod
    def get_competitors(db: Session) -> List[Competitor]:
        stmt = select(Competitor).order_by(Competitor.name)
        return list(db.execute(stmt).scalars().all())

    @staticmethod
    def get_competitor_by_id(db: Session, competitor_id: str) -> Competitor:
        stmt = select(Competitor).where(Competitor.id == competitor_id)
        comp = db.execute(stmt).scalars().first()
        if not comp:
            raise EntityNotFoundException("Competitor", competitor_id)
        return comp

    @staticmethod
    def get_competitor_detail(db: Session, competitor_id: str) -> dict:
        comp = CompetitorService.get_competitor_by_id(db, competitor_id)
        
        # Query insights related to competitor
        threat_stmt = select(Insight.title).where(
            Insight.competitor_id == competitor_id,
            Insight.category == "threat"
        ).limit(5)
        top_threats = list(db.execute(threat_stmt).scalars().all())

        opp_stmt = select(Insight.title).where(
            Insight.competitor_id == competitor_id,
            Insight.category == "opportunity"
        ).limit(5)
        top_opportunities = list(db.execute(opp_stmt).scalars().all())

        return {
            "id": comp.id,
            "name": comp.name,
            "domain": comp.domain,
            "ticker": comp.ticker,
            "industry": comp.industry,
            "description": comp.description,
            "threat_level": comp.threat_level,
            "market_cap": comp.market_cap,
            "headquarters": comp.headquarters,
            "key_products": comp.key_products,
            "metadata_json": comp.metadata_json,
            "created_at": comp.created_at,
            "updated_at": comp.updated_at,
            "insights_count": len(comp.insights) if comp.insights else 0,
            "top_threats": top_threats,
            "top_opportunities": top_opportunities
        }

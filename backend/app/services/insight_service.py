from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from app.models.insight import Insight
from app.core.exceptions import EntityNotFoundException


class InsightService:
    @staticmethod
    def get_insights(
        db: Session,
        objective_id: Optional[str] = None,
        run_id: Optional[str] = None,
        competitor_id: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Insight]:
        query = select(Insight).order_by(desc(Insight.created_at))

        if objective_id:
            query = query.where(Insight.objective_id == objective_id)
        if run_id:
            query = query.where(Insight.run_id == run_id)
        if competitor_id:
            query = query.where(Insight.competitor_id == competitor_id)
        if category:
            query = query.where(Insight.category == category)
        if status:
            query = query.where(Insight.status == status)

        query = query.offset(offset).limit(limit)
        return list(db.execute(query).scalars().all())

    @staticmethod
    def get_insight_by_id(db: Session, insight_id: str) -> Insight:
        stmt = select(Insight).where(Insight.id == insight_id)
        insight = db.execute(stmt).scalars().first()
        if not insight:
            raise EntityNotFoundException("Insight", insight_id)
        return insight

import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from app.models.research import ResearchObjective, ResearchRun
from app.models.source import Source
from app.models.evidence import Evidence
from app.models.insight import Insight
from app.models.competitor import Competitor
from app.schemas.research import ResearchCreate
from app.core.exceptions import EntityNotFoundException
from app.engine.orchestrator import agent_orchestrator


class ResearchService:
    @staticmethod
    def create_research(
        db: Session,
        data: ResearchCreate,
        auto_execute: bool = True
    ) -> tuple[ResearchObjective, ResearchRun]:
        # 1. Create the objective
        objective = ResearchObjective(
            title=data.title,
            description=data.description,
            domain=data.domain,
            target_competitors=data.target_competitors,
            user_id=data.user_id,
            status="active"
        )
        db.add(objective)
        db.flush()

        # 2. Register target competitors
        for comp_name in data.target_competitors:
            existing = db.execute(select(Competitor).where(Competitor.name == comp_name)).scalars().first()
            if not existing:
                new_comp = Competitor(
                    name=comp_name,
                    industry=data.domain,
                    threat_level="medium"
                )
                db.add(new_comp)

        # 3. Create initial run
        run = ResearchRun(
            objective_id=objective.id,
            status="queued",
            depth=data.depth,
            current_step="Queued for autonomous intelligence pipeline",
            agent_plan={},
            step_history=[],
            metrics={}
        )
        db.add(run)
        db.commit()
        db.refresh(objective)
        db.refresh(run)

        # 4. Auto-execute core intelligence engine if requested
        if auto_execute:
            agent_orchestrator.run_research_pipeline(
                db=db,
                objective_id=objective.id,
                run_id=run.id,
                depth=data.depth
            )
            db.refresh(objective)
            db.refresh(run)

        return objective, run

    @staticmethod
    def execute_research(db: Session, objective_id: str, depth: str = "standard") -> Dict[str, Any]:
        objective = ResearchService.get_objective(db, objective_id)
        latest_run = ResearchService.get_latest_run(db, objective_id)

        if not latest_run or latest_run.status == "completed":
            # Create a new run
            latest_run = ResearchRun(
                objective_id=objective.id,
                status="queued",
                depth=depth,
                current_step="Queued for execution",
                agent_plan={},
                step_history=[],
                metrics={}
            )
            db.add(latest_run)
            db.commit()
            db.refresh(latest_run)

        result = agent_orchestrator.run_research_pipeline(
            db=db,
            objective_id=objective.id,
            run_id=latest_run.id,
            depth=depth
        )
        return result

    @staticmethod
    def get_objective(db: Session, objective_id: str) -> ResearchObjective:
        stmt = select(ResearchObjective).where(ResearchObjective.id == objective_id)
        objective = db.execute(stmt).scalars().first()
        if not objective:
            raise EntityNotFoundException("ResearchObjective", objective_id)
        return objective

    @staticmethod
    def get_latest_run(db: Session, objective_id: str) -> Optional[ResearchRun]:
        stmt = (
            select(ResearchRun)
            .where(ResearchRun.objective_id == objective_id)
            .order_by(desc(ResearchRun.created_at))
        )
        return db.execute(stmt).scalars().first()

    @staticmethod
    def get_research_details(db: Session, objective_id: str) -> dict:
        objective = ResearchService.get_objective(db, objective_id)
        latest_run = ResearchService.get_latest_run(db, objective_id)

        sources_count = 0
        evidence_count = 0
        insights_count = len(objective.insights) if objective.insights else 0
        insights = objective.insights if objective.insights else []
        sources = []

        if latest_run:
            sources = latest_run.sources if latest_run.sources else []
            sources_count = len(sources)
            evidence_count = len(latest_run.evidence) if latest_run.evidence else 0

        return {
            "objective": objective,
            "latest_run": latest_run,
            "sources_scanned_count": sources_count,
            "evidence_count": evidence_count,
            "insights_count": insights_count,
            "insights": insights,
            "sources": sources
        }

    @staticmethod
    def get_execution_trace(db: Session, objective_id: str) -> List[Dict[str, Any]]:
        latest_run = ResearchService.get_latest_run(db, objective_id)
        if not latest_run:
            raise EntityNotFoundException("ResearchRun for Objective", objective_id)
        return latest_run.step_history or []

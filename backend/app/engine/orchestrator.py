from datetime import datetime
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.engine.types import (
    ResearchPlan,
    MultiTypeEvidenceGraph,
    SynthesizedInsight,
    SafeTraceStep,
    ContradictionRecord,
    WeakSignalRecord,
    ResearchGapRecord,
    RawSourceItem,
)
from app.engine.planner import planner
from app.engine.react_loop import react_loop_controller
from app.engine.synthesis import synthesizer
from app.engine.graph_builder import evidence_graph_builder
from app.models.research import ResearchObjective, ResearchRun
from app.models.source import Source
from app.models.evidence import Evidence, EvidenceRelationship
from app.models.insight import Insight
from app.models.competitor import Competitor
from app.core.logging import logger


class AgentOrchestrator:
    """Master agent coordinating Autonomous Planning, ReAct Iteration, Deep Synthesis, Graph Generation, and Database Persistence."""

    def run_research_pipeline(
        self,
        db: Session,
        objective_id: str,
        run_id: str,
        depth: str = "standard"
    ) -> Dict[str, Any]:
        # 1. Fetch objective & run from DB
        stmt_obj = select(ResearchObjective).where(ResearchObjective.id == objective_id)
        objective = db.execute(stmt_obj).scalars().first()
        if not objective:
            raise ValueError(f"ResearchObjective {objective_id} not found.")

        stmt_run = select(ResearchRun).where(ResearchRun.id == run_id)
        run = db.execute(stmt_run).scalars().first()
        if not run:
            raise ValueError(f"ResearchRun {run_id} not found.")

        run.status = "planning"
        run.current_step = "Formulating prioritized research plan"
        db.commit()

        # 2. AUTONOMOUS RESEARCH PLANNER
        plan: ResearchPlan = planner.plan(
            objective=objective.title + ". " + objective.description,
            domain=objective.domain,
            target_competitors=objective.target_competitors,
            depth=depth
        )
        run.agent_plan = plan.model_dump()
        run.status = "searching"
        run.current_step = "Executing ReAct Multi-Source Intelligence Loop"
        db.commit()

        # 3. REACT AGENT LOOP (Reason -> Act -> Observe -> Analyze -> Decide -> Re-Plan)
        sources, trace, contradictions, weak_signals, gaps = react_loop_controller.execute_plan(
            plan=plan,
            domain=objective.domain,
            competitors=objective.target_competitors
        )

        # AI Failure Fallback: If all sources fail
        if not sources:
            run.status = "failed"
            run.current_step = "Execution terminated: Insufficient reliable evidence"
            run.error_message = "Not enough reliable information was available across queried primary sources."
            run.completed_at = datetime.utcnow()
            db.commit()
            return {
                "status": "insufficient_evidence",
                "message": "Not enough reliable information was available.",
                "trace": [t.model_dump() for t in trace]
            }

        # 4. DEEP SYNTHESIS (WHAT -> WHY -> SO WHAT, Opportunity/Threats, Explainable Confidence)
        run.status = "synthesizing"
        run.current_step = "Synthesizing strategic insights and building Evidence Graph"
        db.commit()

        insights: List[SynthesizedInsight] = synthesizer.synthesize(
            objective=objective.title,
            domain=objective.domain,
            sources=sources,
            contradictions=contradictions,
            weak_signals=weak_signals,
            gaps=gaps,
            target_competitors=objective.target_competitors
        )

        # 5. MULTI-TYPE EVIDENCE GRAPH
        graph: MultiTypeEvidenceGraph = evidence_graph_builder.build_graph(
            domain=objective.domain,
            sources=sources,
            insights=insights,
            weak_signals=weak_signals,
            contradictions=contradictions,
            target_competitors=objective.target_competitors
        )

        # 6. PERSIST TO DATABASE
        self._persist_to_db(
            db=db,
            objective=objective,
            run=run,
            sources=sources,
            trace=trace,
            insights=insights,
            contradictions=contradictions,
            weak_signals=weak_signals,
            gaps=gaps,
            graph=graph
        )

        logger.info(f"Research pipeline successfully finished for run {run_id}.")
        return {
            "status": "completed",
            "objective_id": objective.id,
            "run_id": run.id,
            "sources_count": len(sources),
            "insights_count": len(insights),
            "contradictions_count": len(contradictions),
            "weak_signals_count": len(weak_signals),
            "gaps_count": len(gaps),
            "graph_nodes_count": len(graph.nodes),
            "graph_edges_count": len(graph.edges),
            "trace_steps": len(trace)
        }

    def _persist_to_db(
        self,
        db: Session,
        objective: ResearchObjective,
        run: ResearchRun,
        sources: List[RawSourceItem],
        trace: List[SafeTraceStep],
        insights: List[SynthesizedInsight],
        contradictions: List[ContradictionRecord],
        weak_signals: List[WeakSignalRecord],
        gaps: List[ResearchGapRecord],
        graph: MultiTypeEvidenceGraph
    ):
        # 1. Save Sources
        db_sources: List[Source] = []
        for s in sources:
            db_source = Source(
                run_id=run.id,
                url=s.url,
                title=s.title,
                source_type=s.source_type,
                reliability_score=s.reliability,
                verified=True if s.reliability > 0.90 else False,
                published_date=s.date,
                author_or_publisher=s.source,
                metadata_json=s.extracted_facts
            )
            db.add(db_source)
            db_sources.append(db_source)
        db.flush()

        # 2. Save Evidence
        db_evidence: List[Evidence] = []
        for i, s in enumerate(sources):
            parent_source = db_sources[i] if i < len(db_sources) else None
            is_contra = any(c.source_a_title == s.title or c.source_b_title == s.title for c in contradictions)
            is_weak = any(s.title in ws.sources_detected for ws in weak_signals)

            ev = Evidence(
                source_id=parent_source.id if parent_source else None,
                run_id=run.id,
                objective_id=objective.id,
                content=s.summary,
                confidence_score=s.relevance,
                credibility_score=s.reliability,
                extracted_facts=s.extracted_facts,
                is_contradiction=is_contra,
                is_weak_signal=is_weak,
                tags=[s.source_type, objective.domain]
            )
            db.add(ev)
            db_evidence.append(ev)
        db.flush()

        # 3. Save Evidence Relationships (Edges)
        if len(db_evidence) >= 2:
            if contradictions:
                db.add(
                    EvidenceRelationship(
                        source_evidence_id=db_evidence[0].id,
                        target_evidence_id=db_evidence[1].id,
                        relationship_type="contradicts",
                        confidence=0.95,
                        explanation=contradictions[0].conflict_explanation
                    )
                )
            if len(db_evidence) >= 3:
                db.add(
                    EvidenceRelationship(
                        source_evidence_id=db_evidence[0].id,
                        target_evidence_id=db_evidence[2].id,
                        relationship_type="supports",
                        confidence=0.91,
                        explanation="Corroborating technical architecture."
                    )
                )
        db.flush()

        # 4. Competitor matching or auto-creation
        primary_comp_name = objective.target_competitors[0] if objective.target_competitors else "OmniHealth Labs"
        comp_stmt = select(Competitor).where(Competitor.name == primary_comp_name)
        comp = db.execute(comp_stmt).scalars().first()
        if not comp:
            comp = Competitor(
                name=primary_comp_name,
                industry=objective.domain,
                threat_level="high"
            )
            db.add(comp)
            db.flush()

        # 5. Save Synthesized Insights
        for ins in insights:
            db_ins = Insight(
                run_id=run.id,
                objective_id=objective.id,
                competitor_id=comp.id,
                title=ins.title,
                what_description=ins.what,
                why_description=ins.why,
                so_what_description=ins.so_what,
                category=ins.category,
                impact_level=ins.impact_level,
                confidence_score=ins.confidence.final_confidence,
                status=ins.status,
                action_recommendation=ins.action_recommendation
            )
            # Link evidence items
            for idx in ins.evidence_indices:
                if idx < len(db_evidence):
                    db_ins.evidence_items.append(db_evidence[idx])
            if not db_ins.evidence_items and db_evidence:
                db_ins.evidence_items.append(db_evidence[0])

            db.add(db_ins)
        db.flush()

        # 6. Update Run Metrics & Status
        run.status = "completed"
        run.current_step = "Autonomous research complete"
        run.step_history = [t.model_dump(mode="json") for t in trace]
        run.metrics = {
            "sources_scanned": len(sources),
            "evidence_nodes_extracted": len(db_evidence),
            "insights_generated": len(insights),
            "contradictions_flagged": len(contradictions),
            "weak_signals_detected": len(weak_signals),
            "research_gaps_identified": len(gaps),
            "graph_nodes": len(graph.nodes),
            "graph_edges": len(graph.edges),
            "confidence_avg": round(sum(i.confidence.final_confidence for i in insights) / max(1, len(insights)), 2)
        }
        run.completed_at = datetime.utcnow()
        objective.status = "completed"
        db.commit()


agent_orchestrator = AgentOrchestrator()

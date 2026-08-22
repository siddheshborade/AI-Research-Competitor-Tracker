import uuid
from typing import List, Tuple
from app.engine.types import (
    ResearchPlan,
    ResearchTask,
    RawSourceItem,
    SafeTraceStep,
    ContradictionRecord,
    WeakSignalRecord,
    ResearchGapRecord,
)
from app.engine.tools.registry import tool_registry
from app.engine.contradiction_detector import contradiction_detector
from app.engine.weak_signal_detector import weak_signal_detector
from app.engine.gap_analyzer import gap_analyzer
from app.core.logging import logger

MAX_ITERATIONS = 5


class ReActLoopController:
    """Controls the iterative Reason -> Act -> Observe -> Analyze -> Decide -> Re-Plan loop."""

    def execute_plan(
        self,
        plan: ResearchPlan,
        domain: str = "General",
        competitors: List[str] = None
    ) -> Tuple[List[RawSourceItem], List[SafeTraceStep], List[ContradictionRecord], List[WeakSignalRecord], List[ResearchGapRecord]]:
        competitors = competitors or plan.target_competitors or []
        logger.info(f"Starting ReAct Agent Loop for objective: '{plan.objective}' (Max Iterations: {MAX_ITERATIONS})")

        collected_sources: List[RawSourceItem] = []
        execution_trace: List[SafeTraceStep] = []
        contradictions: List[ContradictionRecord] = []
        weak_signals: List[WeakSignalRecord] = []
        gaps: List[ResearchGapRecord] = []

        task_queue: List[ResearchTask] = list(plan.research_tasks)
        iteration = 0

        while task_queue and iteration < MAX_ITERATIONS:
            iteration += 1
            current_task = task_queue.pop(0)
            current_task.status = "in_progress"

            # 1. REASON & ACT (Via dynamic tool selection & execution)
            tool_name, rationale, items = tool_registry.execute_for_task(
                task=current_task,
                domain=domain,
                competitors=competitors
            )

            # 2. OBSERVE
            logger.info(f"[ReAct Step {iteration}/{MAX_ITERATIONS}] OBSERVE: Retrieved {len(items)} items from {tool_name}")
            collected_sources.extend(items)
            current_task.status = "completed"

            # 3. ANALYZE (Incremental contradiction & signal detection)
            step_contradictions = contradiction_detector.detect(collected_sources)
            if step_contradictions and not contradictions:
                contradictions = step_contradictions

            # 4. RE-PLAN TRIGGER: If high-severity contradiction detected during early iterations, inject an audit verification task
            if contradictions and iteration < MAX_ITERATIONS and not any("contradiction" in t.question.lower() or "regulatory" in t.question.lower() for t in task_queue):
                logger.info(f"[ReAct Step {iteration}] Dynamic Re-Planning: Injected supplementary verification task due to cross-source conflict.")
                task_queue.insert(
                    0,
                    ResearchTask(
                        id=f"task_replan_{uuid.uuid4().hex[:6]}",
                        question=f"Cross-examine regulatory filings and trade audit reports to verify timeline divergence for {competitors[0] if competitors else 'target competitor'}.",
                        source_types=["sec_filing", "company"],
                        priority="high",
                        stopping_condition="Direct statutory filing verification completed.",
                        reasoning="Discovered contradiction between PR claims and statutory SEC disclosures."
                    )
                )

            # Record Safe Structured Trace Step
            findings_summary = f"Gathered {len(items)} source item(s) on '{current_task.question[:45]}...'"
            if contradictions:
                findings_summary += f" [Flagged {len(contradictions)} active contradiction(s)]"

            trace_step = SafeTraceStep(
                step=iteration,
                action=f"Execute {tool_name}",
                purpose=current_task.question,
                tool_selected=tool_name,
                tool_rationale=rationale,
                result_count=len(items),
                key_findings_summary=findings_summary,
                status="completed" if items else "no_results"
            )
            execution_trace.append(trace_step)

        # Post-loop full intelligence analysis
        if collected_sources:
            contradictions = contradiction_detector.detect(collected_sources)
            weak_signals = weak_signal_detector.detect(collected_sources, domain=domain)
            gaps = gap_analyzer.analyze(collected_sources, domain=domain)

        logger.info(f"ReAct Loop completed in {iteration} steps. Total sources collected: {len(collected_sources)}")
        return collected_sources, execution_trace, contradictions, weak_signals, gaps


react_loop_controller = ReActLoopController()

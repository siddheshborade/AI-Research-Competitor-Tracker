import uuid
from typing import List
from app.engine.types import ResearchPlan, ResearchTask
from app.engine.llm_client import llm_client
from app.core.logging import logger


class ResearchPlanner:
    """Autonomous Research Planner that analyzes user inquiries and outputs structured, prioritized research tasks."""

    def plan(
        self,
        objective: str,
        domain: str = "General Technology",
        target_competitors: List[str] = None,
        depth: str = "standard"
    ) -> ResearchPlan:
        target_competitors = target_competitors or []
        logger.info(f"Generating autonomous research plan for objective: '{objective}' (Domain: {domain})")

        prompt = f"""
        Objective: {objective}
        Domain: {domain}
        Competitors: {', '.join(target_competitors) if target_competitors else 'None specified'}
        Depth: {depth}

        Formulate a structured research plan with 3-5 prioritized tasks.
        Assign appropriate source categories (research, patent, news, sec_filing, company) and explicit stopping conditions.
        """

        def fallback_planner() -> ResearchPlan:
            # Deterministic, high-quality domain decomposition
            tasks: List[ResearchTask] = []
            
            # Task 1: Academic & Fundamental Research Discovery
            tasks.append(
                ResearchTask(
                    id=f"task_{uuid.uuid4().hex[:8]}",
                    question=f"What are the most recent foundational research breakthroughs and algorithmic innovations in {domain} related to {objective}?",
                    source_types=["research"],
                    priority="high",
                    stopping_condition="At least 2 peer-reviewed or preprint papers identified with quantified benchmarks.",
                    reasoning="Academic literature uncovers state-of-the-art architectures and early technological disruptions."
                )
            )

            # Task 2: Intellectual Property & Patent Analysis
            tasks.append(
                ResearchTask(
                    id=f"task_{uuid.uuid4().hex[:8]}",
                    question=f"What patents and proprietary claims have been filed in {domain} by competitors ({', '.join(target_competitors) if target_competitors else 'key industry players'})?",
                    source_types=["patent"],
                    priority="high",
                    stopping_condition="At least 2 patent applications identified with assignee, priority dates, and claim scope.",
                    reasoning="Patent filings reveal active R&D moats and long-term commercialization intent before product launch."
                )
            )

            # Task 3: Competitor Announcements & Market News
            tasks.append(
                ResearchTask(
                    id=f"task_{uuid.uuid4().hex[:8]}",
                    question=f"What recent product launches, partnerships, pricing adjustments, or leadership changes have occurred in {domain}?",
                    source_types=["news", "company"],
                    priority="medium",
                    stopping_condition="Corroborated news releases and official company statements retrieved.",
                    reasoning="News and corporate announcements show commercial velocity and immediate market positioning."
                )
            )

            # Task 4: Financial Disclosures & SEC Filings (if deep depth or target competitors present)
            if depth in ["standard", "deep"] or target_competitors:
                tasks.append(
                    ResearchTask(
                        id=f"task_{uuid.uuid4().hex[:8]}",
                        question=f"What do regulatory filings (10-K, 10-Q) and earnings calls reveal about R&D spending and forward guidance in {domain}?",
                        source_types=["sec_filing"],
                        priority="medium",
                        stopping_condition="Financial disclosures on capital allocation and strategic risks verified.",
                        reasoning="Regulatory filings provide legally binding disclosures of R&D investments and risk factors."
                    )
                )

            # Task 5: Weak-Signal & Emerging Trend Synthesis
            if depth == "deep":
                tasks.append(
                    ResearchTask(
                        id=f"task_{uuid.uuid4().hex[:8]}",
                        question=f"Are there early hiring spikes, API deprecation signals, or niche developer chatter indicating weak signals in {domain}?",
                        source_types=["company", "news"],
                        priority="low",
                        stopping_condition="Identification of at least 2 non-obvious cross-source signals.",
                        reasoning="Weak-signal detection discovers emerging trends before they become mainstream knowledge."
                    )
                )

            return ResearchPlan(
                objective=objective,
                domain=domain,
                target_competitors=target_competitors,
                depth=depth,
                search_strategy="Multi-Source Dynamic ReAct Convergence",
                research_tasks=tasks,
                overall_stopping_condition="All high-priority tasks completed or maximum iteration limit reached.",
                estimated_iterations=min(len(tasks), 5)
            )

        plan = llm_client.generate_structured(
            prompt=prompt,
            response_model=ResearchPlan,
            fallback_factory=fallback_planner,
            system_prompt="You are the Autonomous Research Planner for an elite strategic intelligence engine."
        )

        return plan


planner = ResearchPlanner()

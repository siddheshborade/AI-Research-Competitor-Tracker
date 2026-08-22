import os
import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

# Configure test environment before importing app
os.environ["APP_ENV"] = "testing"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["ALLOWED_ORIGINS"] = '["http://localhost:3000","http://localhost:5173"]'

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.models import (
    Competitor,
    ResearchObjective,
    ResearchRun,
    Source,
    Evidence,
    EvidenceRelationship,
    Insight,
    VerificationRecord,
)

# In-memory SQLite Engine with StaticPool ensures all connections share the same memory database during a test
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(autouse=True)
def setup_test_db():
    """Create fresh tables before each test and drop them afterward."""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """Provides a database session for tests."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """FastAPI TestClient with overridden get_db dependency."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_data(db_session: Session):
    """Seed sample data supporting the complete hierarchy: User -> Objective -> Run -> Source -> Evidence -> Insight -> Verification."""
    # 1. Competitor
    competitor = Competitor(
        id="comp_test_acme",
        name="Acme Corp",
        domain="acme.example.com",
        ticker="ACME",
        industry="Enterprise Software",
        description="Market leader in enterprise intelligence",
        threat_level="high",
        key_products=["Acme AI", "Cloud Platform"]
    )
    db_session.add(competitor)
    db_session.flush()

    # 2. Objective
    objective = ResearchObjective(
        id="obj_test_100",
        title="Analyze Acme Corp Agent Expansion",
        description="Comprehensive intelligence on Acme Corp autonomous agents release.",
        domain="Enterprise Software",
        target_competitors=["Acme Corp"],
        status="active"
    )
    db_session.add(objective)
    db_session.flush()

    # 3. Run
    run = ResearchRun(
        id="run_test_200",
        objective_id=objective.id,
        status="synthesizing",
        depth="standard",
        current_step="Extracting evidence nodes",
        agent_plan={"phases": ["Discovery", "Synthesis"]},
        step_history=[{"step": 1, "action": "Initialized"}],
        metrics={"sources_scanned": 2, "evidence_nodes_extracted": 2}
    )
    db_session.add(run)
    db_session.flush()

    # 4. Source
    source = Source(
        id="src_test_300",
        run_id=run.id,
        title="Acme Press Release August 2026",
        url="https://acme.example.com/news/agent-launch",
        source_type="news",
        reliability_score=0.95,
        verified=True
    )
    db_session.add(source)
    db_session.flush()

    # 5. Evidence Node 1 & 2
    ev1 = Evidence(
        id="ev_test_401",
        source_id=source.id,
        run_id=run.id,
        objective_id=objective.id,
        content="Acme Corp announced general availability of Autonomous Sales Agent.",
        confidence_score=0.92,
        credibility_score=0.95,
        extracted_facts={"product": "Sales Agent", "status": "GA"},
        is_contradiction=False,
        is_weak_signal=False,
        tags=["product_launch", "sales"]
    )
    ev2 = Evidence(
        id="ev_test_402",
        source_id=source.id,
        run_id=run.id,
        objective_id=objective.id,
        content="Customer reviews cite 35% performance degradation on high-concurrency workloads.",
        confidence_score=0.88,
        credibility_score=0.90,
        extracted_facts={"issue": "concurrency degradation", "impact": "35%"},
        is_contradiction=True,
        is_weak_signal=True,
        tags=["performance", "customer_friction"]
    )
    db_session.add_all([ev1, ev2])
    db_session.flush()

    # 6. Evidence Graph Edge
    edge = EvidenceRelationship(
        id="edge_test_500",
        source_evidence_id=ev1.id,
        target_evidence_id=ev2.id,
        relationship_type="contradicts",
        confidence=0.89,
        explanation="Marketing claim contradicts reported real-world latency."
    )
    db_session.add(edge)
    db_session.flush()

    # 7. Insight (WHAT -> WHY -> SO WHAT)
    insight = Insight(
        id="ins_test_600",
        run_id=run.id,
        objective_id=objective.id,
        competitor_id=competitor.id,
        title="Acme Agent Launch Shows High-Concurrency Vulnerability",
        what_description="Acme launched Sales Agent but users report 35% slowdown at scale.",
        why_description="Architecture relies on unoptimized multi-turn LLM chains.",
        so_what_description="Significant opportunity to target mid-market accounts with our low-latency engine.",
        category="opportunity",
        impact_level="high",
        confidence_score=0.90,
        status="pending_review",
        action_recommendation="Launch targeted displacement campaign."
    )
    insight.evidence_items.append(ev1)
    insight.evidence_items.append(ev2)
    db_session.add(insight)
    db_session.flush()

    # 8. Verification Record
    ver = VerificationRecord(
        id="ver_test_700",
        insight_id=insight.id,
        reviewer_name="Jane Doe",
        reviewer_role="Senior Analyst",
        status="verified",
        notes="Validated against 10-Q disclosures.",
        confidence_adjustment=0.05
    )
    db_session.add(ver)
    db_session.commit()

    return {
        "competitor": competitor,
        "objective": objective,
        "run": run,
        "source": source,
        "ev1": ev1,
        "ev2": ev2,
        "edge": edge,
        "insight": insight,
        "verification": ver
    }

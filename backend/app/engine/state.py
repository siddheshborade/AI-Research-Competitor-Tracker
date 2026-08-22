from typing import TypedDict, List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field


class TaskItem(BaseModel):
    id: str
    question: str
    agent: str = "Research Agent"
    tool: str = "research_papers"
    priority: str = "medium"  # high, medium, low
    status: str = "pending"  # pending, in_progress, completed, failed
    dependencies: List[str] = Field(default_factory=list)
    reasoning: Optional[str] = None
    estimated_resource_cost: int = 1


class ResourceBudget(BaseModel):
    max_steps: int = 6
    max_tools: int = 6
    max_retries: int = 2
    used_steps: int = 0
    used_tools: int = 0
    used_retries: int = 0
    is_exhausted: bool = False


class AgentGraphState(TypedDict, total=False):
    """
    Task 5 Comprehensive Shared Agent State for LangGraph Orchestration.
    Serializable for MemorySaver / SQLite Checkpointing.
    """
    investigation_id: str
    user_goal: str
    domain: str
    target_competitors: List[str]
    user_id: Optional[str]
    
    # Hypothesis Engine
    hypothesis: str
    hypothesis_status: str  # UNRESOLVED, SUPPORTED, WEAK, REJECTED
    
    # Dynamic Planning & Decomposition
    plan: Dict[str, Any]
    tasks: List[Dict[str, Any]]
    pending_tasks: List[Dict[str, Any]]
    completed_tasks: List[Dict[str, Any]]
    active_tasks: List[Dict[str, Any]]
    failed_tasks: List[Dict[str, Any]]
    task_priorities: Dict[str, str]
    
    # Multi-Agent Outputs & Unified Evidence
    agent_results: Dict[str, Any]
    observations: List[Dict[str, Any]]
    evidence: List[Dict[str, Any]]
    sources: List[Dict[str, Any]]
    claims: List[Dict[str, Any]]
    
    # Conflict Resolution & Verification
    contradictions: List[Dict[str, Any]]
    verification_results: List[Dict[str, Any]]
    conflict_status: str  # NO_CONFLICTS, CONFLICTS_DETECTED, RESOLVED
    
    # Confidence & Uncertainty Calibration
    confidence: float
    uncertainty: str  # LOW, MEDIUM, HIGH, UNRESOLVED
    
    # Task 4 Memory Integration
    memory_context: Optional[Dict[str, Any]]
    
    # Tool Failure, Fallbacks & Resilience
    tool_history: List[Dict[str, Any]]
    tool_failures: List[Dict[str, Any]]
    fallback_attempts: List[Dict[str, Any]]
    retry_count: int
    
    # Resource Budget & Limits
    resource_budget: Dict[str, Any]
    
    # Loop & Deadlock Detection
    execution_steps: List[Dict[str, Any]]
    visited_tasks: List[str]
    visited_tools: List[str]
    loop_detected: bool
    
    # Checkpointing Information
    checkpoint_info: Dict[str, Any]
    
    # Self-Evaluation & Red-Team Adversarial Challenge
    self_evaluation: Dict[str, Any]
    red_team_results: Dict[str, Any]
    
    # Strategic Synthesis (WHAT -> WHY -> SO WHAT)
    answer: Dict[str, Any]
    final_intelligence: Dict[str, Any]
    what: str
    why: str
    so_what: str
    recommended_action: str
    changes_detected: Optional[str]
    comparison_metrics: List[Dict[str, Any]]
    trust_layer: Dict[str, Any]
    evidence_graph: Dict[str, Any]
    replanning_count: int
    
    # Execution Status & Chaos Mode
    status: str  # RUNNING, COMPLETED, FAILED, TERMINATED_EARLY
    is_chaos_mode: bool
    chaos_mode: bool

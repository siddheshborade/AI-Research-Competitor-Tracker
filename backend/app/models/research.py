import datetime
import uuid
from typing import List, Optional, Any
from sqlalchemy import String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class ResearchObjective(Base):
    __tablename__ = "research_objectives"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"obj_{uuid.uuid4().hex[:12]}")
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    domain: Mapped[str] = mapped_column(String(128), default="General", nullable=False)
    target_competitors: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)  # active, completed, archived
    
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False
    )

    user = relationship("User", back_populates="objectives")
    runs = relationship("ResearchRun", back_populates="objective", cascade="all, delete-orphan")
    insights = relationship("Insight", back_populates="objective", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="objective", cascade="all, delete-orphan")


class ResearchRun(Base):
    __tablename__ = "research_runs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"run_{uuid.uuid4().hex[:12]}")
    objective_id: Mapped[str] = mapped_column(String(36), ForeignKey("research_objectives.id"), nullable=False)
    status: Mapped[str] = mapped_column(
        String(32), default="queued", nullable=False
    )  # queued, planning, searching, synthesizing, completed, failed
    depth: Mapped[str] = mapped_column(String(32), default="standard", nullable=False)  # quick, standard, deep
    current_step: Mapped[str] = mapped_column(String(255), default="Initializing autonomous plan", nullable=False)
    agent_plan: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    step_history: Mapped[List[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    metrics: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    started_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    completed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False
    )

    objective = relationship("ResearchObjective", back_populates="runs")
    sources = relationship("Source", back_populates="run", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="run", cascade="all, delete-orphan")
    insights = relationship("Insight", back_populates="run", cascade="all, delete-orphan")

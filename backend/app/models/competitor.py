import datetime
import uuid
from typing import List, Optional, Any
from sqlalchemy import String, Text, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Competitor(Base):
    __tablename__ = "competitors"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"comp_{uuid.uuid4().hex[:12]}")
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    domain: Mapped[Optional[str]] = mapped_column(String(255), index=True, nullable=True)
    ticker: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    threat_level: Mapped[str] = mapped_column(String(32), default="medium", nullable=False)  # low, medium, high, critical
    market_cap: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    headquarters: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    key_products: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    metadata_json: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False
    )

    insights = relationship("Insight", back_populates="competitor")

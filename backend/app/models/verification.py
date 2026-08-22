import datetime
import uuid
from typing import Optional
from sqlalchemy import String, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class VerificationRecord(Base):
    __tablename__ = "verification_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"ver_{uuid.uuid4().hex[:12]}")
    insight_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("insights.id"), nullable=True)
    evidence_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("evidence.id"), nullable=True)
    
    reviewer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    reviewer_role: Mapped[str] = mapped_column(String(128), default="analyst", nullable=False)
    status: Mapped[str] = mapped_column(
        String(32), default="verified", nullable=False
    )  # verified, rejected, flag_for_review
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    confidence_adjustment: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    insight = relationship("Insight", back_populates="verifications")

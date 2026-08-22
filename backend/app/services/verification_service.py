from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.verification import VerificationRecord
from app.models.insight import Insight
from app.models.evidence import Evidence
from app.schemas.verification import VerificationCreate
from app.core.exceptions import EntityNotFoundException, InvalidRequestException


class VerificationService:
    @staticmethod
    def create_verification(db: Session, data: VerificationCreate) -> VerificationRecord:
        if not data.insight_id and not data.evidence_id:
            raise InvalidRequestException("Either 'insight_id' or 'evidence_id' must be provided for verification.")

        # If linked to an insight, verify existence and update insight
        insight = None
        if data.insight_id:
            stmt = select(Insight).where(Insight.id == data.insight_id)
            insight = db.execute(stmt).scalars().first()
            if not insight:
                raise EntityNotFoundException("Insight", data.insight_id)

        # If linked to evidence, verify existence
        if data.evidence_id:
            stmt = select(Evidence).where(Evidence.id == data.evidence_id)
            evidence = db.execute(stmt).scalars().first()
            if not evidence:
                raise EntityNotFoundException("Evidence", data.evidence_id)

        # Create verification record
        record = VerificationRecord(
            insight_id=data.insight_id,
            evidence_id=data.evidence_id,
            reviewer_name=data.reviewer_name,
            reviewer_role=data.reviewer_role,
            status=data.status,
            notes=data.notes,
            confidence_adjustment=data.confidence_adjustment
        )
        db.add(record)

        # Update insight if applicable
        if insight:
            if data.status == "verified":
                insight.status = "approved"
            elif data.status == "rejected":
                insight.status = "rejected"
            elif data.status == "flag_for_review":
                insight.status = "flagged"

            # Apply confidence adjustment
            if data.confidence_adjustment != 0.0:
                new_conf = insight.confidence_score + data.confidence_adjustment
                insight.confidence_score = max(0.0, min(1.0, round(new_conf, 3)))

        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def get_verification_by_id(db: Session, verification_id: str) -> VerificationRecord:
        stmt = select(VerificationRecord).where(VerificationRecord.id == verification_id)
        record = db.execute(stmt).scalars().first()
        if not record:
            raise EntityNotFoundException("VerificationRecord", verification_id)
        return record

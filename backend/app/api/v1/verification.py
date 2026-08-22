from fastapi import APIRouter, status
from sqlalchemy.orm import Session
from app.api.deps import DBDep
from app.schemas.common import StandardResponse
from app.schemas.verification import VerificationCreate, VerificationResponse
from app.services.verification_service import VerificationService

router = APIRouter(prefix="/verification", tags=["Verification Gate"])


@router.post(
    "",
    response_model=StandardResponse[VerificationResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Submit Human Verification Gate Decision",
    description="Allows a human analyst to verify, reject, or flag synthesized insights or evidence, adjusting confidence and audit records."
)
def create_verification(
    data: VerificationCreate,
    db: Session = DBDep
) -> StandardResponse[VerificationResponse]:
    record = VerificationService.create_verification(db, data)
    return StandardResponse(
        success=True,
        data=VerificationResponse.model_validate(record),
        message="Verification decision recorded and applied successfully."
    )


@router.get(
    "/{id}",
    response_model=StandardResponse[VerificationResponse],
    summary="Get Verification Record",
    description="Retrieves audit details and reviewer notes for a specific human verification decision."
)
def get_verification_by_id(
    id: str,
    db: Session = DBDep
) -> StandardResponse[VerificationResponse]:
    record = VerificationService.get_verification_by_id(db, id)
    return StandardResponse(
        success=True,
        data=VerificationResponse.model_validate(record)
    )

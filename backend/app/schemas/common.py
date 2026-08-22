from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None


class StandardResponse(BaseModel, Generic[T]):
    """Standard success API response envelope."""
    success: bool = True
    data: T
    message: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ErrorResponse(BaseModel):
    """Standard error API response envelope."""
    success: bool = False
    error: ErrorDetail


class PaginationMeta(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int

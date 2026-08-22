from typing import Any, Optional, Dict


class AppException(Exception):
    """Base application exception returning structured error format."""
    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_SERVER_ERROR",
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details


class EntityNotFoundException(AppException):
    def __init__(self, entity_name: str, entity_id: Any):
        super().__init__(
            message=f"{entity_name} with ID '{entity_id}' was not found.",
            code="NOT_FOUND",
            status_code=404,
            details={"entity": entity_name, "id": str(entity_id)},
        )


class InvalidRequestException(AppException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="INVALID_REQUEST",
            status_code=400,
            details=details,
        )


class DatabaseConnectionException(AppException):
    def __init__(self, message: str = "Database connection error"):
        super().__init__(
            message=message,
            code="DATABASE_ERROR",
            status_code=503,
            details=None,
        )


class VerificationConflictException(AppException):
    def __init__(self, message: str = "Verification record conflict"):
        super().__init__(
            message=message,
            code="VERIFICATION_CONFLICT",
            status_code=409,
            details=None,
        )

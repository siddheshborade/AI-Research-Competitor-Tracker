import re
from typing import Dict, Any, Type, Tuple, Optional
from pydantic import BaseModel, ValidationError
from app.core.logging import logger


class ToolValidationException(Exception):
    def __init__(self, message: str, code: str = "TOOL_INVALID_ARGUMENTS"):
        self.message = message
        self.code = code
        super().__init__(message)


class ToolValidator:
    """Validates raw tool arguments against strict Pydantic models before external execution."""

    DANGEROUS_PATTERNS = [
        r"__import__",
        r"eval\(",
        r"exec\(",
        r"subprocess",
        r"os\.system",
        r"<script",
        r";\s*rm\s+-rf",
        r";\s*DROP\s+TABLE",
    ]

    @classmethod
    def sanitize_string(cls, value: str) -> str:
        if not isinstance(value, str):
            return value
        for pattern in cls.DANGEROUS_PATTERNS:
            if re.search(pattern, value, re.IGNORECASE):
                logger.warning(f"Rejected malicious pattern '{pattern}' in tool arguments.")
                raise ToolValidationException(
                    f"Malicious or unauthorized token detected in tool arguments: {pattern}",
                    code="TOOL_SECURITY_REJECTION"
                )
        return value.strip()

    @classmethod
    def validate(cls, schema: Type[BaseModel], raw_args: Any) -> BaseModel:
        if not isinstance(raw_args, dict):
            raise ToolValidationException(
                f"Tool arguments must be a JSON dictionary/object, received: {type(raw_args).__name__}",
                code="TOOL_INVALID_FORMAT"
            )

        # Sanitize all string fields
        sanitized_args = {}
        for k, v in raw_args.items():
            if isinstance(v, str):
                sanitized_args[k] = cls.sanitize_string(v)
            elif isinstance(v, list):
                sanitized_args[k] = [cls.sanitize_string(item) if isinstance(item, str) else item for item in v]
            else:
                sanitized_args[k] = v

        try:
            validated_model = schema(**sanitized_args)
            return validated_model
        except ValidationError as ve:
            error_details = "; ".join([f"{err['loc']}: {err['msg']}" for err in ve.errors()])
            logger.warning(f"Tool argument schema validation failed: {error_details}")
            raise ToolValidationException(
                f"Tool input schema validation error: {error_details}",
                code="TOOL_INVALID_ARGUMENTS"
            )

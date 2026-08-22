import re
from pydantic import BaseModel, Field, field_validator
from typing import Optional

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3, description="User corporate email address")
    password: str = Field(..., min_length=4, description="User secret password")

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        if not EMAIL_REGEX.match(clean):
            raise ValueError("Invalid corporate email format.")
        return clean


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    workspace_name: str
    is_active: bool


class LoginResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user: UserResponse

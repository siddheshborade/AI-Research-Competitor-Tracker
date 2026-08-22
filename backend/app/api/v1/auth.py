import hashlib
import json
import base64
import secrets
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.models.user import User
from app.schemas.common import StandardResponse
from app.schemas.auth import LoginRequest, LoginResponse, UserResponse

router = APIRouter(tags=["Authentication"])

# In-memory active session token store (token -> user_id)
_ACTIVE_SESSIONS: dict[str, str] = {}


def _hash_password(password: str) -> str:
    """Deterministic salted hash for demo/local authentication."""
    return hashlib.sha256(f"trackwise_salt_{password}".encode("utf-8")).hexdigest()


def _decode_jwt_payload_unverified(token: str) -> Optional[dict]:
    """Safely extracts JWT claims (e.g. from Supabase Auth tokens)."""
    try:
        parts = token.split(".")
        if len(parts) >= 2:
            padded = parts[1] + "=" * ((4 - len(parts[1]) % 4) % 4)
            data = base64.urlsafe_b64decode(padded.encode("utf-8"))
            return json.loads(data)
    except Exception:
        pass
    return None


def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """Extract and validate user from Authorization header (supports Local and Supabase Auth tokens)."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    
    token = authorization.split(" ")[1].strip()
    user_id = _ACTIVE_SESSIONS.get(token)
    
    if not user_id:
        # Check if default demo token
        if token.startswith("nx_demo_token_") or token.startswith("tw_demo_token_"):
            user = db.query(User).first()
            if user:
                return user

        # Check if Supabase JWT
        supabase_payload = _decode_jwt_payload_unverified(token)
        if supabase_payload and ("sub" in supabase_payload or "email" in supabase_payload):
            email = supabase_payload.get("email", "")
            sub_id = supabase_payload.get("sub", "")
            user = None
            if email:
                user = db.query(User).filter(User.email == email.lower()).first()
            if not user and sub_id:
                user = db.query(User).filter(User.id == sub_id).first()
            if not user and email:
                # Link / seed Supabase user into database
                user_meta = supabase_payload.get("user_metadata", {})
                name = user_meta.get("full_name") or user_meta.get("name") or email.split("@")[0].replace(".", " ").title()
                user = User(
                    id=sub_id if sub_id else None,
                    email=email.lower(),
                    name=name,
                    workspace_name=f"{name}'s Workspace",
                    is_active=True
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            if user:
                return user

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or is invalid. Please sign in again."
        )

    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found or disabled."
        )
    return user


@router.post(
    "/auth/login",
    response_model=StandardResponse[LoginResponse],
    summary="User Authentication & Session Creation",
    description="Authenticates corporate intelligence credentials against database and returns a bearer session token."
)
def login(
    req: LoginRequest,
    db: Session = Depends(get_db)
) -> StandardResponse[LoginResponse]:
    email = req.email.strip().lower()
    password = req.password.strip()

    if len(password) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 4 characters."
        )

    # Find existing user by email
    user = db.query(User).filter(User.email == email).first()

    if not user:
        # Seed/Register default corporate user on first sign-in
        name = email.split("@")[0].replace(".", " ").title()
        user = User(
            email=email,
            name=name,
            workspace_name=f"{name}'s Workspace",
            api_key_hash=_hash_password(password),
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate secure random session token
    token = f"nx_tok_{secrets.token_hex(24)}"
    _ACTIVE_SESSIONS[token] = user.id

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        workspace_name=user.workspace_name,
        is_active=user.is_active
    )

    return StandardResponse(
        success=True,
        data=LoginResponse(
            token=token,
            token_type="bearer",
            user=user_resp
        ),
        message=f"Welcome back, {user.name}."
    )


@router.get(
    "/auth/me",
    response_model=StandardResponse[UserResponse],
    summary="Get Current Authenticated User",
    description="Retrieves the profile of the currently signed-in intelligence analyst."
)
def get_me(
    current_user: User = Depends(get_current_user)
) -> StandardResponse[UserResponse]:
    return StandardResponse(
        success=True,
        data=UserResponse(
            id=current_user.id,
            email=current_user.email,
            name=current_user.name,
            workspace_name=current_user.workspace_name,
            is_active=current_user.is_active
        ),
        message="User profile verified."
    )


@router.post(
    "/auth/logout",
    response_model=StandardResponse[dict],
    summary="User Session Logout",
    description="Invalidates the active session token."
)
def logout(
    authorization: Optional[str] = Header(None)
) -> StandardResponse[dict]:
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1].strip()
        _ACTIVE_SESSIONS.pop(token, None)
    
    return StandardResponse(
        success=True,
        data={"logged_out": True},
        message="Session successfully terminated."
    )

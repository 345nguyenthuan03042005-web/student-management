"""
API routes for authentication (fixed safe version).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...db.database import get_db
from ...schemas.student_schema import UserCreate, UserLogin, Token
from ...services.student_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


# =========================
# REGISTER (DISABLED)
# =========================
@router.post(
    "/register",
    status_code=status.HTTP_403_FORBIDDEN,
    include_in_schema=False,
)
async def register():
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Public registration is disabled. Contact admin."
    )


# =========================
# LOGIN (FIXED SAFE VERSION)
# =========================
@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    try:
        result = AuthService.login_user(db, login_data)

        # nếu service trả sai format
        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )

        token, error = result

        if error:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=error
            )

        return token

    except HTTPException:
        raise

    except Exception as e:
        # CHẶN 500 CRASH
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


# =========================
# REFRESH TOKEN (NOT USED)
# =========================
@router.post("/refresh", include_in_schema=False)
async def refresh_token():
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Refresh token not implemented."
    )

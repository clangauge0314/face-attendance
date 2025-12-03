from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.models import User, Organization, OrganizationMember
from core.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from schemas import LoginRequest, SignupRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.user_id == payload.userId).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="이미 사용 중인 아이디입니다."
        )

    user = User(
        organization_type=payload.organizationType,
        name=payload.name,
        user_id=payload.userId,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.flush()

    if payload.organizationId:
        organization = db.query(Organization).filter(Organization.id == payload.organizationId).first()
        if not organization:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="선택한 조직을 찾을 수 없습니다.",
            )
        
        existing_member = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == payload.organizationId,
            OrganizationMember.user_id == user.id,
        ).first()
        
        if not existing_member:
            member = OrganizationMember(
                organization_id=payload.organizationId,
                user_id=user.id,
                role="member",
            )
            db.add(member)

    db.commit()
    db.refresh(user)
    return UserResponse(
        id=user.id,
        organizationType=user.organization_type,
        name=user.name,
        userId=user.user_id,
        role=user.role,
        createdAt=user.created_at,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == payload.userId).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 올바르지 않습니다.",
        )

    if user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 계정은 관리자 로그인 페이지를 통해 로그인해주세요.",
        )

    access_token = create_access_token({"sub": user.user_id})
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user.id,
            organizationType=user.organization_type,
            name=user.name,
            userId=user.user_id,
            role=user.role,
            createdAt=user.created_at,
        ),
    )


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        organizationType=current_user.organization_type,
        name=current_user.name,
        userId=current_user.user_id,
        role=current_user.role,
        createdAt=current_user.created_at,
    )

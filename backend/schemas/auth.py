from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class SignupRequest(BaseModel):
    organizationType: str = Field(..., min_length=2, max_length=50)
    organizationId: Optional[int] = Field(None, description="조직 ID (선택 시 해당 조직에 자동으로 멤버로 추가)")
    name: str = Field(..., min_length=1, max_length=100)
    userId: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=4, max_length=128)


class LoginRequest(BaseModel):
    userId: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=4, max_length=128)


class UserResponse(BaseModel):
    id: int
    organizationType: str
    name: str
    userId: str
    role: str
    createdAt: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse]


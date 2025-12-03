from datetime import datetime, time
from typing import Optional
from pydantic import BaseModel, Field


class OrganizationCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str = Field(..., min_length=1, max_length=20)


class OrganizationResponse(BaseModel):
    id: int
    name: str
    type: str
    adminId: int
    createdAt: datetime
    memberCount: Optional[int] = 0

    class Config:
        from_attributes = True


class OrganizationMemberAdd(BaseModel):
    userId: str = Field(..., min_length=1)


class OrganizationMemberResponse(BaseModel):
    id: int
    organizationId: int
    userId: int
    userName: str
    userUserId: str
    role: str
    joinedAt: datetime

    class Config:
        from_attributes = True


class AttendanceCheckRequest(BaseModel):
    organizationId: int
    image: str = Field(..., description="Base64 encoded image")


class AttendanceStatsResponse(BaseModel):
    totalMembers: int
    todayCount: int
    participationRate: float
    records: list


class OrganizationDetailResponse(BaseModel):
    id: int
    name: str
    type: str
    adminId: int
    createdAt: datetime
    members: list[OrganizationMemberResponse]

    class Config:
        from_attributes = True


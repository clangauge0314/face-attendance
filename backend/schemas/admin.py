from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class AdminLoginRequest(BaseModel):
    userId: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=4, max_length=128)
    image: Optional[str] = Field(None, description="Base64 encoded face image for verification")


class AdminLoginLogResponse(BaseModel):
    id: int
    userId: int
    loginTime: datetime
    ipAddress: Optional[str]
    userAgent: Optional[str]
    faceVerified: str
    similarity: Optional[str]
    status: str
    createdAt: datetime
    userName: Optional[str] = None
    userUserId: Optional[str] = None

    class Config:
        from_attributes = True


class AdminFacePreviewRequest(BaseModel):
    userId: str = Field(..., min_length=3, max_length=100)
    image: str = Field(..., description="Base64 encoded face image for preview verification")


class AdminFacePreviewResponse(BaseModel):
    similarity: float = Field(..., ge=0.0, le=1.0)
    verified: bool


class AdminFaceStatusResponse(BaseModel):
    hasFaceData: bool
    count: int = Field(..., ge=0)


class AdminDashboardStatsResponse(BaseModel):
    totalUsers: int
    todayEntries: int
    thisMonthEntries: int


class AdminUserResponse(BaseModel):
    id: int
    name: str
    userId: str
    organizationType: str
    role: str
    createdAt: datetime
    faceDataRegistered: bool

    class Config:
        from_attributes = True


class AdminAttendanceHistoryResponse(BaseModel):
    id: int
    userId: int
    userName: str
    userUserId: str
    organizationName: str | None
    checkInTime: datetime
    similarity: str | None
    createdAt: datetime

    class Config:
        from_attributes = True


class AdminAttendanceStatsItem(BaseModel):
    label: str
    count: int


class AdminAttendanceStatsResponse(BaseModel):
    daily: list[AdminAttendanceStatsItem]
    hourly: list[AdminAttendanceStatsItem]
    organizations: list[AdminAttendanceStatsItem]
    userRanking: list[AdminAttendanceStatsItem]
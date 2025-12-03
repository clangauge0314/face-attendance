from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AttendanceCheckInRequest(BaseModel):
    image: str = Field(..., description="Base64 encoded image")


class AttendanceResponse(BaseModel):
    id: int
    userId: int
    userName: str
    organizationType: str
    checkInTime: str
    similarity: Optional[float] = None
    status: str
    createdAt: str

    class Config:
        from_attributes = True


class AttendanceListResponse(BaseModel):
    total: int
    items: list[AttendanceResponse]


class AttendanceStatsItem(BaseModel):
    label: str
    count: int
    date: str
    firstCheckIn: float | None = None  # 시간 (0-24 실수형, 예: 9.5 = 09:30)


class AttendanceStatsResponse(BaseModel):
    period: str
    items: list[AttendanceStatsItem]


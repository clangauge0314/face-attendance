from typing import List, Optional
from pydantic import BaseModel, Field


class FaceRegisterRequest(BaseModel):
    image: str = Field(..., description="Base64 encoded image")


class FaceVerifyRequest(BaseModel):
    image: str = Field(..., description="Base64 encoded image")


class FaceDetectRequest(BaseModel):
    image: str = Field(..., description="Base64 encoded image")


class FaceDetectResponse(BaseModel):
    detected: bool
    x: Optional[int] = None
    y: Optional[int] = None
    w: Optional[int] = None
    h: Optional[int] = None


class FaceEmbeddingResponse(BaseModel):
    id: int
    userId: int
    imagePath: Optional[str]
    createdAt: str

    class Config:
        from_attributes = True


class FaceVerifyResponse(BaseModel):
    verified: bool
    similarity: float
    message: str


class FaceVerifyPreviewRequest(BaseModel):
    image: str = Field(..., description="Base64 encoded image")


class FaceVerifyPreviewResponse(BaseModel):
    detected: bool
    similarity: float
    verified: bool

import base64
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import numpy as np

from core.database import get_db
from core.models import User, FaceEmbedding
from core.security import get_current_user
from schemas.face import (
    FaceRegisterRequest,
    FaceVerifyRequest,
    FaceEmbeddingResponse,
    FaceVerifyResponse,
    FaceDetectRequest,
    FaceDetectResponse,
    FaceVerifyPreviewRequest,
    FaceVerifyPreviewResponse,
)
from services.face_recognition import (
    extract_face_embedding,
    verify_face,
    save_face_image,
    detect_face,
)

router = APIRouter(prefix="/face", tags=["face"])


@router.post("/detect", response_model=FaceDetectResponse)
def detect_face_endpoint(
    payload: FaceDetectRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        image_data = base64.b64decode(payload.image)
    except Exception:
        return FaceDetectResponse(detected=False)
    
    facial_area = detect_face(image_data)
    
    if facial_area:
        return FaceDetectResponse(
            detected=True,
            x=facial_area["x"],
            y=facial_area["y"],
            w=facial_area["w"],
            h=facial_area["h"]
        )
    else:
        return FaceDetectResponse(detected=False)


@router.post("/detect/public", response_model=FaceDetectResponse)
def detect_face_public_endpoint(payload: FaceDetectRequest):
    try:
        image_data = base64.b64decode(payload.image)
    except Exception:
        return FaceDetectResponse(detected=False)
    
    facial_area = detect_face(image_data)
    
    if facial_area:
        return FaceDetectResponse(
            detected=True,
            x=facial_area["x"],
            y=facial_area["y"],
            w=facial_area["w"],
            h=facial_area["h"]
        )
    else:
        return FaceDetectResponse(detected=False)



@router.post("/register", response_model=FaceEmbeddingResponse, status_code=status.HTTP_201_CREATED)
def register_face(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    image_data = file.file.read()
    
    embedding = extract_face_embedding(image_data)
    if embedding is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="얼굴을 감지할 수 없습니다. 다른 사진을 시도해주세요.",
        )
    
    image_path = save_face_image(current_user.id, image_data)
    
    face_embedding = FaceEmbedding(
        user_id=current_user.id,
        embedding=embedding.tolist(),
        image_path=image_path,
    )
    db.add(face_embedding)
    db.commit()
    db.refresh(face_embedding)
    
    return FaceEmbeddingResponse(
        id=face_embedding.id,
        userId=face_embedding.user_id,
        imagePath=face_embedding.image_path,
        createdAt=face_embedding.created_at.isoformat(),
    )


@router.post("/register-base64", response_model=FaceEmbeddingResponse, status_code=status.HTTP_201_CREATED)
def register_face_base64(
    payload: FaceRegisterRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        image_data = base64.b64decode(payload.image)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="잘못된 Base64 이미지 형식입니다.",
        )
    
    embedding = extract_face_embedding(image_data)
    if embedding is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="얼굴을 감지할 수 없습니다. 다른 사진을 시도해주세요.",
        )
    
    image_path = save_face_image(current_user.id, image_data)
    
    face_embedding = FaceEmbedding(
        user_id=current_user.id,
        embedding=embedding.tolist(),
        image_path=image_path,
    )
    db.add(face_embedding)
    db.commit()
    db.refresh(face_embedding)
    
    return FaceEmbeddingResponse(
        id=face_embedding.id,
        userId=face_embedding.user_id,
        imagePath=face_embedding.image_path,
        createdAt=face_embedding.created_at.isoformat(),
    )


@router.post("/verify", response_model=FaceVerifyResponse)
def verify_face_endpoint(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stored_embeddings = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == current_user.id
    ).all()
    
    if len(stored_embeddings) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="등록된 얼굴 데이터가 없습니다. 먼저 얼굴을 등록해주세요.",
        )
    
    image_data = file.file.read()
    embedding = extract_face_embedding(image_data)
    
    if embedding is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="얼굴을 감지할 수 없습니다. 다른 사진을 시도해주세요.",
        )
    
    stored_embeddings_list = [np.array(emb.embedding) for emb in stored_embeddings]
    verified, similarity = verify_face(embedding, stored_embeddings_list, threshold=0.70)
    
    return FaceVerifyResponse(
        verified=verified,
        similarity=float(similarity),
        message="인증 성공" if verified else "인증 실패",
    )


@router.post("/verify-base64", response_model=FaceVerifyResponse)
def verify_face_base64(
    payload: FaceVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stored_embeddings = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == current_user.id
    ).all()
    
    if len(stored_embeddings) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="등록된 얼굴 데이터가 없습니다. 먼저 얼굴을 등록해주세요.",
        )
    
    try:
        image_data = base64.b64decode(payload.image)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="잘못된 Base64 이미지 형식입니다.",
        )
    
    embedding = extract_face_embedding(image_data)
    
    if embedding is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="얼굴을 감지할 수 없습니다. 다른 사진을 시도해주세요.",
        )
    
    stored_embeddings_list = [np.array(emb.embedding) for emb in stored_embeddings]
    verified, similarity = verify_face(embedding, stored_embeddings_list, threshold=0.70)
    
    return FaceVerifyResponse(
        verified=verified,
        similarity=float(similarity),
        message="인증 성공" if verified else "인증 실패",
    )


@router.post("/verify-preview", response_model=FaceVerifyPreviewResponse)
def verify_face_preview(
    payload: FaceVerifyPreviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stored_embeddings = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == current_user.id
    ).all()
    
    if len(stored_embeddings) == 0:
        return FaceVerifyPreviewResponse(
            detected=False,
            similarity=0.0,
            verified=False
        )
    
    try:
        image_data = base64.b64decode(payload.image)
    except Exception:
        return FaceVerifyPreviewResponse(
            detected=False,
            similarity=0.0,
            verified=False
        )
    
    embedding = extract_face_embedding(image_data)
    
    if embedding is None:
        return FaceVerifyPreviewResponse(
            detected=False,
            similarity=0.0,
            verified=False
        )
    
    stored_embeddings_list = [np.array(emb.embedding) for emb in stored_embeddings]
    verified, similarity = verify_face(embedding, stored_embeddings_list, threshold=0.70)
    
    return FaceVerifyPreviewResponse(
        detected=True,
        similarity=float(similarity),
        verified=verified
    )


@router.get("/embeddings", response_model=list[FaceEmbeddingResponse])
def get_face_embeddings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    embeddings = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == current_user.id
    ).all()
    
    return [
        FaceEmbeddingResponse(
            id=emb.id,
            userId=emb.user_id,
            imagePath=emb.image_path,
            createdAt=emb.created_at.isoformat(),
        )
        for emb in embeddings
    ]


@router.delete("/embeddings/{embedding_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_face_embedding(
    embedding_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    embedding = db.query(FaceEmbedding).filter(
        FaceEmbedding.id == embedding_id,
        FaceEmbedding.user_id == current_user.id,
    ).first()
    
    if not embedding:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="얼굴 데이터를 찾을 수 없습니다.",
        )
    
    if embedding.image_path:
        try:
            import os
            if os.path.exists(embedding.image_path):
                os.remove(embedding.image_path)
        except Exception:
            pass
    
    db.delete(embedding)
    db.commit()
    
    return None

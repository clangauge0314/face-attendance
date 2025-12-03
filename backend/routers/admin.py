import base64
import os
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
import numpy as np

from core.database import get_db
from core.models import User, FaceEmbedding, AdminLoginLog, OrganizationMember, Attendance, Organization
from datetime import datetime, date, time, timezone, timedelta
from core.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from schemas import TokenResponse, UserResponse
from schemas.admin import (
    AdminLoginRequest,
    AdminLoginLogResponse,
    AdminFacePreviewRequest,
    AdminFacePreviewResponse,
    AdminDashboardStatsResponse,
    AdminUserResponse,
    AdminAttendanceHistoryResponse,
    AdminAttendanceStatsResponse,
    AdminAttendanceStatsItem,
)
from services.face_recognition import extract_face_embedding, verify_face

router = APIRouter(prefix="/admin", tags=["admin"])

def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 권한이 필요합니다.",
        )
    return current_user


@router.post("/login", response_model=TokenResponse)
def admin_login(
    payload: AdminLoginRequest,
    request: Request = None,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.user_id == payload.userId).first()
    if not user or not verify_password(payload.password, user.password_hash):
        if user:
            login_log = AdminLoginLog(
                user_id=user.id,
                ip_address=request.client.host if request else None,
                user_agent=request.headers.get("user-agent") if request else None,
                face_verified="false",
                status="failed",
            )
            db.add(login_log)
            db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 올바르지 않습니다.",
        )

    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 권한이 없습니다.",
        )

    face_verified = "false"
    similarity_value = None
    
    stored_embeddings = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == user.id
    ).all()
    
    if len(stored_embeddings) > 0:
        if not payload.image:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="얼굴 인식이 필요합니다. 얼굴 이미지를 제공해주세요.",
            )
        
        try:
            image_data = base64.b64decode(payload.image)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="잘못된 Base64 이미지 형식입니다.",
            )
        
        current_embedding = extract_face_embedding(image_data)
        
        if current_embedding is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="얼굴을 감지할 수 없습니다. 카메라를 정면으로 바라보세요.",
            )
        
        stored_embeddings_list = [np.array(emb.embedding) for emb in stored_embeddings]
        verified, similarity = verify_face(current_embedding, stored_embeddings_list, threshold=0.70)
        
        if not verified:
            login_log = AdminLoginLog(
                user_id=user.id,
                ip_address=request.client.host if request else None,
                user_agent=request.headers.get("user-agent") if request else None,
                face_verified="true",
                similarity=f"{similarity:.4f}",
                status="failed",
            )
            db.add(login_log)
            db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"얼굴 인증에 실패했습니다. 유사도: {similarity:.2%}",
            )
        
        face_verified = "true"
        similarity_value = f"{similarity:.4f}"
    else:
        pass

    login_log = AdminLoginLog(
        user_id=user.id,
        ip_address=request.client.host if request else None,
        user_agent=request.headers.get("user-agent") if request else None,
        face_verified=face_verified,
        similarity=similarity_value,
        status="success",
    )
    db.add(login_log)
    db.commit()

    access_token = create_access_token({"sub": user.user_id, "role": "admin"})
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


@router.post("/face-preview", response_model=AdminFacePreviewResponse)
def admin_face_preview(
    payload: AdminFacePreviewRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.user_id == payload.userId).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다.",
        )

    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 계정이 아닙니다.",
        )

    stored_embeddings = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == user.id
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

    current_embedding = extract_face_embedding(image_data)

    if current_embedding is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="얼굴을 감지할 수 없습니다. 카메라를 정면으로 바라보세요.",
        )

    stored_embeddings_list = [np.array(emb.embedding) for emb in stored_embeddings]
    verified, similarity = verify_face(current_embedding, stored_embeddings_list, threshold=0.70)

    return AdminFacePreviewResponse(
        similarity=float(similarity),
        verified=verified,
    )


@router.get("/me", response_model=UserResponse)
def admin_me(current_admin: User = Depends(get_current_admin)):
    return UserResponse(
        id=current_admin.id,
        organizationType=current_admin.organization_type,
        name=current_admin.name,
        userId=current_admin.user_id,
        role=current_admin.role,
        createdAt=current_admin.created_at,
    )


@router.get("/dashboard-stats", response_model=AdminDashboardStatsResponse)
def get_admin_dashboard_stats(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    from sqlalchemy import func, distinct
    
    total_users = db.query(func.count(distinct(OrganizationMember.user_id))).scalar() or 0
    
    kst = timezone(timedelta(hours=9))
    now = datetime.now(kst)
    today_start = datetime.combine(now.date(), time(0, 0, 0)).replace(tzinfo=kst)
    today_end = datetime.combine(now.date(), time(23, 59, 59, 999999)).replace(tzinfo=kst)
    first_day_of_month = datetime(now.year, now.month, 1, 0, 0, 0, tzinfo=kst)
    
    today_entries = db.query(func.count(Attendance.id)).filter(
        Attendance.check_in_time >= today_start,
        Attendance.check_in_time <= today_end
    ).scalar() or 0
    
    this_month_entries = db.query(func.count(Attendance.id)).filter(
        Attendance.check_in_time >= first_day_of_month
    ).scalar() or 0
    
    return AdminDashboardStatsResponse(
        totalUsers=total_users,
        todayEntries=today_entries,
        thisMonthEntries=this_month_entries,
    )


@router.get("/users", response_model=list[AdminUserResponse])
def get_admin_users(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    users = db.query(User).all()
    
    return [
        AdminUserResponse(
            id=user.id,
            name=user.name,
            userId=user.user_id,
            organizationType=user.organization_type,
            role=user.role,
            createdAt=user.created_at,
            faceDataRegistered=len(user.face_embeddings) > 0,
        )
        for user in users
    ]


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다.",
        )
    
    if user.role == "admin" and user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="자기 자신은 삭제할 수 없습니다.",
        )

    for embedding in user.face_embeddings:
        if embedding.image_path and os.path.exists(embedding.image_path):
            try:
                os.remove(embedding.image_path)
            except Exception:
                pass  
        
    db.delete(user)
    db.commit()
    return None


@router.delete("/users/{user_id}/face", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_face_data(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다.",
        )
    
    if not user.face_embeddings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="등록된 얼굴 데이터가 없습니다.",
        )

    for embedding in user.face_embeddings:
        if embedding.image_path and os.path.exists(embedding.image_path):
            try:
                os.remove(embedding.image_path)
            except Exception:
                pass
    
    db.query(FaceEmbedding).filter(FaceEmbedding.user_id == user.id).delete()
    db.commit()
    return None


@router.put("/users/{user_id}/password", status_code=status.HTTP_204_NO_CONTENT)
def reset_user_password(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다.",
        )
    
    user.password_hash = hash_password("1234")
    db.commit()
    return None


@router.get("/attendance-history", response_model=list[AdminAttendanceHistoryResponse])
def get_admin_attendance_history(
    current_admin: User = Depends(get_current_admin),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    start_date: date = Query(None),
    end_date: date = Query(None),
    query: str = Query(None),
    db: Session = Depends(get_db),
):
    query_obj = db.query(Attendance).join(Attendance.user).outerjoin(Attendance.organization)
    
    if start_date:
        kst = timezone(timedelta(hours=9))
        start_dt = datetime.combine(start_date, time(0, 0, 0)).replace(tzinfo=kst)
        query_obj = query_obj.filter(Attendance.check_in_time >= start_dt)
        
    if end_date:
        kst = timezone(timedelta(hours=9))
        end_dt = datetime.combine(end_date, time(23, 59, 59, 999999)).replace(tzinfo=kst)
        query_obj = query_obj.filter(Attendance.check_in_time <= end_dt)
        
    if query:
        search = f"%{query}%"
        query_obj = query_obj.filter(
            (User.name.ilike(search)) | 
            (User.user_id.ilike(search)) |
            (Organization.name.ilike(search))
        )
        
    records = (
        query_obj.order_by(Attendance.check_in_time.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )
    
    return [
        AdminAttendanceHistoryResponse(
            id=record.id,
            userId=record.user_id,
            userName=record.user.name,
            userUserId=record.user.user_id,
            organizationName=record.organization.name if record.organization else None,
            checkInTime=record.check_in_time,
            similarity=record.similarity,
            createdAt=record.created_at,
        )
        for record in records
    ]


@router.get("/attendance-stats", response_model=AdminAttendanceStatsResponse)
def get_admin_attendance_stats(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    from sqlalchemy import func, extract, desc, case
    
    kst = timezone(timedelta(hours=9))
    now = datetime.now(kst)
    seven_days_ago = now - timedelta(days=6)
    
    # 1. 일별 통계 (최근 7일)
    daily_stats = (
        db.query(
            func.date(Attendance.check_in_time).label("date"),
            func.count(Attendance.id).label("count")
        )
        .filter(Attendance.check_in_time >= seven_days_ago)
        .group_by(func.date(Attendance.check_in_time))
        .all()
    )
    
    hourly_stats = (
        db.query(
            extract('hour', Attendance.check_in_time).label("hour"),
            func.count(Attendance.id).label("count")
        )
        .group_by(extract('hour', Attendance.check_in_time))
        .all()
    )
    
    org_stats = (
        db.query(
            case(
                (Organization.name.isnot(None), Organization.name),
                else_="미지정"
            ).label("name"),
            func.count(Attendance.id).label("count")
        )
        .outerjoin(Attendance.organization)
        .group_by("name")
        .order_by(desc("count"))
        .all()
    )
    
    user_stats = (
        db.query(
            User.name,
            func.count(Attendance.id).label("count")
        )
        .join(Attendance.user)
        .group_by(User.id)
        .order_by(desc("count"))
        .limit(5)
        .all()
    )
    
    daily_items = []
    date_cursor = seven_days_ago.date()
    today = now.date()
    
    stats_map = {str(item.date): item.count for item in daily_stats}
    
    while date_cursor <= today:
        date_str = str(date_cursor)
        daily_items.append(
            AdminAttendanceStatsItem(
                label=date_cursor.strftime("%m/%d"),
                count=stats_map.get(date_str, 0)
            )
        )
        date_cursor += timedelta(days=1)
        
    hourly_items = []
    hourly_map = {int(item.hour): item.count for item in hourly_stats}
    
    for h in range(24):
        hourly_items.append(
            AdminAttendanceStatsItem(
                label=f"{h:02}:00",
                count=hourly_map.get(h, 0)
            )
        )
        
    org_items = [
        AdminAttendanceStatsItem(label=item.name, count=item.count) 
        for item in org_stats
    ]
    
    user_items = [
        AdminAttendanceStatsItem(label=item.name, count=item.count) 
        for item in user_stats
    ]
        
    return AdminAttendanceStatsResponse(
        daily=daily_items,
        hourly=hourly_items,
        organizations=org_items,
        userRanking=user_items,
    )


@router.get("/login-logs", response_model=list[AdminLoginLogResponse])
def get_admin_login_logs(
    current_admin: User = Depends(get_current_admin),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    logs = (
        db.query(AdminLoginLog)
        .filter(AdminLoginLog.user_id == current_admin.id)
        .order_by(AdminLoginLog.login_time.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )
    
    result = []
    for log in logs:
        result.append(
            AdminLoginLogResponse(
                id=log.id,
                userId=log.user_id,
                loginTime=log.login_time,
                ipAddress=log.ip_address,
                userAgent=log.user_agent,
                faceVerified=log.face_verified,
                similarity=log.similarity,
                status=log.status,
                createdAt=log.created_at,
                userName=current_admin.name,
                userUserId=current_admin.user_id,
            )
        )
    
    return result

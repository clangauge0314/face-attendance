from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta

from core.database import get_db
from core.models import User, Organization, OrganizationMember, Attendance
from core.security import get_current_user
from schemas.organization import (
    OrganizationCreate,
    OrganizationResponse,
    OrganizationMemberAdd,
    OrganizationMemberResponse,
    OrganizationDetailResponse,
    AttendanceStatsResponse,
)

router = APIRouter(prefix="/organizations", tags=["organizations"])
users_router = APIRouter(prefix="/users", tags=["users"])


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 권한이 필요합니다.",
        )
    return current_user


@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def create_organization(
    payload: OrganizationCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    organization = Organization(
        name=payload.name,
        type=payload.type,
        admin_id=current_admin.id,
    )
    db.add(organization)
    db.commit()
    db.refresh(organization)
    
    return OrganizationResponse(
        id=organization.id,
        name=organization.name,
        type=organization.type,
        adminId=organization.admin_id,
        createdAt=organization.created_at,
        memberCount=0,
    )


@router.get("", response_model=list[OrganizationResponse])
def list_organizations(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    organizations = db.query(Organization).filter(
        Organization.admin_id == current_admin.id
    ).all()
    
    return [
        OrganizationResponse(
            id=org.id,
            name=org.name,
            type=org.type,
            adminId=org.admin_id,
            createdAt=org.created_at,
            memberCount=len(org.members),
        )
        for org in organizations
    ]


@router.get("/public", response_model=list[OrganizationResponse])
def list_organizations_public(
    db: Session = Depends(get_db),
):
    organizations = db.query(Organization).all()
    
    return [
        OrganizationResponse(
            id=org.id,
            name=org.name,
            type=org.type,
            adminId=org.admin_id,
            createdAt=org.created_at,
            memberCount=len(org.members),
        )
        for org in organizations
    ]


@router.get("/{organization_id}", response_model=OrganizationDetailResponse)
def get_organization(
    organization_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    organization = db.query(Organization).filter(
        Organization.id == organization_id,
        Organization.admin_id == current_admin.id,
    ).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="조직을 찾을 수 없습니다.",
        )
    
    members = [
        OrganizationMemberResponse(
            id=member.id,
            organizationId=member.organization_id,
            userId=member.user_id,
            userName=member.user.name,
            userUserId=member.user.user_id,
            role=member.role,
            joinedAt=member.joined_at,
        )
        for member in organization.members
    ]
    
    return OrganizationDetailResponse(
        id=organization.id,
        name=organization.name,
        type=organization.type,
        adminId=organization.admin_id,
        createdAt=organization.created_at,
        members=members,
    )


@router.post("/{organization_id}/members", response_model=OrganizationMemberResponse, status_code=status.HTTP_201_CREATED)
def add_member(
    organization_id: int,
    payload: OrganizationMemberAdd,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    organization = db.query(Organization).filter(
        Organization.id == organization_id,
        Organization.admin_id == current_admin.id,
    ).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="조직을 찾을 수 없습니다.",
        )
    
    user = db.query(User).filter(User.user_id == payload.userId).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다.",
        )
    
    existing = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == user.id,
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 조직에 속한 사용자입니다.",
        )
    
    member = OrganizationMember(
        organization_id=organization_id,
        user_id=user.id,
        role="member",
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    
    return OrganizationMemberResponse(
        id=member.id,
        organizationId=member.organization_id,
        userId=member.user_id,
        userName=user.name,
        userUserId=user.user_id,
        role=member.role,
        joinedAt=member.joined_at,
    )


@router.delete("/{organization_id}/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_member(
    organization_id: int,
    member_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    organization = db.query(Organization).filter(
        Organization.id == organization_id,
        Organization.admin_id == current_admin.id,
    ).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="조직을 찾을 수 없습니다.",
        )
    
    member = db.query(OrganizationMember).filter(
        OrganizationMember.id == member_id,
        OrganizationMember.organization_id == organization_id,
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="멤버를 찾을 수 없습니다.",
        )
    
    db.delete(member)
    db.commit()
    return None


@router.get("/{organization_id}/attendance/today", response_model=AttendanceStatsResponse)
def get_today_attendance(
    organization_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    organization = db.query(Organization).filter(
        Organization.id == organization_id,
        Organization.admin_id == current_admin.id,
    ).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="조직을 찾을 수 없습니다.",
        )
    
    kst = timezone(timedelta(hours=9))
    today = datetime.now(kst).date()
    
    total_members = len(organization.members)
    
    today_records = db.query(Attendance).filter(
        Attendance.organization_id == organization_id,
        Attendance.check_in_time >= datetime.combine(today, datetime.min.time()).replace(tzinfo=kst),
        Attendance.check_in_time <= datetime.combine(today, datetime.max.time()).replace(tzinfo=kst),
    ).all()
    
    today_count = len(today_records)
    participation_rate = (today_count / total_members * 100) if total_members > 0 else 0
    
    records_data = [
        {
            "id": record.id,
            "userId": record.user_id,
            "userName": record.user.name,
            "checkInTime": record.check_in_time.isoformat(),
            "status": "checked_in",
        }
        for record in today_records
    ]
    
    return AttendanceStatsResponse(
        totalMembers=total_members,
        todayCount=today_count,
        participationRate=participation_rate,
        records=records_data,
    )


@users_router.get("/organizations", response_model=list[OrganizationResponse])
def get_user_organizations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    memberships = db.query(OrganizationMember).filter(
        OrganizationMember.user_id == current_user.id
    ).all()
    
    return [
        OrganizationResponse(
            id=membership.organization.id,
            name=membership.organization.name,
            type=membership.organization.type,
            adminId=membership.organization.admin_id,
            createdAt=membership.organization.created_at,
            memberCount=len(membership.organization.members),
        )
        for membership in memberships
    ]


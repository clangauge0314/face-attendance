from datetime import datetime, timezone, timedelta

from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, UniqueConstraint, Boolean
from sqlalchemy.orm import relationship

from core.database import Base


def kst_now():
    return datetime.now(timezone(timedelta(hours=9)))


class User(Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("user_id", name="uq_user_user_id"),)

    id = Column(Integer, primary_key=True, index=True)
    organization_type = Column(String(50), nullable=False)
    name = Column(String(100), nullable=False)
    user_id = Column(String(100), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user", nullable=False) 
    created_at = Column(DateTime, default=kst_now, nullable=False)
    
    face_embeddings = relationship("FaceEmbedding", back_populates="user", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="user", cascade="all, delete-orphan")
    admin_login_logs = relationship("AdminLoginLog", back_populates="user", cascade="all, delete-orphan")
    organization_memberships = relationship("OrganizationMember", back_populates="user", cascade="all, delete-orphan")
    owned_organizations = relationship("Organization", back_populates="admin", foreign_keys="Organization.admin_id")


class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    embedding = Column(JSON, nullable=False)  
    image_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=kst_now, nullable=False)
    
    user = relationship("User", back_populates="face_embeddings")


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(20), nullable=False)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=kst_now, nullable=False)
    
    admin = relationship("User", back_populates="owned_organizations", foreign_keys=[admin_id])
    members = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="organization")


class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(20), default="member", nullable=False)
    joined_at = Column(DateTime, default=kst_now, nullable=False)
    
    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="organization_memberships")


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True, index=True)
    
    check_in_time = Column(DateTime, default=kst_now, nullable=False, index=True)
    status = Column(String(20), default="checked_in", nullable=False)
    
    similarity = Column(String(20), nullable=True)
    note = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=kst_now, nullable=False)
    
    user = relationship("User", back_populates="attendances")
    organization = relationship("Organization", back_populates="attendance_records")


class AdminLoginLog(Base):
    __tablename__ = "admin_login_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    login_time = Column(DateTime, default=kst_now, nullable=False, index=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    face_verified = Column(String(10), default="false", nullable=False)  
    similarity = Column(String(20), nullable=True)
    status = Column(String(20), default="success", nullable=False) 
    created_at = Column(DateTime, default=kst_now, nullable=False)
    
    user = relationship("User", back_populates="admin_login_logs")
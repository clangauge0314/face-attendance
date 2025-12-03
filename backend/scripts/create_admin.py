import argparse
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from core.database import SessionLocal, engine
from core.models import Base, User
from core.security import hash_password


def main():
    parser = argparse.ArgumentParser(description="관리자 계정 생성 스크립트")
    parser.add_argument("--user-id", "-u", required=True, help="관리자 아이디")
    parser.add_argument("--password", "-p", required=True, help="비밀번호")
    parser.add_argument("--name", "-n", default="관리자", help="이름")
    parser.add_argument("--organization-type", "-o", default="기관", help="소속")

    args = parser.parse_args()

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.user_id == args.user_id).first()
        if existing_user:
            print(f"❌ 이미 존재하는 아이디입니다: {args.user_id}")
            sys.exit(1)

        admin_user = User(
            user_id=args.user_id,
            password_hash=hash_password(args.password),
            name=args.name,
            organization_type=args.organization_type,
            role="admin",
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print(f"✅ 관리자 계정이 생성되었습니다!")
        print(f"   아이디: {args.user_id}")
        print(f"   이름: {args.name}")
        print(f"   소속: {args.organization_type}")
        print(f"   역할: 관리자 (admin)")
    except Exception as e:
        db.rollback()
        print(f"❌ 관리자 계정 생성 실패: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()

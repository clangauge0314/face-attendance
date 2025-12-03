import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from sqlalchemy import text
from core.database import engine


def add_role_column():
    """users 테이블에 role 컬럼 추가"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(users)"))
            columns = [row[1] for row in result]
            
            if 'role' in columns:
                print("✅ role 컬럼이 이미 존재합니다.")
                return
            
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'
            """))
            conn.commit()
            
            conn.execute(text("""
                UPDATE users 
                SET role = 'user' 
                WHERE role IS NULL OR role = ''
            """))
            conn.commit()
            
            print("✅ role 컬럼이 성공적으로 추가되었습니다!")
            print("   기존 사용자들의 role은 'user'로 설정되었습니다.")
            
    except Exception as e:
        print(f"❌ 마이그레이션 실패: {e}")
        raise


if __name__ == "__main__":
    add_role_column()


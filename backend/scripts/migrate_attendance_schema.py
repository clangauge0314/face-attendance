import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from sqlalchemy import text, inspect
from core.database import engine


def migrate_attendance_table():
    """attendances 테이블에 새로운 컬럼들을 추가"""
    try:
        with engine.connect() as conn:
            inspector = inspect(engine)
            
            if 'attendances' not in inspector.get_table_names():
                print("❌ attendances 테이블이 존재하지 않습니다.")
                print("   main.py를 실행하면 자동으로 생성됩니다.")
                return
            
            result = conn.execute(text("PRAGMA table_info(attendances)"))
            existing_columns = {row[1]: row for row in result}
            
            columns_to_add = [
                {
                    'name': 'organization_id',
                    'type': 'INTEGER',
                    'nullable': True,
                    'default': None,
                    'foreign_key': 'organizations.id'
                },
                {
                    'name': 'record_type',
                    'type': 'VARCHAR(20)',
                    'nullable': False,
                    'default': "'entry'",
                    'foreign_key': None
                },
                {
                    'name': 'schedule_id',
                    'type': 'INTEGER',
                    'nullable': True,
                    'default': None,
                    'foreign_key': 'attendance_schedules.id'
                },
                {
                    'name': 'attendance_date',
                    'type': 'DATE',
                    'nullable': True,
                    'default': None,
                    'foreign_key': None
                },
                {
                    'name': 'late_minutes',
                    'type': 'INTEGER',
                    'nullable': True,
                    'default': None,
                    'foreign_key': None
                },
                {
                    'name': 'note',
                    'type': 'VARCHAR(500)',
                    'nullable': True,
                    'default': None,
                    'foreign_key': None
                }
            ]
            
            added_count = 0
            
            for col in columns_to_add:
                if col['name'] in existing_columns:
                    print(f"⏭️  {col['name']} 컬럼이 이미 존재합니다.")
                    continue
                
                alter_sql = f"ALTER TABLE attendances ADD COLUMN {col['name']} {col['type']}"
                
                if not col['nullable']:
                    alter_sql += " NOT NULL"
                
                if col['default'] is not None:
                    alter_sql += f" DEFAULT {col['default']}"
                
                conn.execute(text(alter_sql))
                conn.commit()
                
                print(f"✅ {col['name']} 컬럼이 추가되었습니다.")
                added_count += 1
            
            if added_count == 0:
                print("✅ 모든 컬럼이 이미 존재합니다.")
            else:
                print(f"\n✅ 총 {added_count}개의 컬럼이 추가되었습니다!")
                
                if 'status' in existing_columns:
                    result = conn.execute(text("SELECT COUNT(*) FROM attendances WHERE status = 'checked_in' AND record_type IS NULL"))
                    count = result.scalar()
                    if count > 0:
                        conn.execute(text("UPDATE attendances SET record_type = 'entry' WHERE record_type IS NULL"))
                        conn.commit()
                        print(f"✅ 기존 {count}개의 출입 기록에 record_type='entry'를 설정했습니다.")
            
    except Exception as e:
        print(f"❌ 마이그레이션 실패: {e}")
        import traceback
        traceback.print_exc()
        raise


if __name__ == "__main__":
    print("=" * 60)
    print("attendances 테이블 마이그레이션 시작...")
    print("=" * 60)
    migrate_attendance_table()
    print("=" * 60)
    print("마이그레이션 완료!")
    print("=" * 60)


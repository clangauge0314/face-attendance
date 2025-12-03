import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from core.config import BASE_DIR, ENCRYPTION_KEY
from services.encryption import encrypt_file

def migrate_images():
    upload_dir = BASE_DIR / "uploads" / "faces"
    
    if not upload_dir.exists():
        print(f"업로드 디렉토리가 없습니다: {upload_dir}")
        return
    
    if not ENCRYPTION_KEY:
        print("⚠️  ENCRYPTION_KEY가 설정되지 않았습니다.")
        print("먼저 .env 파일에 ENCRYPTION_KEY를 설정하세요.")
        print("키 생성: python scripts/generate_encryption_key.py")
        return
    
    jpg_files = list(upload_dir.glob("*.jpg"))
    
    if not jpg_files:
        print("마이그레이션할 .jpg 파일이 없습니다.")
        return
    
    print(f"총 {len(jpg_files)}개의 파일을 암호화합니다...")
    
    success_count = 0
    error_count = 0
    
    for jpg_file in jpg_files:
        try:
            enc_file = jpg_file.with_suffix('.enc')
            
            if enc_file.exists():
                print(f"⏭️  이미 암호화됨: {jpg_file.name}")
                continue
            
            encrypt_file(str(jpg_file), str(enc_file))
            
            print(f"✅ 암호화 완료: {jpg_file.name} -> {enc_file.name}")
            success_count += 1
        except Exception as e:
            print(f"❌ 오류 발생 ({jpg_file.name}): {e}")
            error_count += 1
    
    print("\n" + "=" * 60)
    print(f"마이그레이션 완료!")
    print(f"성공: {success_count}개")
    print(f"실패: {error_count}개")
    print("=" * 60)
    print("\n⚠️  원본 .jpg 파일은 그대로 남아있습니다.")
    print("   확인 후 수동으로 삭제하거나 스크립트의 주석을 해제하세요.")

if __name__ == "__main__":
    migrate_images()


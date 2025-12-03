from cryptography.fernet import Fernet

if __name__ == "__main__":
    key = Fernet.generate_key()
    print("=" * 60)
    print("암호화 키가 생성되었습니다:")
    print("=" * 60)
    print(key.decode())
    print("=" * 60)
    print("\n.env 파일에 다음을 추가하세요:")
    print(f"ENCRYPTION_KEY={key.decode()}")
    print("\n⚠️  이 키를 안전하게 보관하세요. 키를 잃어버리면 암호화된 파일을 복호화할 수 없습니다!")
    print("=" * 60)


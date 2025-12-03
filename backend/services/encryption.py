from cryptography.fernet import Fernet

from core.config import ENCRYPTION_KEY


def _get_fernet() -> Fernet:
    if not ENCRYPTION_KEY:
        raise ValueError("ENCRYPTION_KEY가 설정되지 않았습니다. .env 파일에 ENCRYPTION_KEY를 설정해주세요.")
    
    try:
        key = ENCRYPTION_KEY.encode() if isinstance(ENCRYPTION_KEY, str) else ENCRYPTION_KEY
        return Fernet(key)
    except Exception as e:
        raise ValueError(f"잘못된 ENCRYPTION_KEY 형식입니다. Fernet.generate_key()로 생성한 키를 사용하세요. 오류: {e}")


def encrypt_data(data: bytes) -> bytes:
    fernet = _get_fernet()
    return fernet.encrypt(data)


def decrypt_data(encrypted_data: bytes) -> bytes:
    fernet = _get_fernet()
    return fernet.decrypt(encrypted_data)


def encrypt_file(input_path: str, output_path: str) -> None:
    with open(input_path, "rb") as f:
        data = f.read()
    
    encrypted_data = encrypt_data(data)
    
    with open(output_path, "wb") as f:
        f.write(encrypted_data)


def decrypt_file(encrypted_path: str, output_path: str = None) -> bytes:

    with open(encrypted_path, "rb") as f:
        encrypted_data = f.read()
    
    decrypted_data = decrypt_data(encrypted_data)
    
    if output_path:
        with open(output_path, "wb") as f:
            f.write(decrypted_data)
    
    return decrypted_data


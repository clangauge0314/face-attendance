import os
import numpy as np
from datetime import datetime
from typing import List, Optional, Tuple
import cv2
from io import BytesIO
from PIL import Image

try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError:
    DEEPFACE_AVAILABLE = False

from core.config import BASE_DIR

MODEL_NAME = "ArcFace"

MODEL_BASE_DIR = os.path.join(BASE_DIR, "models", "deepface")
os.makedirs(MODEL_BASE_DIR, exist_ok=True)

os.environ["DEEPFACE_HOME"] = MODEL_BASE_DIR

_face_model_loaded = False


def ensure_deepface():
    if not DEEPFACE_AVAILABLE:
        raise RuntimeError("deepface is not installed. Please install it first.")


def extract_face_embedding(image_data: bytes) -> Optional[np.ndarray]:
    ensure_deepface()
    
    try:
        img = Image.open(BytesIO(image_data))
        img_array = np.array(img)
        
        if len(img_array.shape) == 2:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2RGB)
        elif img_array.shape[2] == 4:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)
        
        face_objs = DeepFace.extract_faces(
            img_path=img_array,
            detector_backend="ssd",
            enforce_detection=True,
            align=True,
            grayscale=False
        )
        
        if len(face_objs) == 0:
            return None
        
        face_img = face_objs[0]["face"]
        
        target_size = (112, 112)
        if face_img.shape[:2] != target_size:
            face_img = cv2.resize(face_img, target_size, interpolation=cv2.INTER_AREA)
        
        face_img_uint8 = (face_img * 255).astype(np.uint8)
        
        representations = DeepFace.represent(
            img_path=face_img_uint8,
            model_name=MODEL_NAME,
            enforce_detection=False,
            detector_backend="skip",
            align=False
        )
        
        if len(representations) == 0:
            return None
        
        embedding = np.array(representations[0]["embedding"], dtype=np.float32)
        
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
        
        return embedding
    except Exception:
        return None


def detect_face(image_data: bytes) -> Optional[dict]:
    ensure_deepface()
    
    try:
        img = Image.open(BytesIO(image_data))
        img_array = np.array(img)
        
        if len(img_array.shape) == 2:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2RGB)
        elif img_array.shape[2] == 4:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)
        
        face_objs = DeepFace.extract_faces(
            img_path=img_array,
            detector_backend="ssd",
            enforce_detection=True,
            align=True
        )
        
        if not face_objs:
            return None
            
        primary_face = face_objs[0]
        return primary_face["facial_area"]
        
    except Exception:
        return None


def calculate_similarity(embedding1: np.ndarray, embedding2: np.ndarray) -> float:
    try:
        dot_product = np.dot(embedding1, embedding2)
        norm1 = np.linalg.norm(embedding1)
        norm2 = np.linalg.norm(embedding2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        similarity = dot_product / (norm1 * norm2)
        return float(similarity)
    except Exception:
        return 0.0


def verify_face(embedding: np.ndarray, stored_embeddings: List[np.ndarray], threshold: float = 0.70) -> Tuple[bool, float]:
    if len(stored_embeddings) == 0:
        return False, 0.0
    
    max_similarity = 0.0
    for stored in stored_embeddings:
        similarity = calculate_similarity(embedding, np.array(stored))
        max_similarity = max(max_similarity, similarity)
    
    return max_similarity >= threshold, max_similarity


def verify_face_direct(image1_data: bytes, image2_data: bytes) -> Tuple[bool, float]:
    ensure_deepface()
    
    try:
        img1 = Image.open(BytesIO(image1_data))
        img1_array = np.array(img1)
        if len(img1_array.shape) == 2:
            img1_array = cv2.cvtColor(img1_array, cv2.COLOR_GRAY2RGB)
        elif img1_array.shape[2] == 4:
            img1_array = cv2.cvtColor(img1_array, cv2.COLOR_RGBA2RGB)
        
        img2 = Image.open(BytesIO(image2_data))
        img2_array = np.array(img2)
        if len(img2_array.shape) == 2:
            img2_array = cv2.cvtColor(img2_array, cv2.COLOR_GRAY2RGB)
        elif img2_array.shape[2] == 4:
            img2_array = cv2.cvtColor(img2_array, cv2.COLOR_RGBA2RGB)
        
        result = DeepFace.verify(
            img1_path=img1_array,
            img2_path=img2_array,
            model_name=MODEL_NAME,
            enforce_detection=True,
            detector_backend="ssd",
            distance_metric="cosine"
        )
        
        verified = result["verified"]
        distance = result.get("distance", 1.0)
        similarity = 1.0 - distance
        
        return verified, float(similarity)
    except Exception as e:
        print(f"Error verifying face: {e}")
        return False, 0.0


def save_face_image(user_id: int, image_data: bytes) -> str:
    from services.encryption import encrypt_data
    
    upload_dir = os.path.join(BASE_DIR, "uploads", "faces")
    os.makedirs(upload_dir, exist_ok=True)
    
    filename = f"user_{user_id}_{int(datetime.now().timestamp())}.enc"
    filepath = os.path.join(upload_dir, filename)
    
    encrypted_data = encrypt_data(image_data)
    
    with open(filepath, "wb") as f:
        f.write(encrypted_data)
    
    return filepath


def load_face_image(filepath: str) -> bytes:
    from services.encryption import decrypt_file
    
    return decrypt_file(filepath)

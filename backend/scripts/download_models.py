import os
import numpy as np
from PIL import Image
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models" / "deepface"

os.makedirs(MODEL_DIR, exist_ok=True)
os.environ["DEEPFACE_HOME"] = str(MODEL_DIR)

try:
    from deepface import DeepFace
    
    print("Downloading ArcFace model...")
    print(f"Model will be saved to: {MODEL_DIR}")
    
    dummy_img = np.zeros((224, 224, 3), dtype=np.uint8)
    img_pil = Image.fromarray(dummy_img)
    
    DeepFace.represent(
        img_path=np.array(img_pil),
        model_name="ArcFace",
        enforce_detection=False
    )
    
    print("Model downloaded successfully!")
    print(f"Model files are located at: {MODEL_DIR}")
    print("\nYou can now copy this 'models' directory to your offline deployment.")
    
except ImportError:
    print("Error: deepface is not installed.")
    print("Please install it first: pip install deepface")
except Exception as e:
    print(f"Error downloading model: {e}")


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from core.config import API_TITLE, API_VERSION, CORS_ORIGINS
from core.database import Base, engine
from routers import admin as admin_router
from routers import auth as auth_router
from routers import face as face_router
from routers import attendance as attendance_router
from routers import organization as organization_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title=API_TITLE, version=API_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(face_router.router)
app.include_router(attendance_router.router)
app.include_router(admin_router.router)
app.include_router(organization_router.router)
app.include_router(organization_router.users_router)

@app.get("/")
async def root():
    return {"message": "Face Attendance API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
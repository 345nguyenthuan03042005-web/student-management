from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .db.base import Base
from .db.database import engine

# =========================
# APP INIT
# =========================
app = FastAPI(
    title=settings.APP_NAME,
    description="Student Management System API",
    version="1.0.0",
    debug=settings.DEBUG
)

# =========================
# CREATE TABLES
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://student-mnm.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# IMPORT ROUTERS (DIRECT - SAFE)
# =========================
from .api.routes.auth import router as auth_router
from .api.routes.student import router as student_router
from .api.routes.class_route import router as class_route_router
from .api.routes.enrollment import router as enrollment_router
from .api.routes.room import router as room_router
from .api.routes.teacher import router as teacher_router
from .api.routes.term import router as term_router
from .api.routes.schedule import router as schedule_router
from .api.routes.score import router as score_router
from .api.routes.attendance import router as attendance_router
from .api.routes.subject import router as subject_router

# =========================
# INCLUDE ROUTERS
# =========================
app.include_router(auth_router, prefix="/api/v1")
app.include_router(student_router, prefix="/api/v1")
app.include_router(class_route_router, prefix="/api/v1")
app.include_router(enrollment_router, prefix="/api/v1")
app.include_router(room_router, prefix="/api/v1")
app.include_router(teacher_router, prefix="/api/v1")
app.include_router(term_router, prefix="/api/v1")
app.include_router(schedule_router, prefix="/api/v1")
app.include_router(score_router, prefix="/api/v1")
app.include_router(attendance_router, prefix="/api/v1")
app.include_router(subject_router, prefix="/api/v1")

# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {
        "message": "Student Management System API",
        "status": "running"
    }

@app.get("/health")
def health():
    return {"status": "ok"}

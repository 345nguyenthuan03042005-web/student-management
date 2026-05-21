from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .db.base import Base
from .db.database import engine

from .api.routes import (
    auth,
    student,
    class_route,
    class_subject,
    enrollment,
    room,
    teacher,
    term,
    schedule,
    score,
    attendance,
    subject,
)

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
# CORS (ONLY ONCE)
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
# ROUTES
# =========================
app.include_router(auth.router, prefix="/api/v1")
app.include_router(student.router, prefix="/api/v1")
app.include_router(class_route.router, prefix="/api/v1")
app.include_router(class_subject.router, prefix="/api/v1")
app.include_router(enrollment.router, prefix="/api/v1")
app.include_router(room.router, prefix="/api/v1")
app.include_router(teacher.router, prefix="/api/v1")
app.include_router(term.router, prefix="/api/v1")
app.include_router(schedule.router, prefix="/api/v1")
app.include_router(score.router, prefix="/api/v1")
app.include_router(attendance.router, prefix="/api/v1")
app.include_router(subject.router, prefix="/api/v1")

# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {"message": "API running"}

@app.get("/health")
def health():
    return {"status": "ok"}

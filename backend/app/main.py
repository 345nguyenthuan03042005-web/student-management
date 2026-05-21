"""
Main FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .db.base import Base
from .db.database import engine

from .api.routes import (
    attendance,
    auth,
    class_route,
    class_subject,
    enrollment,
    room,
    teacher,
    term,
    schedule,
    score,
    student,
    subject,
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="A student management system API",
    version="1.0.0",
    debug=settings.DEBUG
)

# ==============================
# CORS CONFIG (FIXED)
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # include Netlify here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# ROUTES
# ==============================
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(student.router, prefix=settings.API_V1_STR)
app.include_router(class_route.router, prefix=settings.API_V1_STR)
app.include_router(class_subject.router, prefix=settings.API_V1_STR)
app.include_router(subject.router, prefix=settings.API_V1_STR)
app.include_router(score.router, prefix=settings.API_V1_STR)
app.include_router(enrollment.router, prefix=settings.API_V1_STR)
app.include_router(schedule.router, prefix=settings.API_V1_STR)
app.include_router(attendance.router, prefix=settings.API_V1_STR)
app.include_router(teacher.router, prefix=settings.API_V1_STR)
app.include_router(term.router, prefix=settings.API_V1_STR)
app.include_router(room.router, prefix=settings.API_V1_STR)

# ==============================
# ROOT ENDPOINT
# ==============================
@app.get("/")
async def root():
    return {
        "message": "Welcome to Student Management System API",
        "docs": "/docs",
        "version": "1.0.0"
    }

# ==============================
# HEALTH CHECK
# ==============================
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

"""
Main FastAPI application entry point (fixed version for Render + Netlify).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings


# ==============================
# INIT APP
# ==============================
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
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# ROUTES (ADD BACK ONE BY ONE AFTER DEPLOY STABLE)
# ==============================

from .api.routes import auth

app.include_router(
    auth.router,
    prefix=settings.API_V1_STR
)

# 👉 Sau khi backend chạy OK, mở comment từng cái này lại:

"""
from .api.routes import (
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

app.include_router(student.router, prefix=settings.API_V1_STR)
app.include_router(class_route.router, prefix=settings.API_V1_STR)
app.include_router(class_subject.router, prefix=settings.API_V1_STR)
app.include_router(enrollment.router, prefix=settings.API_V1_STR)
app.include_router(room.router, prefix=settings.API_V1_STR)
app.include_router(teacher.router, prefix=settings.API_V1_STR)
app.include_router(term.router, prefix=settings.API_V1_STR)
app.include_router(schedule.router, prefix=settings.API_V1_STR)
app.include_router(score.router, prefix=settings.API_V1_STR)
app.include_router(attendance.router, prefix=settings.API_V1_STR)
app.include_router(subject.router, prefix=settings.API_V1_STR)
"""

# ==============================
# ROOT ENDPOINT
# ==============================
@app.get("/")
async def root():
    return {
        "message": "Student Management System API",
        "status": "running"
    }


# ==============================
# HEALTH CHECK
# ==============================
@app.get("/health")
async def health():
    return {"status": "healthy"}

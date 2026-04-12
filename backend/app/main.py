"""
Main FastAPI application entry point.
Initializes the FastAPI app, includes all routes, and configures CORS.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .db.base import Base
from .db.database import engine
from .api.routes import attendance, auth, class_route, enrollment, schedule, score, student, subject

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="A student management system API",
    version="1.0.0",
    debug=settings.DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(
    auth.router,
    prefix=settings.API_V1_STR,
)
app.include_router(
    student.router,
    prefix=settings.API_V1_STR,
)
app.include_router(
    class_route.router,
    prefix=settings.API_V1_STR,
)
app.include_router(
    subject.router,
    prefix=settings.API_V1_STR,
)
app.include_router(
    score.router,
    prefix=settings.API_V1_STR,
)
app.include_router(
    enrollment.router,
    prefix=settings.API_V1_STR,
)
app.include_router(
    schedule.router,
    prefix=settings.API_V1_STR,
)
app.include_router(
    attendance.router,
    prefix=settings.API_V1_STR,
)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Student Management System API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

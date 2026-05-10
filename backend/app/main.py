from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.roadmap import router as roadmap_router
from app.api.profile import router as profile_router

app = FastAPI(title="PathForge API")

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
from fastapi.staticfiles import StaticFiles

# Ensure upload directory exists
os.makedirs("uploads/profile_images", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router)
app.include_router(roadmap_router)
app.include_router(profile_router)


@app.get("/")
def home():
    return {"message": "PathForge API Running"}
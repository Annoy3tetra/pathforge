from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.roadmap import router as roadmap_router

app = FastAPI(title="PathForge API")

app.include_router(auth_router)
app.include_router(roadmap_router)


@app.get("/")
def home():
    return {"message": "PathForge API Running"}
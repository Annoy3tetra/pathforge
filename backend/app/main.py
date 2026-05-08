from fastapi import FastAPI

from app.db.database import engine, Base

from app.models.user import User
from app.models.roadmap import Roadmap
from app.models.milestone import Milestone

from app.api.auth import router as auth_router
from app.api.roadmap import router as roadmap_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PathForge API")

app.include_router(auth_router)
app.include_router(roadmap_router)


@app.get("/")
def home():
    return {"message": "PathForge API Running"}
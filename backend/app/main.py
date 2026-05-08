from fastapi import FastAPI

from app.db.database import engine, Base
from app.models.user import User

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PathForge API")


@app.get("/")
def home():
    return {"message": "PathForge API Running"}
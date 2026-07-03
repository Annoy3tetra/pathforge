from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL").replace("postgres://", "postgresql://", 1) if os.getenv("DATABASE_URL") else None
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

settings = Settings()
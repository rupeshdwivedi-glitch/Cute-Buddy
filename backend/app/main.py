from fastapi import FastAPI

from app.api.v1.api import api_router
from app.core.config import settings
from app.middleware.cors import setup_cors

app = FastAPI(title=settings.app_name)

setup_cors(app)
app.include_router(api_router)

import traceback
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.database.session import engine, Base
from app.models import Base as ModelsBase
from app.auth.router import router as auth_router
from app.api.users import router as users_router
from app.api.loans import router as loans_router
from app.api.profiles import router as profiles_router
from app.api.financial_health import router as financial_health_router
from app.api.settlement import router as settlement_router
from app.api.ai import router as ai_router
from app.schemas.response import ApiErrorResponse

# Initialize database tables
Base.metadata.create_all(bind=engine)
from app.database.session import sync_database_schema
sync_database_schema()

app = FastAPI(
    title="FinRelief AI – Backend Foundation",
    description="Debt Relief & Financial Recovery Platform API",
    version="1.0.0"
)

# CORS Middleware setup to allow communication with the React frontend running on http://localhost:5173
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global Exception Handlers for response envelope consistency
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        loc = ".".join(str(x) for x in error.get("loc", []))
        msg = error.get("msg", "Invalid value")
        errors.append(f"{loc}: {msg}")
    
    return JSONResponse(
        status_code=422,
        content=ApiErrorResponse(
            success=False,
            message="Validation Error",
            errors=errors
        ).model_dump()
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ApiErrorResponse(
            success=False,
            message=exc.detail,
            errors=[exc.detail]
        ).model_dump()
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled Exception: {exc}")
    traceback.print_exc()
    
    return JSONResponse(
        status_code=500,
        content=ApiErrorResponse(
            success=False,
            message="Internal Server Error",
            errors=[str(exc)]
        ).model_dump()
    )

# Root status route
@app.get("/", tags=["Status"])
async def root_status():
    return {
        "success": True,
        "message": "FinRelief AI Backend Foundation is running successfully",
        "data": {
            "status": "healthy",
            "version": "1.0.0"
        }
    }

# Include routers
app.include_router(auth_router)

# Include core CRUD routers under /api namespace
app.include_router(users_router, prefix="/api")
app.include_router(loans_router, prefix="/api")
app.include_router(profiles_router, prefix="/api")
app.include_router(financial_health_router, prefix="/api")
app.include_router(settlement_router, prefix="/api")
app.include_router(ai_router, prefix="/api")



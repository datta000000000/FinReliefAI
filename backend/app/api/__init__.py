from app.api.users import router as users_router
from app.api.loans import router as loans_router
from app.api.profiles import router as profiles_router
from app.api.financial_health import router as financial_health_router
from app.api.settlement import router as settlement_router
from app.api.ai import router as ai_router

__all__ = [
    "users_router",
    "loans_router",
    "profiles_router",
    "financial_health_router",
    "settlement_router",
    "ai_router",
]




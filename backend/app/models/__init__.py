from app.database.session import Base
from app.models.user import User
from app.models.loan import Loan
from app.models.financial_profile import FinancialProfile
from app.models.settlement import SettlementRecord
from app.models.ai_history import AIHistory

# Explicitly list them to make import * work or help static analyzers
__all__ = [
    "Base",
    "User",
    "Loan",
    "FinancialProfile",
    "SettlementRecord",
    "AIHistory",
]

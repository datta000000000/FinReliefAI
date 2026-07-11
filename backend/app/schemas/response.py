from typing import Generic, TypeVar, Optional, List, Any
from pydantic import BaseModel

T = TypeVar("T")

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str
    data: Optional[T] = None

class ApiErrorResponse(BaseModel):
    success: bool = False
    message: str
    errors: List[Any] = []

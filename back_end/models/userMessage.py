from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional



class UserMessage(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    role: str
    content: str
    username: Optional[str] = None
    user_email: Optional[str] = None
    deep_search: bool
from typing import Optional
from dataclasses import dataclass

@dataclass
class UserContext:
    email: Optional[str] = None
    username: Optional[str] = None
    user_email: Optional[str] = None
    deep_search: Optional[bool] = False
from sqlmodel import Session
from db.engine import get_session
from models.userMessage import UserMessage


def save_message(memory: dict):
    lead = UserMessage(
        role=memory["role"],
        content=memory["content"],
        username=memory["username"],
        user_email=memory["user_email"],
        deep_search=memory["deep_search"],
    )

    session = get_session()
    try:
        session.add(lead)
        session.commit()
        session.refresh(lead)
    finally:
        session.close()

    return lead


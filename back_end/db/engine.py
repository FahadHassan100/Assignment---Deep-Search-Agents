import os
from sqlmodel import create_engine, Session
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv("DB_URL"), echo=True) # type: ignore


def get_session() -> Session:
    return Session(engine)


# def get_session():
#     with Session(engine) as session:
#         yield session
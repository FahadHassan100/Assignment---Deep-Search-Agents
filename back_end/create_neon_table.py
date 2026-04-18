from sqlmodel import SQLModel
from db.engine import engine

# ✅ Import your models so they register in metadata
from models.userMessage import UserMessage


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


create_db_and_tables()
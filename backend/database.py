import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Soporte transparente para PostgreSQL (vía variable de entorno DATABASE_URL)
# con fallback a SQLite local para funcionamiento inmediato sin configuración previa.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./eos_proteccion.db")

# Ajuste para PostgreSQL en caso de URLs con postgres:// (compatible con SQLAlchemy 2.0)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

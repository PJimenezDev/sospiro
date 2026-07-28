import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime

# ==========================================
# Configuración de Base de Datos
# ==========================================
# Lee la URL de la nube si existe, si no, usa la de Docker local
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://pausa_user:pausa_password@db:5432/pausa_db"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo de la tabla en SQL
class LogRecord(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True) # UUID anónimo
    timestamp = Column(DateTime)

# Crear la tabla si no existe
Base.metadata.create_all(bind=engine)

# ==========================================
# Inicialización de FastAPI y Seguridad
# ==========================================
app = FastAPI(title="SOSpiro API")

# Permitir orígenes dinámicos
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

# ==========================================
# Lógica del Endpoint
# ==========================================
class LogCreate(BaseModel):
    user_id: str
    timestamp: datetime

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/logs")
def create_log(log: LogCreate, db: Session = Depends(get_db)):
    # Guardamos el registro de forma anónima
    db_log = LogRecord(user_id=log.user_id, timestamp=log.timestamp)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return {"status": "success", "message": "Log registrado exitosamente"}
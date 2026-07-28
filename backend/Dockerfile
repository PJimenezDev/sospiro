# ==========================================
# Stage 1: Builder (Compilación)
# ==========================================
FROM python:3.11-slim AS builder
WORKDIR /app

# Instalamos dependencias del sistema operativo necesarias para compilar (ej. psycopg2)
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Creamos un entorno virtual aislado
RUN python -m venv /opt/venv
# Aseguramos que los comandos usen el entorno virtual
ENV PATH="/opt/venv/bin:$PATH"

# Instalamos las dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ==========================================
# Stage 2: Production (Ejecución)
# ==========================================
FROM python:3.11-slim
WORKDIR /app

# Solo instalamos la librería de ejecución de PostgreSQL (no los compiladores)
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq5 && \
    rm -rf /var/lib/apt/lists/*

# Copiamos el entorno virtual completo de la Etapa 1
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copiamos el código fuente de nuestra API
COPY . .

# Exponemos el puerto de FastAPI
EXPOSE 8000

# Comando para ejecutar el servidor en producción
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# ==========================================
# Stage 1: Builder (Compilación)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos solo los archivos de dependencias primero (aprovecha la caché de Docker)
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Production (Servidor Ligero)
# ==========================================
FROM nginx:alpine

# Limpiamos el contenido por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos la carpeta /dist (resultado del build) desde la Etapa 1
COPY --from=builder /app/dist /usr/share/nginx/html

# (Opcional pero recomendado para PWAs): Configuración de Nginx para manejar el enrutamiento
# Si el usuario recarga la página, Nginx debe servir el index.html
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
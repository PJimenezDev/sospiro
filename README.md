# 🌬️ SOSpiro

**SOSpiro** es una aplicación web progresiva (PWA) *offline-first* de código abierto diseñada para ofrecer una herramienta de acceso inmediato durante momentos de ansiedad intensa o ataques de pánico. Su objetivo es reducir la fricción para iniciar un ejercicio de respiración guiada mediante una interfaz simple, un modo oscuro relajado y audio opcional.

---

## 🧠 Objetivo

En situaciones de ansiedad intensa, realizar múltiples acciones para acceder a una aplicación puede resultar difícil.

SOSpiro busca eliminar esa carga permitiendo abrir la aplicación desde la pantalla de inicio del dispositivo y utilizarla incluso sin conexión a Internet.

---

## ✨ Características

- 📱 Instalable como PWA.
- 🌐 Funcionamiento **Offline First** mediante Service Workers.
- 🌙 Interfaz minimalista en modo oscuro.
- 🔺 Respiración guiada con un ciclo de:
  - 4 segundos inhalar.
  - 4 segundos mantener.
  - 4 segundos exhalar.
- 🎵 Audio opcional de 852 Hz.
- 🔒 Registro completamente anónimo y opcional.
- ⚡ Inicio inmediato sin procesos de inicio de sesión.

---

## 🛠️ Stack Tecnológico

### Frontend

- React
- Vite
- TailwindCSS
- vite-plugin-pwa

### Backend

- FastAPI (Python)

### Base de Datos

- PostgreSQL

### Infraestructura

- Docker
- Docker Compose
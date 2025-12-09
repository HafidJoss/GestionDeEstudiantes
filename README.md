# Sistema de Gestión de Estudiantes

Aplicación web moderna para la gestión de estudiantes, asistencias y tareas, construida con los más altos estándares de calidad de software (**Clean Architecture**).

## 🚀 Tecnologías

### Backend
*   **Framework**: [NestJS](https://nestjs.com/) (Node.js)
*   **Lenguaje**: TypeScript
*   **Base de Datos**: PostgreSQL
*   **ORM**: TypeORM
*   **Arquitectura**: Clean Architecture (Domain, Application, Infrastructure, Presentation)

### Frontend
*   **Librería**: React
*   **Empaquetador**: Vite
*   **Estilos**: CSS Minimalista (Tema Verde Pastel)
*   **Router**: React Router Dom

### DevOps
*   **Contenedores**: Docker & Docker Compose

---

## 📋 Requisitos Previos

*   [Node.js](https://nodejs.org/) (v18 o superior)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd sistema-gestion-estudiantes
```

### 2. Configurar el Backend y Base de Datos

Instala las dependencias del backend:
```bash
npm install
```

Levanta la base de datos PostgreSQL con Docker:
```bash
docker-compose up -d
```

Ejecuta las migraciones para crear las tablas:
```bash
npm run migration:run
```

Puebla la base de datos con datos de prueba (Estudiantes, Asistencias):
```bash
npm run seed
```

Inicia el servidor backend (puerto 3000):
```bash
npm run start:dev
```

### 3. Configurar el Frontend

Abre una nueva terminal, navega a la carpeta `frontend` e instala dependencias:
```bash
cd frontend
npm install
```

Inicia el servidor de desarrollo del frontend (puerto 5173):
```bash
npm run dev
```

---

## 📱 Uso de la Aplicación

1.  Abre tu navegador en `http://localhost:5173`.
2.  **Registro**: Crea una nueva cuenta de estudiante en `/register`.
3.  **Login**: Inicia sesión en `/login` (si no redirige automáticamente).
4.  **Dashboard**:
    *   Visualiza tus **Rachas de estudio** (🔥).
    *   Revisa tus **Tareas pendientes**.
    *   Marca tu **Asistencia diaria** con un solo clic.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue los principios de **Clean Architecture** para garantizar mantenibilidad y escalabilidad:

*   `src/domain`: Reglas de negocio puras, interfaces de repositorios y entidades del dominio (independiente de frameworks).
*   `src/application`: Casos de uso y servicios de aplicación (Orquestación).
*   `src/infrastructure`: Implementación de base de datos (TypeORM), adaptadores y configuraciones externas.
*   `src/presentation`: Controladores REST (NestJS Controllers) y DTOs de entrada.

---

## 📝 Comandos Útiles

| Comando | Descripción |
| :--- | :--- |
| `npm run start:dev` | Inicia el servidor NestJS en modo desarrollo. |
| `npm run migration:run` | Ejecuta las migraciones pendientes en la DB. |
| `npm run migration:generate -- <path>` | Genera una nueva migración basada en cambios de entidades. |
| `npm run seed` | Ejecuta el script de semilla para datos iniciales. |
| `docker-compose up -d` | Inicia el contenedor de PostgreSQL. |
| `docker-compose down -v` | Detiene y elimina contenedores y volúmenes (Reiniciar DB). |

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

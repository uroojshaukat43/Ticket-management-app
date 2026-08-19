# Ticket Management Application

Full-stack support ticket system with React (Vite), Node.js/Express, MongoDB, JWT authentication, and Docker deployment.

## Features

- **Authentication**: Register, login, JWT-protected routes
- **Tickets**: Create, view, update, and delete support tickets
- **Admin**: User management, ticket assignment, status updates (Open, In Progress, Resolved, Closed), reports dashboard
- **UI**: Responsive Tailwind CSS interface
- **Architecture**: Modular MVC backend, RESTful API consumed via Axios

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React 18, Vite, Tailwind |
| Backend  | Node.js, Express.js     |
| Database | MongoDB                 |
| Auth     | JWT (jsonwebtoken)      |
| Deploy   | Docker, Docker Compose  |

## Quick Start (Docker)

1. Copy environment variables:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Edit `backend/.env` and set a secure `JWT_SECRET`. Edit root `.env` and set a secure `MONGO_ROOT_PASSWORD`.

3. Start all services:

```bash
docker compose up --build -d
```

4. Open the app:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000/api
- **MongoDB**: localhost:27017

5. Register the first user — they automatically receive the **admin** role.

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB (local or Docker)

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Runs on http://localhost:5000

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs on http://localhost:5173 (proxies `/api` to backend)

## API Endpoints

### Auth
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | /api/auth/register | Register user      |
| POST   | /api/auth/login    | Login              |
| GET    | /api/auth/me       | Current user       |

### Tickets (authenticated)
| Method | Endpoint         | Description     |
|--------|------------------|-----------------|
| GET    | /api/tickets     | List tickets    |
| GET    | /api/tickets/:id | Get ticket      |
| POST   | /api/tickets     | Create ticket   |
| PUT    | /api/tickets/:id | Update ticket   |
| DELETE | /api/tickets/:id | Delete ticket   |

### Admin (admin only)
| Method | Endpoint                        | Description        |
|--------|---------------------------------|--------------------|
| GET    | /api/admin/users                | List users         |
| PUT    | /api/admin/users/:id            | Update user        |
| DELETE | /api/admin/users/:id            | Delete user        |
| PATCH  | /api/admin/tickets/:id/assign   | Assign ticket      |
| PATCH  | /api/admin/tickets/:id/status   | Update status      |
| GET    | /api/admin/reports              | Dashboard reports  |

## Project Structure

```
ticket-management-app/
├── backend/
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   └── validators/   # Input validation
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/     # Axios API client
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .env.example          # Docker Compose (MongoDB)
├── backend/.env.example  # Backend API (local dev & Docker JWT)
└── frontend/.env.example # Frontend (Vite)
```

## Docker Details

- **Multi-stage builds** minimize image size using Alpine-based Node and Nginx images
- **Frontend** serves static files on port 80 and proxies `/api` to the backend
- **Backend** runs on port 5000 with health checks
- **MongoDB** persists data in a named volume on port 27017
- **`.dockerignore`** excludes secrets, node_modules, and build artifacts

## License

MIT

# Tracker adventure

A self-hosted developer workspace — Kanban board with GitHub integration, AI code review, and real-time notifications.

**Live demo:** [github.nordapps.se](https://github.nordapps.se)

---

## Features

- **Kanban board** — drag & drop tasks across columns, multiple boards
- **GitHub OAuth** — sign in with your GitHub account
- **GitHub Issues sync** — webhooks automatically sync issues to your board
- **AI Code Review** — paste code and get instant feedback powered by GPT-4o-mini
- **Real-time notifications** — WebSocket updates when tasks are created or moved
- **Analytics dashboard** — GitHub issues activity charts

---

## Tech Stack

### Backend
- **Java 21** + **Spring Boot 4**
- **Spring Security** — GitHub OAuth2 + JWT authentication
- **Spring WebFlux** — AI streaming responses
- **Spring WebSocket** + STOMP — real-time notifications
- **PostgreSQL** — main database
- **Redis** — session cache
- **Kafka** — event bus between modules

### Frontend
- **React 19** + **TypeScript**
- **TanStack Query** — server state management
- **Zustand** — client state
- **Recharts** — analytics charts
- **Tailwind CSS** — styling
- **SockJS** + **STOMP.js** — WebSocket client

### DevOps
- **Docker Compose** — one-command local setup
- **Cloudflare Tunnel** — production deployment without a VPS

---

## Getting Started

### Prerequisites
- Docker + Docker Compose
- Node.js 20+
- Java 21+

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/devflow.git
cd devflow
```

### 2. Create environment file

```bash
cp .env.example .env
```

Fill in `.env`:

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
OPENAI_API_KEY=your_openai_or_openrouter_key
JWT_SECRET=your_jwt_secret_min_64_chars
APP_FRONTEND_URL=http://localhost:5173
```

Generate JWT secret:
```bash
openssl rand -hex 64
```

### 3. Create GitHub OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers) → New OAuth App
2. Set **Authorization callback URL** to `http://localhost:8080/login/oauth2/code/github`
3. Copy `Client ID` and `Client Secret` to `.env`

### 4. Start infrastructure

```bash
docker compose up postgres redis kafka -d
```

### 5. Start backend

```bash
cd backend
./mvnw spring-boot:run
```

### 6. Start frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## Production Deployment

The app runs on a home machine exposed via **Cloudflare Tunnel** — no VPS needed.

```bash
docker compose up --build -d
```

---

## Project Structure

```
devflow/
├── backend/
│   └── src/main/java/com/devflow/
│       ├── auth/          # GitHub OAuth, JWT, User
│       ├── task/          # Board, Column, Task
│       ├── github/        # Webhooks, Issues sync
│       ├── ai/            # Code review via OpenAI
│       ├── notification/  # WebSocket events
│       └── analytics/     # Stats API
├── frontend/
│   └── src/
│       ├── features/
│       │   ├── auth/      # Login, Callback
│       │   ├── board/     # Kanban UI
│       │   ├── github/    # Issues list
│       │   ├── ai/        # Code review panel
│       │   └── analytics/ # Charts dashboard
│       ├── api/           # TanStack Query hooks
│       ├── store/         # Zustand stores
│       └── hooks/         # WebSocket hook
└── docker-compose.yml
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/me` | Current user |
| `POST` | `/api/boards` | Create board |
| `GET` | `/api/boards` | List boards |
| `POST` | `/api/boards/{id}/columns` | Create column |
| `POST` | `/api/boards/columns/{id}/tasks` | Create task |
| `PATCH` | `/api/boards/tasks/{id}/move` | Move task |
| `POST` | `/api/github/webhook` | GitHub webhook receiver |
| `GET` | `/api/github/issues` | List synced issues |
| `GET` | `/api/github/issues/stats` | Issues analytics |
| `POST` | `/api/ai/review` | AI code review |

---

## License

MIT
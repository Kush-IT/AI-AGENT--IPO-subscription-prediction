# Docker Operations & Orchestration Guide

## 1. Quickstart with Docker Compose

### Step 1: Copy Environment Configuration
```bash
cp .env.example .env
```

### Step 2: Build Multi-Container Images
```bash
docker compose build
```

### Step 3: Start Services in Detached Mode
```bash
docker compose up -d
```

### Step 4: Verify Container Health
```bash
docker compose ps
```

Expected output:
```
NAME               IMAGE                   STATUS                    PORTS
ipo_ai_backend    project-2-backend       Up (healthy) 8000/tcp     0.0.0.0:8000->8000/tcp
ipo_ai_frontend   project-2-frontend      Up (healthy) 3000/tcp     0.0.0.0:3000->3000/tcp
```

---

## 2. Access Endpoints
- **React Dashboard UI**: `http://localhost:3000`
- **FastAPI Backend Swagger**: `http://localhost:8000/docs`
- **Backend Healthcheck**: `http://localhost:8000/api/v1/health`
- **Frontend Healthcheck**: `http://localhost:3000/healthz`

---

## 3. Logs & Troubleshooting
```bash
# View all container logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# Stop and remove containers
docker compose down
```

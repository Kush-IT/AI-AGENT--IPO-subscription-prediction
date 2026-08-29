# Production Readiness Checklist

| Category | Verification Item | Status | Verification Detail |
|---|---|:---:|---|
| **Git Repository** | Clean working tree; temporary files removed | **VERIFIED** | `.gitignore` active, `__pycache__` and `data/cache/*.json` ignored |
| **Secrets & Keys** | Zero committed credentials or API keys | **VERIFIED** | Sanitized `.env.example` provided |
| **Backend Docker** | `Dockerfile.backend` builds and passes healthcheck | **VERIFIED** | Multi-worker Uvicorn on port 8000 with `/api/v1/health` healthcheck |
| **Frontend Docker** | `frontend/Dockerfile` multi-stage build & Nginx | **VERIFIED** | Node.js 20 build \(\to\) Nginx static server on port 3000 |
| **Docker Compose** | `docker-compose.yml` service orchestration | **VERIFIED** | `backend` and `frontend` on isolated `ipo_network` bridge |
| **Model Integrity** | Frozen models immutable with SHA-256 hash match | **VERIFIED** | 5 joblib files verified against hash registry |
| **Temporal Guard** | Strict 09:59:59 IST ex-ante cutoff enforced | **VERIFIED** | `test_temporal_leakage_injection_rejected()` passes |
| **API Contracts** | Pydantic and TypeScript schemas 100% aligned | **VERIFIED** | Validated via `IPOAnalysisResponse` |
| **Backend Tests** | 83 Pytest tests passing | **VERIFIED** | 83/83 unit, integration, and E2E tests passing |
| **Frontend Tests** | 15 Vitest tests passing | **VERIFIED** | 15/15 unit and integration tests passing |
| **Production Bundle**| `npm run build` cleanly compiled | **VERIFIED** | 0 TypeScript/lint errors; assets generated in `dist/` |
| **CI Automation** | `.github/workflows/ci.yml` pipeline configured | **VERIFIED** | Automated backend & frontend verification pipeline |

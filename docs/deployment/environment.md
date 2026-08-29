# Environment Variables & Configuration Guide

## 1. Backend Environment Variables

| Variable Name | Type | Default Value | Description |
|---|---|---|---|
| `PROJECT_NAME` | `string` | `"IPO Agentic AI"` | Name of the project displayed in root responses |
| `VERSION` | `string` | `"1.0.0"` | Service release version |
| `ENVIRONMENT` | `string` | `"production"` | Operational environment (`production`, `staging`, `development`) |
| `DEBUG` | `boolean` | `false` | Enable or disable debug logs and reloaders |
| `HOST` | `string` | `"0.0.0.0"` | Network interface to bind Uvicorn |
| `PORT` | `integer` | `8000` | Port for FastAPI service |
| `CORS_ORIGINS` | `string` | `"http://localhost:3000,http://localhost:5173"` | Comma-separated list of allowed origins |
| `DEFAULT_CONNECTOR_MODE` | `string` | `"OFFLINE"` | Default data mode (`OFFLINE` or `LIVE`) |

---

## 2. Frontend Environment Variables

| Variable Name | Type | Default Value | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | `string` | `"http://localhost:8000"` | Base URL for FastAPI backend in production |

# Production Deployment Architecture

## 1. Container Infrastructure

```mermaid
graph TD
    subgraph ClientLayer [Client & Network]
        Browser["User Web Browser"]
    end
    subgraph FrontendContainer [Frontend Container (Port 3000 - Nginx)]
        NGINX["Nginx Web Server"]
        SPA["React 18 Static Bundle"]
        PROXY["Reverse Proxy: /api/* -> backend:8000/api/*"]
    end
    subgraph BackendContainer [Backend Container (Port 8000 - FastAPI)]
        UVICORN["Uvicorn ASGI Server"]
        API["FastAPI /api/v1 Application"]
        CORE["LangGraph StateGraph Engine"]
        FROZEN["Frozen ML Models (Joblib)"]
        SHAP["TreeSHAP Engine"]
    end

    Browser -->|HTTP Port 3000| NGINX
    NGINX --> SPA
    NGINX -->|Proxy /api/v1| UVICORN
    UVICORN --> API --> CORE --> FROZEN & SHAP
```

---

## 2. Service Separation & Network Topology
- **`backend` Service**: Isolated container running Python 3.11-slim with FastAPI and Uvicorn on port `8000`. Exposes REST API and Healthcheck endpoint `/api/v1/health`.
- **`frontend` Service**: Lightweight Alpine container running Nginx on port `3000`. Serves compiled React assets, handles SPA client routing, and proxies `/api/` calls to `http://backend:8000/api/`.
- **`ipo_network`**: Internal Docker bridge network ensuring secure, isolated container communication.

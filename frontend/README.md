# Pre-IPO Subscription AI — React + TypeScript Frontend

A modern, accessible, and quantitative financial research dashboard for forecasting category-wise Indian Mainboard IPO subscription demand and explaining predictions with TreeSHAP.

---

## 1. Overview
The frontend connects to the FastAPI Agentic AI backend (`/api/v1/`) to provide:
- **Interactive IPO Parameter Form**: Dynamic parameters with client-side validation and synthetic fixture pre-fill.
- **Predicted Subscription Multiples**: QIB, NII, Retail, and Total demand forecasts.
- **Category Demand Assessment**: Relative demand rankings, leading category recommendations, and edge explanations.
- **Evidence-Based Confidence**: Calibration score and audit factors.
- **SHAP Additive Attributions**: Recharts horizontal attribution chart showing positive and negative drivers.
- **Multi-Dimensional Risk Audit**: Valuation, leverage, scale friction, and market volatility warnings.
- **Data Quality & Temporal Compliance**: Verification of 09:59:59 IST ex-ante cutoff and feature completeness.
- **Statutory Provenance Table**: Expandable audit logs of data sources and observation timestamps.
- **Frozen Model Architecture**: Metadata on XGBoost, Random Forest, and LightGBM models.

---

## 2. Tech Stack
- **Framework**: React 18, TypeScript 5, Vite
- **State & Data Fetching**: TanStack React Query (`@tanstack/react-query`)
- **Routing**: React Router DOM (`react-router-dom`)
- **Visualizations**: Recharts (`recharts`)
- **Icons**: Lucide React (`lucide-react`)
- **Testing**: Vitest (`vitest`)
- **Production Web Server**: Nginx (via Docker)

---

## 3. Environment Configuration
Create a `.env` file in the `frontend/` directory if connecting to a non-default backend port:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

---

## 4. Local Development

### Install Dependencies
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```
The application will start on `http://localhost:5173`.

### Run Unit & Integration Tests (15 Tests)
```bash
npm run test
```

### Build Production Bundle
```bash
npm run build
```
The optimized production bundle will be output to `dist/`.

---

## 5. Docker Production Deployment
The frontend is packaged using a multi-stage Dockerfile serving static assets via Nginx:

```bash
# Build frontend image
docker build -t ipo-frontend ./frontend

# Run frontend container on port 3000
docker run -d -p 3000:3000 --name ipo_frontend ipo-frontend
```

Alternatively, launch the complete full-stack system using Docker Compose from the root directory:
```bash
docker compose up -d
```
The dashboard will be live at `http://localhost:3000`.

# Production Security Policy & Hardening Guide

## 1. Security Architecture & Controls

### 1.1 Secret Isolation
- Zero API keys, passwords, private keys, or credentials are hardcoded in the codebase.
- `.env` and sensitive environment configurations are ignored in `.gitignore`.
- Structured logging automatically sanitizes incoming dictionary tokens, excluding `api_key`, `token`, `secret`, and `password`.

---

### 1.2 Model File Immutability
- Candidate model files in `models/final_candidates/` are loaded in read-only mode during application startup.
- SHA-256 cryptographic hashes are monitored to ensure model weights, transformers, and hyperparameters are never overwritten or mutated during runtime inference.

---

### 1.3 Strict Ex-Ante Temporal Cutoffs
- All external observations and user-submitted data points must satisfy:
  \[
  t_{\text{observed}} \le 09:59:59 \text{ IST on ipo\_open\_date}
  \]
- Future timestamps are rejected with explicit audit flags, preventing look-ahead data leakage.

---

### 1.4 Safe Error Handling & Stack Trace Concealment
- All application exceptions (`400`, `422`, `500`) are captured by centralized exception handlers emitting uniform JSON responses with unique `request_id` values.
- Raw Python tracebacks and internal file system paths are never exposed in client HTTP responses.

---

### 1.5 CORS Policy
- Production builds restrict CORS headers to explicit frontend domains configured via `CORS_ORIGINS`.
- Wildcard `allow_origins=["*"]` is disabled in production environments.

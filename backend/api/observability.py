"""
Structured Logging, Request Tracing, and In-Process Observability Engine.
Tracks request latency, throughput, error rates, and temporal rejections.
"""
from typing import Dict, Any, List
from datetime import datetime
import time
import logging
import json

# Setup logger
logger = logging.getLogger("ipo_agentic_api")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": %(message)s}'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)


class MetricsTracker:
    """
    In-memory runtime metrics collector.
    """
    def __init__(self):
        self.start_time = datetime.now()
        self.total_requests = 0
        self.successful_analyses = 0
        self.failed_analyses = 0
        self.connector_errors = 0
        self.temporal_rejections = 0
        self._latencies: List[float] = []

    def record_request(
        self,
        endpoint: str,
        status_code: int,
        latency_ms: float,
        is_success: bool = True,
        temporal_rejections_count: int = 0
    ):
        self.total_requests += 1
        self._latencies.append(latency_ms)
        if len(self._latencies) > 1000:
            self._latencies = self._latencies[-1000:]
            
        if is_success and status_code < 400:
            self.successful_analyses += 1
        else:
            self.failed_analyses += 1
            
        self.temporal_rejections += temporal_rejections_count

    def get_summary(self) -> Dict[str, Any]:
        avg_lat = round(sum(self._latencies) / len(self._latencies), 2) if self._latencies else 0.0
        return {
            "uptime_seconds": round((datetime.now() - self.start_time).total_seconds(), 1),
            "total_requests": self.total_requests,
            "successful_analyses": self.successful_analyses,
            "failed_analyses": self.failed_analyses,
            "connector_errors": self.connector_errors,
            "temporal_rejections": self.temporal_rejections,
            "average_latency_ms": avg_lat
        }


# Global metrics tracker instance
METRICS = MetricsTracker()


def log_structured(
    event: str,
    request_id: str,
    endpoint: str,
    status_code: int,
    latency_ms: float,
    mode: str = "OFFLINE",
    extra: Dict[str, Any] = None
):
    """
    Emits structured JSON log event. Never logs secrets or private payload tokens.
    """
    log_data = {
        "event": event,
        "request_id": request_id,
        "endpoint": endpoint,
        "status_code": status_code,
        "latency_ms": round(latency_ms, 2),
        "mode": mode
    }
    if extra:
        # Sanitize extra dict
        for k, v in extra.items():
            if k not in ["api_key", "password", "token", "secret"]:
                log_data[k] = v
                
    try:
        logger.info(json.dumps(log_data))
    except Exception:
        logger.info(f"{event} | request_id={request_id} | status={status_code}")

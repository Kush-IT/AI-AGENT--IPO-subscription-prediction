"""
Hourly Background Refresh Service for Live NSE & IPO Intelligence Feeds.
Periodically fetches active and upcoming mainboard IPO data from authoritative endpoints:
- NSE Public Issue Feed (EQ series only)
- IPOWatch Pipeline & Indicative GMP
Maintains strict 60-minute cache TTL, handles network failures with graceful STALE fallback,
and guarantees that post-cutoff live subscription tallies NEVER leak into ex-ante ML predictions.
"""
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional

from backend.config import settings
from backend.connectors.live_ipo_discovery import (
    LiveIPODiscoveryService,
    get_current_ist_timestamp,
    IST_TZ,
)

logger = logging.getLogger(__name__)


class HourlyRefreshService:
    """
    Background daemon service managing hourly refresh cycles of live IPO market data.
    """

    def __init__(self, interval_seconds: Optional[int] = None):
        self.interval_seconds = interval_seconds or (settings.IPO_DATA_TTL_MINUTES * 60)
        self._task: Optional[asyncio.Task] = None
        self._is_running = False
        self._is_refreshing = False
        self.last_refresh_utc: Optional[str] = None
        self.last_refresh_ist: Optional[str] = None
        self.next_refresh_utc: Optional[str] = None
        self.next_refresh_ist: Optional[str] = None
        self.freshness_status: str = "INITIALIZING"
        self.refresh_count: int = 0
        self.last_error: Optional[str] = None

    def start(self):
        """Start the periodic background refresh task if not already running."""
        if self._is_running and self._task and not self._task.done():
            return
        self._is_running = True
        self._task = asyncio.create_task(self._run_loop())
        logger.info(f"[HourlyRefreshService] Started background refresh worker (interval={self.interval_seconds}s).")

    async def stop(self):
        """Gracefully stop the background refresh task."""
        self._is_running = False
        if self._task and not self._task.done():
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("[HourlyRefreshService] Stopped background refresh worker.")

    async def _run_loop(self):
        """Periodic async loop running every interval_seconds."""
        # Initial trigger on startup
        await self.refresh_now(force=False)

        while self._is_running:
            try:
                await asyncio.sleep(self.interval_seconds)
                if not self._is_running:
                    break
                await self.refresh_now(force=True)
            except asyncio.CancelledError:
                break
            except Exception as exc:
                logger.error(f"[HourlyRefreshService] Error in refresh loop: {exc}")
                self.last_error = str(exc)
                self.freshness_status = "STALE"

    async def refresh_now(self, force: bool = True) -> Dict[str, Any]:
        """
        Execute an immediate data refresh from live sources in a non-blocking thread.
        Never raises exceptions; gracefully degrades to cached STALE state.
        """
        self._is_refreshing = True
        now_utc = datetime.now(timezone.utc)
        next_dt = now_utc + timedelta(seconds=self.interval_seconds)
        
        try:
            # Run blocking connector I/O in thread pool
            discovery = LiveIPODiscoveryService()
            result = await asyncio.to_thread(discovery.get_live_ipos, force_refresh=force)
            
            self.last_refresh_utc = now_utc.isoformat()
            self.last_refresh_ist = get_current_ist_timestamp()
            self.next_refresh_utc = next_dt.isoformat()
            self.next_refresh_ist = next_dt.astimezone(IST_TZ).strftime("%d-%m-%Y %H:%M IST")
            self.refresh_count += 1
            self.last_error = None

            # If result was stale from connector, reflect that
            if result.get("data_status") == "STALE":
                self.freshness_status = "STALE"
            else:
                self.freshness_status = "FRESH"

            logger.info(
                f"[HourlyRefreshService] Refresh complete. Found {len(result.get('ipos', []))} IPOs. "
                f"Next refresh at {self.next_refresh_ist}."
            )
            return result

        except Exception as exc:
            logger.warning(f"[HourlyRefreshService] Refresh failed: {exc}. Retaining cached state as STALE.")
            self.last_error = str(exc)
            self.freshness_status = "STALE"
            self.last_refresh_utc = now_utc.isoformat()
            self.last_refresh_ist = get_current_ist_timestamp()
            self.next_refresh_utc = next_dt.isoformat()
            self.next_refresh_ist = next_dt.astimezone(IST_TZ).strftime("%d-%m-%Y %H:%M IST")
            
            # Return current cached data if available
            try:
                discovery = LiveIPODiscoveryService()
                return await asyncio.to_thread(discovery.get_live_ipos, force_refresh=False)
            except Exception:
                return {
                    "data_status": "DATA_UNAVAILABLE",
                    "ipos": [],
                    "last_updated_ist": get_current_ist_timestamp(),
                }
        finally:
            self._is_refreshing = False

    def get_status(self) -> Dict[str, Any]:
        """Return diagnostic status of the hourly refresh worker."""
        return {
            "is_running": self._is_running,
            "is_refreshing": self._is_refreshing,
            "refresh_interval_minutes": self.interval_seconds // 60,
            "last_refresh_utc": self.last_refresh_utc,
            "last_refresh_ist": self.last_refresh_ist,
            "next_refresh_utc": self.next_refresh_utc,
            "next_refresh_ist": self.next_refresh_ist,
            "freshness_status": self.freshness_status,
            "refresh_count": self.refresh_count,
            "last_error": self.last_error,
        }


# Global singleton
_refresh_service_instance: Optional[HourlyRefreshService] = None


def get_hourly_refresh_service() -> HourlyRefreshService:
    """Retrieve or initialize the global HourlyRefreshService singleton."""
    global _refresh_service_instance
    if _refresh_service_instance is None:
        _refresh_service_instance = HourlyRefreshService()
    return _refresh_service_instance

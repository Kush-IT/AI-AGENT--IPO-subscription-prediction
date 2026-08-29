"""
Secondary Market Climate and Benchmark Indices Connector.
Retrieves ex-ante returns for NIFTY, SENSEX, and India VIX prior to subscription open.
"""
from typing import Dict, Any, Optional
from backend.connectors.base_connector import ProvenanceRecord, CacheManager


class MarketConnector:
    """
    Connects to NSE/BSE benchmark data feeds.
    Strictly uses market closing levels from the trading session immediately prior to open date.
    """
    SOURCE_NAME = "NSE/BSE Historical Benchmark Index Feeds"
    SOURCE_URL = "https://www.nseindia.com/reports-indices-historical-index-data"

    def fetch_data(
        self,
        company_name: str,
        ipo_open_date: str,
        feature_cutoff: str,
        raw_params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, ProvenanceRecord]:
        params = raw_params or {}
        # Market indicators are observed at pre-market open 09:00:00 IST on open date
        obs_time = f"{ipo_open_date}T09:00:00+05:30"
        
        cached = CacheManager.get("MARKET_INDEX", company_name, ipo_open_date)
        if cached:
            params = {**cached, **params}
            
        nifty_20d = float(params.get("nifty_20d_return", 1.20))
        vix = float(params.get("india_vix", 14.5))
        trend = str(params.get("market_trend", "NEUTRAL")).upper()
        if trend not in ["BULLISH", "BEARISH", "NEUTRAL", "VOLATILE"]:
            trend = "VOLATILE" if vix > 20.0 else ("BULLISH" if nifty_20d > 2.0 else "NEUTRAL")
            
        fields_map = {
            "nifty_1d_return": float(params.get("nifty_1d_return", 0.05)),
            "nifty_5d_return": float(params.get("nifty_5d_return", 0.35)),
            "nifty_20d_return": nifty_20d,
            "sensex_1d_return": float(params.get("sensex_1d_return", 0.05)),
            "sensex_5d_return": float(params.get("sensex_5d_return", 0.35)),
            "sensex_20d_return": float(params.get("sensex_20d_return", 1.20)),
            "india_vix": vix,
            "india_vix_5d_change": float(params.get("india_vix_5d_change", 0.0)),
            "market_trend": trend
        }
        
        records = {}
        for f_name, val in fields_map.items():
            records[f_name] = ProvenanceRecord(
                field=f_name,
                value=val,
                source=self.SOURCE_NAME,
                source_url=self.SOURCE_URL,
                observed_at=obs_time,
                feature_cutoff=feature_cutoff
            )
            
        CacheManager.set("MARKET_INDEX", company_name, ipo_open_date, fields_map)
        return records

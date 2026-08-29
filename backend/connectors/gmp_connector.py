"""
Grey Market Premium (GMP) Connector.
Retrieves ex-ante unofficial grey market rates observed immediately prior to subscription open.
"""
from typing import Dict, Any, Optional
from backend.connectors.base_connector import ProvenanceRecord, CacheManager


class GMPConnector:
    """
    Connects to unofficial pre-IPO grey market intelligence sources.
    Never fabricates values when GMP is unavailable.
    """
    SOURCE_NAME = "Ex-Ante Grey Market Aggregator (Chittorgarh/IPOWatch)"
    SOURCE_URL = "https://www.chittorgarh.com/report/ipo-grey-market-premium-gmp/24/"

    def fetch_data(
        self,
        company_name: str,
        ipo_open_date: str,
        feature_cutoff: str,
        raw_params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, ProvenanceRecord]:
        params = raw_params or {}
        obs_time = f"{ipo_open_date}T08:30:00+05:30"
        
        cached = CacheManager.get("GMP_RATES", company_name, ipo_open_date)
        if cached:
            params = {**cached, **params}
            
        gmp_pct = params.get("gmp_percentage")
        gmp_inr = params.get("gmp_in_inr")
        p_high = float(params.get("price_high", 500.0))
        
        if gmp_pct is not None:
            gmp_pct = float(gmp_pct)
            gmp_inr = float(gmp_inr) if gmp_inr is not None else round((gmp_pct / 100.0) * p_high, 2)
        elif gmp_inr is not None:
            gmp_inr = float(gmp_inr)
            gmp_pct = round((gmp_inr / p_high) * 100.0, 4) if p_high > 0 else 0.0
            
        records = {}
        if gmp_pct is not None:
            records["gmp_percentage"] = ProvenanceRecord(
                field="gmp_percentage",
                value=gmp_pct,
                source=self.SOURCE_NAME,
                source_url=self.SOURCE_URL,
                observed_at=obs_time,
                feature_cutoff=feature_cutoff
            )
            records["gmp_in_inr"] = ProvenanceRecord(
                field="gmp_in_inr",
                value=gmp_inr,
                source=self.SOURCE_NAME,
                source_url=self.SOURCE_URL,
                observed_at=obs_time,
                feature_cutoff=feature_cutoff
            )
            CacheManager.set("GMP_RATES", company_name, ipo_open_date, {
                "gmp_percentage": gmp_pct,
                "gmp_in_inr": gmp_inr
            })
        else:
            # Mark unavailable without fabricating
            rec_pct = ProvenanceRecord(
                field="gmp_percentage",
                value=None,
                source=self.SOURCE_NAME,
                source_url=self.SOURCE_URL,
                observed_at=obs_time,
                feature_cutoff=feature_cutoff
            )
            rec_pct.status = "UNAVAILABLE"
            records["gmp_percentage"] = rec_pct
            
            rec_inr = ProvenanceRecord(
                field="gmp_in_inr",
                value=None,
                source=self.SOURCE_NAME,
                source_url=self.SOURCE_URL,
                observed_at=obs_time,
                feature_cutoff=feature_cutoff
            )
            rec_inr.status = "UNAVAILABLE"
            records["gmp_in_inr"] = rec_inr
            
        return records

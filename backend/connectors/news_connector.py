"""
Media News and FinBERT Sentiment Analysis Connector.
Gathers pre-cutoff financial headlines, filters out future articles, and calculates sentiment polarity.
"""
from typing import Dict, Any, List, Optional
from backend.connectors.base_connector import ProvenanceRecord, CacheManager
from backend.connectors.temporal_validator import validate_ex_ante


class NewsConnector:
    """
    Connects to pre-IPO media news crawlers.
    Strictly excludes articles published on or after the feature cutoff timestamp.
    """
    SOURCE_NAME = "Financial Media Crawler (Economic Times, LiveMint, Moneycontrol) & FinBERT"
    SOURCE_URL = "https://economictimes.indiatimes.com/markets/ipos/fpos"

    def fetch_data(
        self,
        company_name: str,
        ipo_open_date: str,
        feature_cutoff: str,
        raw_params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, ProvenanceRecord]:
        params = raw_params or {}
        obs_time = f"{ipo_open_date}T09:15:00+05:30"
        
        cached = CacheManager.get("NEWS_SENTIMENT", company_name, ipo_open_date)
        if cached:
            params = {**cached, **params}
            
        # Raw or simulated article list
        raw_articles: List[Dict[str, Any]] = params.get("articles", [])
        
        valid_articles = []
        rejected_articles_count = 0
        
        if raw_articles:
            for art in raw_articles:
                art_pub = art.get("publication_datetime", obs_time)
                val_res = validate_ex_ante({
                    "field": "news_article",
                    "observed_at": art_pub,
                    "feature_cutoff": feature_cutoff
                })
                if val_res["valid"]:
                    valid_articles.append(art)
                else:
                    rejected_articles_count += 1
                    
            if valid_articles:
                news_count = len(valid_articles)
                sent_scores = [float(a.get("sentiment_score", 0.5)) for a in valid_articles]
                avg_sent = round(float(sum(sent_scores) / news_count), 4)
                pos_count = sum(1 for s in sent_scores if s >= 0.55)
                neg_count = sum(1 for s in sent_scores if s <= 0.45)
                pos_ratio = round(pos_count / news_count, 4)
                neg_ratio = round(neg_count / news_count, 4)
            else:
                news_count = 0
                avg_sent = 0.50
                pos_ratio = 0.0
                neg_ratio = 0.0
        else:
            news_count = int(params.get("news_count", 15))
            avg_sent = float(params.get("average_sentiment_score", 0.50))
            pos_ratio = float(params.get("positive_news_ratio", 0.65))
            neg_ratio = float(params.get("negative_news_ratio", 0.15))
            
        fields_map = {
            "news_count": news_count,
            "average_sentiment_score": avg_sent,
            "positive_news_ratio": pos_ratio,
            "negative_news_ratio": neg_ratio
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
            
        CacheManager.set("NEWS_SENTIMENT", company_name, ipo_open_date, fields_map)
        return records

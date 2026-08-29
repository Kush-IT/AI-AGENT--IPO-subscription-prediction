"""
Media News Sentiment and Polarity Tool.
Processes pre-IPO news coverage sentiment metrics (FinBERT score, positive/negative ratios).
"""
from typing import Dict, Any, List, Tuple


def validate_news_sentiment(data: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str], List[str]]:
    """
    Validates pre-IPO media news sentiment metrics observed up to feature cutoff.
    """
    errors = []
    warnings = []
    normalized = {}
    
    try:
        news_count = int(data.get("news_count", 15))
        pos_ratio = float(data.get("positive_news_ratio", 0.65))
        neg_ratio = float(data.get("negative_news_ratio", 0.15))
        sentiment_score = float(data.get("average_sentiment_score", 0.50))
        
        if pos_ratio < 0.0 or pos_ratio > 1.0:
            warnings.append(f"positive_news_ratio out of [0, 1] range: {pos_ratio}")
            pos_ratio = max(0.0, min(1.0, pos_ratio))
        if neg_ratio < 0.0 or neg_ratio > 1.0:
            warnings.append(f"negative_news_ratio out of [0, 1] range: {neg_ratio}")
            neg_ratio = max(0.0, min(1.0, neg_ratio))
            
        normalized["news_count"] = max(0, news_count)
        normalized["positive_news_ratio"] = round(pos_ratio, 4)
        normalized["negative_news_ratio"] = round(neg_ratio, 4)
        normalized["average_sentiment_score"] = round(sentiment_score, 4)
        
    except (ValueError, TypeError) as e:
        errors.append(f"Type conversion failure in sentiment validation: {str(e)}")
        
    return normalized, errors, warnings

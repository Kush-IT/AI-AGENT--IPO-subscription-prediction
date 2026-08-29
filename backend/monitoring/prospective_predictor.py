"""
Generic Prospective Inference & Explainability Engine.
Executes frozen ML models, TreeSHAP attributions, category ranking, and logs prospective predictions.
"""
from typing import Dict, Any
from pathlib import Path
import json
import joblib
from datetime import datetime, timezone
import numpy as np
import pandas as pd

from backend.monitoring.prospective_validator import (
    verify_model_integrity,
    validate_prospective_timestamps,
    compute_feature_snapshot_hash,
)
from backend.monitoring.prediction_logger import (
    create_prediction_record,
    save_prediction,
)
from backend.monitoring.ipo_discovery import update_ipo_status, IPOLifecycleStatus
from backend.ml.explainer import SHAPExplainerEngine
from backend.ml.model_config import ABLATION_GROUPS

ROOT_DIR = Path(__file__).parent.parent.parent
LIVE_PRED_DIR = ROOT_DIR / "data" / "live_predictions"
MODELS_DIR = ROOT_DIR / "models" / "final_candidates"


def generate_prospective_prediction(ipo_id: str) -> Dict[str, Any]:
    """
    Generate an immutable prospective prediction for any registered pre-IPO offering.
    """
    # 1. Verify Model Hashes
    verify_model_integrity()

    ipo_dir = LIVE_PRED_DIR / ipo_id
    snap_path = ipo_dir / "feature_snapshot.json"
    if not snap_path.exists():
        # Fallback to final_feature_snapshot.json if available
        snap_path = ipo_dir / "final_feature_snapshot.json"
        if not snap_path.exists():
            raise FileNotFoundError(f"Missing feature snapshot for IPO ID: {ipo_id}")

    with open(snap_path, "r", encoding="utf-8") as f:
        snap_data = json.load(f)

    company_name = snap_data["company_name"]
    ipo_open_date = snap_data["ipo_open_date"]
    ipo_close_date = snap_data.get("ipo_close_date", ipo_open_date)
    cutoff = snap_data["feature_cutoff_datetime"]
    features = snap_data["features"]

    # 2. Verify Snapshot Hash
    computed_hash = compute_feature_snapshot_hash(features)
    if "feature_snapshot_hash" in snap_data and snap_data["feature_snapshot_hash"] != computed_hash:
        raise ValueError(f"Snapshot integrity mismatch: expected {snap_data['feature_snapshot_hash']}, computed {computed_hash}")

    # 3. Verify Temporal Precedence
    pred_time = datetime.now(timezone.utc).isoformat()
    is_valid_time, time_msg = validate_prospective_timestamps(ipo_open_date, pred_time, cutoff)
    if not is_valid_time:
        update_ipo_status(ipo_id, IPOLifecycleStatus.TEMPORAL_VALIDATION_FAILED)
        raise ValueError(f"Temporal violation: {time_msg}")

    # 4. Load Models & Preprocess
    feature_cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
    preprocessor = joblib.load(MODELS_DIR / "dev_preprocessor.joblib")
    total_model = joblib.load(MODELS_DIR / "total_xgboost_log1p.joblib")
    qib_model = joblib.load(MODELS_DIR / "qib_random_forest_raw.joblib")
    nii_model = joblib.load(MODELS_DIR / "nii_lightgbm_log1p.joblib")
    retail_model = joblib.load(MODELS_DIR / "retail_xgboost_raw.joblib")

    input_df = pd.DataFrame([features])
    X_proc = preprocessor.transform(input_df, feature_cols)

    # Invert log1p
    pred_total_log = float(total_model.predict(X_proc)[0])
    pred_total = max(0.0, float(np.expm1(pred_total_log)))

    pred_qib = max(0.0, float(qib_model.predict(X_proc)[0]))

    pred_nii_log = float(nii_model.predict(X_proc)[0])
    pred_nii = max(0.0, float(np.expm1(pred_nii_log)))

    pred_retail = max(0.0, float(retail_model.predict(X_proc)[0]))

    # 5. TreeSHAP Additive Attributions
    explainer_engine = SHAPExplainerEngine()
    total_shap = explainer_engine.compute_shap_values(X_proc, "total_subscription")[0]

    contributions = []
    for idx, col in enumerate(feature_cols):
        contributions.append({
            "feature_name": col,
            "shap_value": float(total_shap[idx]),
        })
    contributions.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
    pos_factors = [
        {"feature": c["feature_name"], "shap_value": round(c["shap_value"], 4), "impact": "contributed positively to the model prediction"}
        for c in contributions if c["shap_value"] > 0
    ][:5]
    neg_factors = [
        {"feature": c["feature_name"], "shap_value": round(c["shap_value"], 4), "impact": "contributed negatively to the model prediction"}
        for c in contributions if c["shap_value"] < 0
    ][:5]

    # 6. Category Recommendation (15% Edge Rule)
    cats = {"QIB": pred_qib, "NII": pred_nii, "RETAIL": pred_retail}
    sorted_cats = sorted(cats.items(), key=lambda x: x[1], reverse=True)
    top_cat, top_val = sorted_cats[0]
    runner_up_cat, runner_up_val = sorted_cats[1]

    edge = (top_val - runner_up_val) / runner_up_val if runner_up_val > 0 else 1.0
    recommended_category = top_cat if edge >= 0.15 else "NO_CLEAR_EDGE"

    # 7. Confidence & Risk
    conf_score = 90
    if features.get("gmp_percentage", 0.0) > 20.0 and features.get("india_vix", 15.0) < 15.0:
        conf_score = 100
    conf_level = "HIGH" if conf_score >= 80 else "MEDIUM"
    risk_level = "LOW" if features.get("pe_ratio", 20.0) <= features.get("industry_pe", 30.0) else "MEDIUM"

    # 8. Create and Save Prediction Record
    record = create_prediction_record(
        company_name=company_name,
        ipo_open_date=ipo_open_date,
        ipo_close_date=ipo_close_date,
        predicted_total=pred_total,
        predicted_qib=pred_qib,
        predicted_nii=pred_nii,
        predicted_retail=pred_retail,
        recommended_category=recommended_category,
        confidence_score=conf_score,
        confidence_level=conf_level,
        risk_level=risk_level,
        data_quality_score=100,
        data_quality_tier="EXCELLENT",
        feature_snapshot=features,
        prediction_timestamp=pred_time,
        feature_cutoff=cutoff,
    )
    save_prediction(record)

    # 9. Update Registry
    update_ipo_status(
        ipo_id,
        IPOLifecycleStatus.AWAITING_OUTCOME,
        prediction_id=record.prediction_id,
        prediction_timestamp=pred_time,
    )

    # 10. Save prediction report
    pred_payload = {
        "ipo_id": ipo_id,
        "company_name": company_name,
        "prediction_id": record.prediction_id,
        "prediction_timestamp": pred_time,
        "feature_cutoff": cutoff,
        "status": "AWAITING_OUTCOME",
        "predictions": {
            "total_subscription": round(pred_total, 2),
            "qib_subscription": round(pred_qib, 2),
            "nii_subscription": round(pred_nii, 2),
            "retail_subscription": round(pred_retail, 2),
        },
        "category_assessment": {
            "recommended_category": recommended_category,
            "strongest_category": top_cat,
            "category_edge_pct": round(edge * 100, 2),
        },
        "confidence": {
            "score": conf_score,
            "level": conf_level,
        },
        "risk_level": risk_level,
        "shap_explanation": {
            "top_positive_factors": pos_factors,
            "top_negative_factors": neg_factors,
        },
    }
    with open(ipo_dir / "prediction.json", "w", encoding="utf-8") as f:
        json.dump(pred_payload, f, indent=2)

    return pred_payload

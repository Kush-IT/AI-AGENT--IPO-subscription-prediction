"""
LangGraph StateGraph Compilation & Orchestration Engine for Agentic AI.
Coordinates validation, feature preparation, prediction, SHAP attribution, and report synthesis.
"""
from typing import Dict, Any, Literal
from langgraph.graph import StateGraph, START, END

from backend.agents.state import IPOState
from backend.agents.input_validation_agent import input_validation_node
from backend.agents.ipo_data_agent import ipo_data_node
from backend.agents.feature_agent import feature_preparation_node
from backend.agents.prediction_agent import prediction_node
from backend.agents.shap_agent import shap_explanation_node
from backend.agents.category_agent import category_analysis_node
from backend.agents.risk_agent import risk_analysis_node
from backend.agents.report_agent import report_generation_node


def route_after_validation(state: IPOState) -> Literal["collect_ipo_data", "generate_report"]:
    """Conditional router after input validation."""
    if state.get("status") == "VALIDATION_FAILED":
        return "generate_report"
    return "collect_ipo_data"


def build_ipo_agent_graph():
    """
    Constructs and compiles the modular Agentic AI LangGraph StateGraph.
    """
    builder = StateGraph(IPOState)
    
    # 1. Register Agent Nodes
    builder.add_node("validate_input", input_validation_node)
    builder.add_node("collect_ipo_data", ipo_data_node)
    builder.add_node("prepare_features", feature_preparation_node)
    builder.add_node("predict", prediction_node)
    builder.add_node("explain", shap_explanation_node)
    builder.add_node("analyze_categories", category_analysis_node)
    builder.add_node("assess_risk", risk_analysis_node)
    builder.add_node("generate_report", report_generation_node)
    
    # 2. Wire Graph Edges
    builder.add_edge(START, "validate_input")
    
    # Conditional routing after validation
    builder.add_conditional_edges(
        "validate_input",
        route_after_validation,
        {
            "collect_ipo_data": "collect_ipo_data",
            "generate_report": "generate_report"
        }
    )
    
    builder.add_edge("collect_ipo_data", "prepare_features")
    builder.add_edge("prepare_features", "predict")
    builder.add_edge("predict", "explain")
    builder.add_edge("explain", "analyze_categories")
    builder.add_edge("analyze_categories", "assess_risk")
    builder.add_edge("assess_risk", "generate_report")
    builder.add_edge("generate_report", END)
    
    return builder.compile()


# Singleton compiled graph instance
_COMPILED_GRAPH = None

def get_ipo_agent_graph():
    global _COMPILED_GRAPH
    if _COMPILED_GRAPH is None:
        _COMPILED_GRAPH = build_ipo_agent_graph()
    return _COMPILED_GRAPH


def run_ipo_analysis(ipo_input: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes the end-to-end Agentic AI analysis graph on an IPO input dictionary.
    """
    graph = get_ipo_agent_graph()
    initial_state: IPOState = {
        "ipo_input": ipo_input,
        "validated_data": {},
        "features": {},
        "feature_metadata": {},
        "predictions": {},
        "shap_explanations": {},
        "category_assessment": {},
        "risk_assessment": {},
        "confidence": {},
        "final_report": {},
        "errors": [],
        "warnings": [],
        "sources": [],
        "status": "INITIALIZED"
    }
    
    final_state = graph.invoke(initial_state)
    return final_state.get("final_report", {})

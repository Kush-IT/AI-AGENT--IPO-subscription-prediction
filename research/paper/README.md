# Pre-IPO Subscription AI Research Paper Package

This directory contains the publication-grade academic research paper, compiled documents, figures, and verified references for the **IPO-Agentic-AI** system.

---

## 1. Paper Overview
* **Title:** *Leakage-Aware Machine Learning and Agentic AI for Pre-IPO Subscription Demand Forecasting Across QIB, NII, Retail, and Total Subscription*
* **Target Audience:** Quantitative Finance, Financial Machine Learning, Decision Support Systems, and Applied AI.
* **Core Dataset:** 106 verified Indian Mainboard IPOs (2021–2024), 45 predictive features, 4 target variables.
* **Key Results:**
  - Total Subscription ($R^2 = +0.666$, $\text{MAE} = 17.43\times$ on quarantined 17-IPO test set).
  - QIB Subscription ($R^2 = +0.589$, $\text{MAE} = 31.43\times$).
  - Pre-open GMP & Sentiment Error Reduction: $41.568\%$.
  - 100% test pass rate across 98 automated verification tests.

---

## 2. Directory Contents

```
research/
├── paper/
│   ├── IPO_Agentic_AI_Research_Paper.md       # Full academic paper manuscript (Markdown)
│   ├── IPO_Agentic_AI_Research_Paper.docx     # Compiled publication-grade Word document
│   ├── IPO_Agentic_AI_Research_Paper.pdf      # Compiled publication-grade PDF document
│   └── README.md                              # This research paper guide
├── figures/
│   ├── fig01_methodology.png                  # Figure 1: Overall research methodology
│   ├── fig02_temporal_leakage.png             # Figure 2: Strict temporal anti-leakage boundary
│   ├── fig03_feature_engineering.png          # Figure 3: Cumulative feature ablation hierarchy
│   ├── fig04_model_architecture.png           # Figure 4: Multi-target regression & transforms
│   ├── fig05_agentic_workflow.png             # Figure 5: LangGraph 8-node agent workflow
│   ├── fig06_connector_architecture.png       # Figure 6: Pre-IPO data connector topology
│   ├── fig07_shap_importance.png              # Figure 7: Global TreeSHAP feature attributions
│   ├── fig08_actual_vs_predicted.png          # Figure 8: Actual vs predicted Total demand
│   ├── fig09_category_comparison.png          # Figure 9: Category demand comparison & 15% rule
│   ├── fig10_system_architecture.png          # Figure 10: End-to-end platform architecture
│   ├── fig11_api_react.png                    # Figure 11: REST API & React interface contract
│   └── fig12_deployment.png                   # Figure 12: Docker containerization topology
├── references/
│   └── verified_references.bib                # 51-reference BibTeX database
├── generate_figures.py                        # Script to re-generate 300 DPI figures
└── compile_documents.py                       # Script to re-compile DOCX and PDF documents
```

---

## 3. How to Re-generate Paper Figures and Documents

### Re-generate Figures (300 DPI PNGs)
```bash
py research/generate_figures.py
```

### Re-compile DOCX and PDF Manuscripts
```bash
py research/compile_documents.py
```
Both `IPO_Agentic_AI_Research_Paper.docx` and `IPO_Agentic_AI_Research_Paper.pdf` will be compiled into `research/paper/`.

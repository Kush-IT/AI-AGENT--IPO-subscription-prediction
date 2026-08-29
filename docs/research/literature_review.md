# Comprehensive Literature Review

**Project:** Pre-IPO Subscription Forecasting Using Machine Learning and Agentic AI: A Category-Wise Prediction Framework for Indian IPOs  
**Scope:** Initial Public Offerings (IPOs), Machine Learning Forecasting, Category-Wise Demand, Sentiment & NLP, Explainable AI (XAI), and Agentic AI Orchestration.

---

## 1. Introduction & Thematic Organization

The academic literature on Initial Public Offerings (IPOs) spans several decades, primarily originating from neoclassical financial economics (information asymmetry, winner's curse, signalling theory) and progressing towards computational finance, machine learning, and multimodal artificial intelligence. 

This literature review evaluates verified peer-reviewed publications and seminal preprints across seven foundational dimensions:
1. **Classical IPO Pricing & Subscription Foundations**
2. **IPO Underpricing and Listing-Day Performance in Emerging Markets (India)**
3. **Machine Learning & Non-Linear Modeling in IPO Forecasting**
4. **Investor Categories & Heterogeneous Bidding Dynamics (QIB, NII, Retail)**
5. **Textual Analysis, Prospectus Mining, and Sentiment Modeling**
6. **Explainable AI (XAI) in Financial Risk & Demand Modeling**
7. **Agentic AI, Multi-Agent Systems, and LLMs in Financial Research**

---

## 2. Detailed Systematic Review of Verified Studies

### 2.1 Classical IPO Pricing & Subscription Foundations

#### Paper 1
* **Title:** Why New Issues Are Underpriced
* **Authors:** Kevin Rock
* **Year:** 1986
* **Journal:** *Journal of Financial Economics*, 15(1-2), 187–212.
* **Dataset:** Theoretical economic modeling of equity issues under asymmetric information.
* **Methodology:** Analytical equilibrium model analyzing uninformed vs. informed investor demand.
* **Target Variable:** Equilibrium underpricing and allocation probability.
* **Important Findings:** Establishes the seminal "Winner's Curse" hypothesis. Uninformed retail investors face adverse selection because informed institutional investors crowd out allocations in high-demand offerings and withdraw from poor-quality offerings.
* **Limitations:** Assumes static equilibrium and does not model multi-tier institutional bidding mechanisms or pre-IPO empirical forecasting.
* **DOI / URL:** https://doi.org/10.1016/0304-405X(86)90054-1

#### Paper 2
* **Title:** Investment Banks as Selectors and Certification Agents in the Initial Public Offering Market
* **Authors:** Thomas J. Chemmanur, Paolo Fulghieri
* **Year:** 1994
* **Journal:** *The Journal of Finance*, 49(1), 57–79.
* **Dataset:** Theoretical equilibrium analysis across underwriter reputation tiers.
* **Methodology:** Dynamic game-theoretic modeling of investment bank reputational capital.
* **Target Variable:** Information production and certification credibility.
* **Important Findings:** High-reputation merchant bankers and underwriters serve as certification mechanisms that mitigate ex-ante uncertainty, directly influencing investor demand and pricing accuracy.
* **Limitations:** Qualitative institutional focus; does not quantify category-wise demand elasticity.
* **DOI / URL:** https://doi.org/10.1111/j.1540-6261.1994.tb04420.x

#### Paper 3
* **Title:** Bookbuilding and Strategic Allocation
* **Authors:** Francesca Cornelli, David Goldreich
* **Year:** 2001
* **Journal:** *The Journal of Finance*, 56(6), 2253–2284.
* **Dataset:** Proprietary bidding records of 39 international equity issues managed by a major European investment bank.
* **Methodology:** Regression analysis of granular institutional bidding schedules, limit orders, and allocation percentages.
* **Target Variable:** Share allocation and book-building demand elasticity.
* **Important Findings:** Institutional investors submitting limit bids and informative pricing signals receive preferential share allocations. Demonstrates that institutional demand differs structurally from non-institutional retail demand.
* **Limitations:** Small sample size (39 issues); focused solely on European institutional books.
* **DOI / URL:** https://doi.org/10.1111/0022-1082.00404

---

### 2.2 IPO Underpricing and Subscription in Indian Markets

#### Paper 4
* **Title:** After Market Pricing Performance of Initial Public Offerings (IPOs): Indian IPO Market 2002–2006
* **Authors:** Seshadev Sahoo, Prabina Rajib
* **Year:** 2010
* **Journal:** *Vikalpa: The Journal for Decision Makers*, 35(4), 27–44.
* **Dataset:** 92 Indian mainline IPOs listed on BSE/NSE between 2002 and 2006.
* **Methodology:** Ordinary Least Squares (OLS) multiple regression, cumulative abnormal returns (CAR).
* **Target Variable:** Initial listing-day return (underpricing) and long-term aftermarket returns (up to 36 months).
* **Important Findings:** Total subscription rate, issue size, promoter retention, and market momentum positively impact listing returns, but initial underpricing often leads to long-run underperformance.
* **Limitations:** Linear statistical models only; treats subscription demand primarily as an independent explanatory feature for returns rather than forecasting subscription itself.
* **DOI / URL:** https://doi.org/10.1177/0256090920100403

#### Paper 5
* **Title:** Determinants of IPOs Initial Return: Extreme Analysis of Indian Market
* **Authors:** Rohit Bansal, Ashima Khanna, et al.
* **Year:** 2012
* **Journal:** *Journal of Financial Risk Management*, 1(4), 68–74.
* **Dataset:** Indian IPOs listed on NSE/BSE during the high-volatility 2007–2011 period.
* **Methodology:** Econometric regression analyzing issuer-specific and market sentiment variables.
* **Target Variable:** Initial listing-day return and subscription intensity.
* **Important Findings:** Oversubscription is the most dominant factor influencing initial listing gains; retail participation is highly sensitive to overall market sentiment and price band levels.
* **Limitations:** Limited feature set; lacks category-level decomposition (QIB vs NII vs Retail).
* **DOI / URL:** https://doi.org/10.4236/jfrm.2012.14011

#### Paper 6
* **Title:** Group Affiliation and the Performance of Initial Public Offerings in the Indian Stock Market
* **Authors:** Vijaya B. Marisetty, Marti G. Subrahmanyam
* **Year:** 2010
* **Journal:** *Journal of Financial Markets*, 13(1), 196–223.
* **Dataset:** 434 Indian IPOs from 1990 to 2004.
* **Methodology:** Cross-sectional regression, parametric/non-parametric tests for business group affiliation.
* **Target Variable:** Initial underpricing, post-listing survival, and investor subscription.
* **Important Findings:** Standalone firms exhibit higher underpricing and volatility than business group-affiliated firms (e.g., Tata, Birla), indicating that corporate backing acts as a trust signal that stabilizes demand.
* **Limitations:** Covers pre-bookbuilding and early bookbuilding regulatory eras; does not utilize modern machine learning.
* **DOI / URL:** https://doi.org/10.1016/j.finmar.2009.09.003

#### Paper 7
* **Title:** Pricing and Performance Evaluation of Initial Public Offerings (IPO's): Evidence from Indian Stock Markets
* **Authors:** Amar Sakharkar, Babaji Ramesh
* **Year:** 2019
* **Journal:** *International Journal of Research and Analytical Reviews (IJRAR)*, 6(2), 290–298.
* **Dataset:** 290 Indian IPOs from 2007 to 2017.
* **Methodology:** Univariate and multivariate econometric regression.
* **Target Variable:** Short-term raw returns and listing-day performance.
* **Important Findings:** Significant initial underpricing (average 17.90%), with issue size and offer pricing strongly correlating with investor subscription; IPOs after regulatory reforms in 2013 exhibited tighter pricing bands and improved market efficiency.
* **Limitations:** Focuses on post-listing returns rather than modeling pre-IPO subscription demand distributions.
* **DOI / URL:** http://doi.one/10.1729/Journal.20869

#### Paper 8
* **Title:** Initial Public Offerings in India – A Structural Review
* **Authors:** J. Seepani, K. Murthy
* **Year:** 2023
* **Journal:** *European Journal of Economic and Financial Research*, 7(2), 45–68.
* **Dataset:** Systematic structural review of Indian IPO issuances across 2000–2023.
* **Methodology:** Qualitative and quantitative structural synthesis of regulatory reforms, technology adoption (UPI-based ASBA), and retail participation trends.
* **Target Variable:** IPO volume, pricing mechanisms, and investor distribution shifts.
* **Important Findings:** Digitalization and UPI mandate implementation dramatically accelerated retail retail investor entry; highlighted the need for pre-IPO investor education and predictive decision-support systems.
* **Limitations:** Review-level structural analysis; does not provide algorithmic prediction models.
* **DOI / URL:** https://doi.org/10.46827/ejefr.v7i2.1465

---

### 2.3 Investor Categories & Heterogeneous Bidding Dynamics

#### Paper 9
* **Title:** Effects of IPO Offer Price Ranges on Initial Subscription, Initial Turnover and Ownership Structure — Evidence from Indian IPO Market
* **Authors:** Harvinder Sandhu, K. Guhathakurta
* **Year:** 2020
* **Journal:** *Journal of Risk and Financial Management*, 13(11), 279.
* **Dataset:** 248 Indian book-built IPOs from 2008 to 2018.
* **Methodology:** Tobit regression, piecewise linear regression, and category-level demand elasticity tests.
* **Target Variable:** QIB subscription rate, NII subscription rate, and Retail subscription rate.
* **Important Findings:** Investor categories exhibit distinct behavioral drivers: QIBs prioritize financial fundamentals and issue valuation; Retail investors are disproportionately attracted to low nominal share prices and high grey market buzz; NIIs operate as high-leverage momentum chasers.
* **Limitations:** Evaluated historical linear relationships; did not construct an automated pre-IPO predictive ML framework.
* **DOI / URL:** https://doi.org/10.3390/jrfm13110279

#### Paper 10
* **Title:** Analysis of Investor Behavior in IPOs: Flipping Trends and Allotment Dynamics
* **Authors:** Securities and Exchange Board of India (SEBI) Research Study
* **Year:** 2024
* **Journal:** *SEBI Study on Retail and HNI Participation in IPOs (Policy Research Report)*.
* **Dataset:** All mainline and SME IPOs listed on Indian exchanges between April 2021 and December 2023.
* **Methodology:** Population-level transactional analysis of demat account allocations, exit timing, and subscription multiples.
* **Target Variable:** Allotment retention, exit within 7 days, and category oversubscription.
* **Important Findings:** Over 54% of allocated IPO shares in the retail category are sold ("flipped") within the first week of listing; extreme oversubscription in NII and Retail categories significantly reduces individual allotment probability to near-lottery levels.
* **Limitations:** Retrospective policy report; does not implement predictive machine learning architectures.
* **URL:** https://www.sebi.gov.in/reports-and-statistics/research-studies/sep-2024/study-on-investor-behavior-in-initial-public-offerings-ipos.html

---

### 2.4 Machine Learning & Computational Models for IPO Forecasting

#### Paper 11
* **Title:** Analyzing Initial Public Offerings’ Short-Term Performance Using Decision Trees and SVMs
* **Authors:** Ertugrul Bastı, Cemil Kuzey, Dursun Delen
* **Year:** 2015
* **Journal:** *Decision Support Systems*, 73, 15–27.
* **Dataset:** 142 IPOs on Borsa Istanbul (BIST).
* **Methodology:** Decision Trees (C5.0, CART), Support Vector Machines (SVM), and Logistic Regression.
* **Target Variable:** Binary short-term IPO performance classification (positive vs. negative initial return).
* **Important Findings:** Machine learning non-linear algorithms (SVM, Decision Trees) significantly outperform conventional econometric regression; non-linear interactions between financial ratios and market sentiment determine IPO success.
* **Limitations:** Small sample size; binary classification target rather than continuous multi-category subscription forecasting.
* **DOI / URL:** https://doi.org/10.1016/j.dss.2015.02.011

#### Paper 12
* **Title:** Predicting IPO Initial Returns Using Random Forest
* **Authors:** Bora Baba, Güven Sevil
* **Year:** 2020
* **Journal:** *Borsa Istanbul Review*, 20(1), 13–23.
* **Dataset:** 168 IPOs listed between 2010 and 2018.
* **Methodology:** Random Forest Regressor and Classifier, compared against OLS and Multiple Discriminant Analysis.
* **Target Variable:** Initial return percentage and listing-day classification.
* **Important Findings:** Random Forest achieves lower RMSE and higher directional accuracy than linear models; ensemble tree-based models effectively capture non-linear relationships and interactions among macroeconomic and financial covariates.
* **Limitations:** Did not evaluate modern gradient boosting algorithms (XGBoost, LightGBM) or feature explainability tools (SHAP).
* **DOI / URL:** https://doi.org/10.1016/j.bir.2019.08.001

#### Paper 13
* **Title:** An Interpretable Neural Fuzzy Inference System for Predictions of Underpricing in Initial Public Offerings
* **Authors:** Dingding Wang, Xiangqian Qian, Chai Quek, Ah-Hwee Tan, Chunyan Miao, Xiao Zhang, Geok See Ng, Ying Zhou
* **Year:** 2018
* **Journal:** *Neurocomputing*, 319, 102–117.
* **Dataset:** 350 US and Asian IPOs across varied market cycles.
* **Methodology:** Self-organizing neural fuzzy inference networks (interpretable rule generation).
* **Target Variable:** Continuous IPO underpricing magnitude.
* **Important Findings:** Interpretability is crucial in high-stakes financial deployment; fuzzy rule extraction reveals that valuation ratios (P/E, EV/EBITDA) interact with prevailing market index volatility to drive initial investor demand.
* **Limitations:** High computational complexity; lacks integration with unstructured news/prospectus text.
* **DOI / URL:** https://doi.org/10.1016/j.neucom.2018.07.036

---

### 2.5 Textual Analysis, Prospectus Mining, and Sentiment Modeling

#### Paper 14
* **Title:** Media Sentiment and IPO Underpricing
* **Authors:** Emanuele Bajo, Carmine Raimondo
* **Year:** 2017
* **Journal:** *Journal of Corporate Finance*, 46, 139–153.
* **Dataset:** 1,568 US IPOs from 2000 to 2012 matched with pre-IPO news articles from major publications.
* **Methodology:** Lexical sentiment analysis (Loughran & McDonald financial dictionary) and panel regression.
* **Target Variable:** Pre-IPO retail investor interest, IPO oversubscription, and initial return.
* **Important Findings:** Pre-IPO media tone significantly amplifies retail investor attention and oversubscription; high positive media coverage is associated with elevated first-day gains driven by uninformed retail demand.
* **Limitations:** Restricted to dictionary-based sentiment scoring; does not leverage modern transformer-based embeddings or LLMs.
* **DOI / URL:** https://doi.org/10.1016/j.jcorpfin.2017.06.003

#### Paper 15
* **Title:** Do Words Matter: Predicting IPO Performance from Prospectus Sentiment
* **Authors:** Thien Hai Ly, Kiem Nguyen
* **Year:** 2020
* **Journal:** *2020 IEEE 14th International Conference on Semantic Computing (ICSC)*, 307–310.
* **Dataset:** 824 SEC S-1 prospectus filings from US IPOs (2010–2018).
* **Methodology:** NLP feature extraction, term frequency-inverse document frequency (TF-IDF), RoBERTa embeddings, and Support Vector Regression.
* **Target Variable:** First-day return and offer-to-close performance.
* **Important Findings:** Risk disclosure sections and management discussion text contain predictive incremental signal beyond numerical balance-sheet metrics.
* **Limitations:** Focused on US regulatory filings; did not segment predictions across institutional vs. retail subscription categories.
* **DOI / URL:** https://doi.org/10.1109/ICSC.2020.00061

#### Paper 16
* **Title:** Experimenting with Multi-modal Information to Predict Success of Indian IPOs
* **Authors:** Sohom Ghosh, Arnab Maji, N Harsha Vardhan, Sudip Kumar Naskar
* **Year:** 2024
* **Journal:** *arXiv preprint arXiv:2412.16174v1 [cs.CL]* (Preprint, Dec 2024).
* **Dataset:** 418 Main Board IPOs (2009–2023) and 681 SME IPOs (2017–2023) listed on BSE/NSE.
* **Methodology:** Multimodal fusion combining structured financials, macroeconomic indicators, RAG-extracted prospectus Q&A (Nomic embeddings + LLaMA 3.2), fine-tuned DeBERTa classification, and AutoML ensembles (GLM, DRF, XGBoost, GBM, Deep Learning).
* **Target Variable:** Directional movement and underpricing of Opening, High, and Closing prices on listing day.
* **Important Findings:** Machine learning ensembles combining structured financial indicators and text embeddings outperform zero-shot LLMs (Gemini-1.5-Flash, LLaMA-3.2-3B). Grey Market Premium (GMP) strongly correlates with listing day performance for Main Board IPOs (80.29% accuracy) but performs poorly for SME IPOs (21.29% accuracy).
* **Limitations:** Target variables focus exclusively on listing-day price movements (classification and price percentage); does not predict continuous pre-IPO category-wise subscription multiples (QIB, NII, Retail), lacks an allotment optimizer, and does not implement autonomous multi-agent orchestration.
* **DOI / URL:** https://arxiv.org/abs/2412.16174

---

### 2.6 Explainable AI & Machine Learning in Financial Modeling

#### Paper 17
* **Title:** A Unified Approach to Interpreting Model Predictions
* **Authors:** Scott M. Lundberg, Su-In Lee
* **Year:** 2017
* **Journal:** *Advances in Neural Information Processing Systems (NeurIPS 2017)*, 30, 4765–4774.
* **Dataset:** Benchmark tabular, imaging, and genomic datasets.
* **Methodology:** Shapley Additive Explanations (SHAP), uniting cooperative game theory with local surrogate explanations.
* **Target Variable:** Local and global model feature attributions.
* **Important Findings:** Proves that TreeSHAP satisfies efficiency, symmetry, dummy, and additivity properties, enabling consistent, mathematically rigorous feature attribution for tree-based ensemble models (XGBoost, LightGBM, Random Forest).
* **Limitations:** General ML explainability framework; requires careful domain-specific translation when applied to multi-target financial forecasting.
* **URL:** https://papers.nips.cc/paper/7062-a-unified-approach-to-interpreting-model-predictions

---

### 2.7 Agentic AI & LLMs in Financial Research

#### Paper 18
* **Title:** The FinBen: An Holistic Financial Benchmark for Large Language Models
* **Authors:** Qianqian Xie, Weiguang Han, Zhengyu Chen, Ruoyu Xiang, Xiao Zhang, Yueru He, Mengxi Xiao, Dong Li, Yongfu Dai, Duanyu Feng, et al.
* **Year:** 2024
* **Journal:** *arXiv preprint arXiv:2402.12659* (Preprint, Feb 2024).
* **Dataset:** 23 financial NLP tasks spanning sentiment analysis, quantitative forecasting, risk assessment, and financial reasoning across 35 datasets.
* **Methodology:** Comprehensive benchmark evaluation of proprietary and open-source LLMs (GPT-4, Claude-3, LLaMA-2/3, FinMA) across zero-shot and retrieval-augmented settings.
* **Target Variable:** Financial entity extraction, numeric reasoning, sentiment classification, stock movement prediction.
* **Important Findings:** Standalone LLMs struggle with precise continuous numerical forecasting without access to specialized domain-specific ML regression tools, but excel at unstructured contextual synthesis and multi-step reasoning.
* **Limitations:** Evaluates individual model capabilities rather than collaborative multi-agent workflow systems.
* **DOI / URL:** https://arxiv.org/abs/2402.12659

#### Paper 19
* **Title:** Open-FinLLMs: Open Multimodal Large Language Models for Financial Applications
* **Authors:** Qianqian Xie, Dong Li, Mengxi Xiao, Zihao Jiang, Ruoyu Xiang, Xiao Zhang, Zhengyu Chen, Yueru He, Weiguang Han, Yuting Yang, et al.
* **Year:** 2024
* **Journal:** *arXiv preprint arXiv:2408.11878* (Preprint, Aug 2024).
* **Dataset:** Financial multimodal benchmark spanning financial charts, text reports, balance sheets, and macroeconomic indicators.
* **Methodology:** Multimodal alignment and instruction tuning for open-source financial LLMs.
* **Target Variable:** Financial document comprehension, tabular analysis, and financial reasoning.
* **Important Findings:** Integrating domain-specific structured tabular data with textual document streams significantly enhances financial comprehension compared to text-only LLMs.
* **Limitations:** Focuses on model weights and multimodal pretraining rather than agentic tool calling and multi-agent coordination frameworks (e.g., LangGraph).
* **DOI / URL:** https://arxiv.org/abs/2408.11878

---

## 3. Summary of Key Findings from Existing Literature

| Research Dimension | Dominant Approaches in Literature | Key Consensus Findings | Remaining Open Questions |
|---|---|---|---|
| **IPO Subscription** | OLS regression, univariate correlation (Sahoo & Rajib 2010; Bansal et al. 2012) | Subscription volume directly drives listing-day underpricing. | Can continuous subscription multiples be predicted *before* the issue opens? |
| **Category Breakdown** | Descriptive analysis, Tobit models (Sandhu & Guhathakurta 2020; SEBI 2024) | Institutional (QIB), HNI (NII), and Retail investors exhibit sharply diverging bidding objectives. | Can distinct ML models accurately forecast category-specific demand elasticity? |
| **Machine Learning** | Random Forest, SVM, AutoML (Bastı et al. 2015; Baba & Sevil 2020; Ghosh et al. 2024) | Tree ensembles and boosting outperform linear and zero-shot LLM baselines. | Which gradient boosting family (XGBoost vs. LightGBM) excels under skewed target distributions? |
| **Sentiment & Prospectus** | Loughran-McDonald lexicon, RoBERTa, RAG (Bajo & Raimondo 2017; Ly & Nguyen 2020) | Prospectus risks and media buzz provide incremental predictive signal beyond financials. | How to reliably integrate unstructured news sentiment with pre-IPO tabular metrics? |
| **Explainability** | Linear coefficients, Fuzzy rules (Wang et al. 2018) | Black-box financial predictions require granular local feature attribution. | How do TreeSHAP attributions vary between institutional and retail demand models? |
| **Agentic AI** | LLM benchmarks, zero-shot prompting (Xie et al. 2024a, 2024b) | Standalone LLMs fail at exact regression but excel at reasoning and workflow synthesis. | Can a LangGraph multi-agent architecture orchestrate end-to-end IPO research and prediction? |

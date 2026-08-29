# Pre-IPO Data Connectors & Source Traceability Architecture

## 1. Architecture Overview
The **Data Connector Layer** provides modular, decoupled data ingestion interfaces for Indian Mainboard IPOs while enforcing strict **ex-ante temporal boundary verification**.

```mermaid
graph TD
    subgraph ExternalSources [Authoritative Pre-IPO Data Providers]
        S1["SEBI DRHP/RHP Filings"]
        S2["NSE/BSE Market Data"]
        S3["Capitaline Listed Peers"]
        S4["FinBERT News Crawlers"]
        S5["Grey Market Aggregators"]
        S6["Historical Mainboard Dataset"]
    end
    subgraph ConnectorLayer [Modular Connectors (backend/connectors/)]
        C1["IPOConnector"]
        C2["MarketConnector"]
        C3["FinancialConnector"]
        C4["NewsConnector"]
        C5["GMPConnector"]
        C6["HistoricalConnector"]
    end
    subgraph ValidationAndCache [Temporal Integrity & Caching Layer]
        TV["TemporalValidator (observed_at <= cutoff)"]
        CM["CacheManager (data/cache/)"]
    end
    subgraph AgentState [Agent State & Output]
        AS["ProvenanceRecord (value, source, timestamps, status)"]
    end

    S1 --> C1
    S2 --> C2
    S3 --> C3
    S4 --> C4
    S5 --> C5
    S6 --> C6

    C1 & C2 & C3 & C4 & C5 & C6 --> TV
    C1 & C2 & C3 & C4 & C5 & C6 <--> CM
    TV --> AS
```

---

## 2. Granular Field Provenance Schema

Every extracted feature is wrapped in a `ProvenanceRecord` preserving origin and verification timestamps:

```json
{
  "field": "gmp_percentage",
  "value": 35.5,
  "source": "Ex-Ante Grey Market Aggregator (Chittorgarh/IPOWatch)",
  "source_url": "https://www.chittorgarh.com/report/ipo-grey-market-premium-gmp/24/",
  "observed_at": "2024-05-15T08:30:00+05:30",
  "feature_cutoff": "2024-05-15T09:59:59+05:30",
  "retrieved_at": "2024-05-15T08:31:05+05:30",
  "status": "VALID",
  "validation_status": "EX_ANTE_VALID",
  "validation_reason": "EX_ANTE_VALID"
}
```

---

## 3. Temporal Validation Policy & Look-Ahead Rejection

The `TemporalValidator` enforces the fundamental quantitative finance constraint:
\[
t_{\text{observed}} \le t_{\text{cutoff}} \quad (\text{where } t_{\text{cutoff}} = \text{ipo\_open\_date} \parallel \text{09:59:59 IST})
\]

### Rejection Behavior:
- **Future Prospectus / Annual Reports**: If a financial report was published after the open date, it is rejected (`validation_status = "TEMPORAL_REJECTED"`).
- **Future News Articles**: If an article timestamp \(> t_{\text{cutoff}}\), it is discarded from sentiment calculations.
- **Future Market Data**: Only closing index prices and VIX prior to subscription open are accepted.
- **Historical Subscriptions**: `HistoricalConnector` strictly enforces \(\text{ipo\_open\_date} < \text{target\_open\_date}\).

---

## 4. Local Disk Caching (`data/cache/`)
- Cache keys are generated deterministically:
  \[
  \text{Key} = \operatorname{SHA256}(\text{Source} \parallel \text{Company} \parallel \text{Date})[:16]
  \]
- Cached entries store full provenance records and never bypass temporal validation upon reload.

---

## 5. Offline vs. Live Modes
- **Offline Mode (`OFFLINE_MODE=True`)**: Connectors resolve parameters from cached snapshots and deterministic test fixtures, guaranteeing 100% offline unit test reproducibility without network dependencies.
- **Live Mode (`LIVE_MODE=True`)**: Connectors fetch from authoritative public feeds with timeout, rate-limiting, and 3-stage exponential backoff.

import React from 'react';
import { BookOpen, Brain, Sparkles, Clock, AlertTriangle } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', marginBottom: '0.75rem' }}>
          <BookOpen size={24} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          About the Pre-IPO Subscription AI System
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          A quantitative research framework combining audited prospectus disclosures, secondary market momentum, FinBERT financial sentiment, and ex-ante grey market intelligence to forecast category-wise subscription demand on Indian Mainboard IPOs.
        </p>
      </div>

      {/* 1. Core Methodology */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>
          <Clock size={20} color="var(--brand-primary)" />
          <span>Strict Pre-IPO Temporal Boundary (Ex-Ante Invariance)</span>
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          The foundational quantitative principle of this system is that <strong>no future or post-open information</strong> may ever contaminate the predictive feature set. Every observation is strictly bound to:
        </p>
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderRadius: '6px', borderLeft: '4px solid var(--brand-primary)', fontFamily: 'JetBrains Mono', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          t_observed ≤ 09:59:59 IST on ipo_open_date
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Subsequent intraday subscription tallies, anchor lock-in events, or listing prices are strictly prevented from influencing model inferences.
        </p>
      </div>

      {/* 2. Machine Learning Architecture */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>
          <Brain size={20} color="var(--brand-primary)" />
          <span>Frozen Multi-Target Regression Architecture</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL SUBSCRIPTION</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>XGBoost (log1p transform)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-positive)', fontWeight: 600 }}>Test R² = +0.666 • MAE = 17.43×</div>
          </div>

          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>QIB (INSTITUTIONAL)</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Random Forest (RAW scale)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-positive)', fontWeight: 600 }}>Test R² = +0.589 • MAE = 31.43×</div>
          </div>

          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>NII (HNI / CORPORATE)</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>LightGBM (log1p transform)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expanding Walk-Forward CV</div>
          </div>

          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RETAIL INDIVIDUAL</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>XGBoost (RAW scale)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expanding Walk-Forward CV</div>
          </div>
        </div>
      </div>

      {/* 3. Explainability */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>
          <Sparkles size={20} color="var(--brand-primary)" />
          <span>TreeSHAP Additive Explainability Engine</span>
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
          Model predictions are decomposed using <strong>TreeSHAP (SHapley Additive exPlanations)</strong>, quantifying the precise numerical contribution of each feature towards deviating the prediction from the historical base rate.
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          All attributions are expressed in observational, non-causal language (e.g. <em>"feature X contributed +Y times relative to baseline"</em>).
        </p>
      </div>

      {/* 4. Limitations */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>
          <AlertTriangle size={20} color="var(--accent-warning)" />
          <span>Known Research Limitations</span>
        </h3>
        <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
          <li><strong>Ex-Ante Window:</strong> Live order book velocity and institutional intraday bids unfolding during the 3-day offer period are not captured by pre-open models.</li>
          <li><strong>Extreme Distribution Tails:</strong> Ultra-hype IPOs exceeding 150× subscription fall in sparse historical tail regions where predictions carry wider uncertainty bands.</li>
          <li><strong>Grey Market Dynamics:</strong> Unofficial GMP rates reflect dealer quotes and may exhibit liquidity dispersion across geographic trading hubs.</li>
        </ul>
      </div>
    </div>
  );
};

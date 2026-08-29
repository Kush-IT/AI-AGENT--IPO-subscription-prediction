import React, { useEffect, useState } from 'react';
import { Loader2, Database, Brain, Sparkles, FileText } from 'lucide-react';

const STAGES = [
  { label: 'Validating & Collecting Pre-IPO Data...', icon: Database },
  { label: 'Executing Frozen Machine Learning Models...', icon: Brain },
  { label: 'Calculating TreeSHAP Feature Attributions...', icon: Sparkles },
  { label: 'Auditing Risks & Synthesizing Research Report...', icon: FileText },
];

export const LoadingState: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const IconComponent = STAGES[currentStage].icon;

  return (
    <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
      <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', marginBottom: '1.25rem' }}>
        <Loader2 className="animate-spin" size={36} />
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        Analyzing Pre-IPO Dynamics
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--brand-primary)', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.5rem' }}>
        <IconComponent size={18} />
        <span>{STAGES[currentStage].label}</span>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '1.25rem', maxWidth: '400px', margin: '1.25rem auto 0 auto' }}>
        Enforcing strict ex-ante cutoff (09:59:59 IST). External connectors and multi-target regressors are currently running.
      </p>
    </div>
  );
};

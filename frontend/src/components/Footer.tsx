import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="main-content" style={{ marginTop: 'auto', paddingTop: '1rem', paddingBottom: '2rem' }}>
      <div className="disclaimer-banner">
        <strong>Regulatory & Research Disclaimer:</strong> This system provides model-based pre-IPO subscription demand estimates for research and educational purposes only. It does not constitute investment, legal, or financial advice and does not guarantee subscription levels, allotment probability, listing gains, or investment returns. All predictions reflect quantitative ex-ante inferences observed strictly prior to 09:59:59 IST on subscription opening date.
      </div>
    </footer>
  );
};

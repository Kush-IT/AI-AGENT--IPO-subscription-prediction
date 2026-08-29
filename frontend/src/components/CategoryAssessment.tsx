import React from 'react';
import { Target } from 'lucide-react';
import { CategoryAssessmentData } from '../api/types';
import { formatMultiple } from '../utils/formatting';

interface CategoryAssessmentProps {
  assessment: CategoryAssessmentData;
}

export const CategoryAssessment: React.FC<CategoryAssessmentProps> = ({ assessment }) => {
  const isNoClearEdge = assessment.recommended_category === 'NO_CLEAR_EDGE';

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <h3 className="card-title">
          <Target size={18} color="var(--brand-primary)" />
          <span>Category Demand Assessment</span>
        </h3>
        <span className={`badge ${isNoClearEdge ? 'badge-neutral' : 'badge-high'}`}>
          {isNoClearEdge ? 'Narrow Parity' : `Leading: ${assessment.recommended_category}`}
        </span>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
          Strongest Predicted Demand Category:
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            {assessment.strongest_predicted_category}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            (Weakest: {assessment.weakest_predicted_category})
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '0.4rem', lineHeight: 1.4 }}>
          {assessment.edge_rationale}
        </p>
      </div>

      <div>
        <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Relative Demand Ranking
        </h4>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Rank</th>
                <th>Investor Class</th>
                <th style={{ textAlign: 'right' }}>Predicted Multiple</th>
              </tr>
            </thead>
            <tbody>
              {assessment.category_ranking.map((item) => (
                <tr key={item.category}>
                  <td style={{ fontWeight: 700 }}>#{item.rank}</td>
                  <td style={{ fontWeight: 600 }}>{item.category}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                    {formatMultiple(item.predicted_multiple)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
        {assessment.disclaimer}
      </div>
    </div>
  );
};

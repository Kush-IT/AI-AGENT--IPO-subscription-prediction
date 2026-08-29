import React from 'react';
import { Users, Building2, UserCheck, TrendingUp } from 'lucide-react';
import { IPOAnalysisResponse } from '../api/types';
import { formatMultiple } from '../utils/formatting';

interface PredictionCardsProps {
  data: IPOAnalysisResponse;
}

export const PredictionCards: React.FC<PredictionCardsProps> = ({ data }) => {
  const { predictions } = data;

  const cards = [
    {
      id: 'qib',
      title: 'QIB Subscription',
      category: 'Institutional (QIB)',
      icon: Building2,
      data: predictions.qib_subscription,
      color: '#2563eb',
      isTotal: false,
    },
    {
      id: 'nii',
      title: 'NII Subscription',
      category: 'Non-Institutional / HNI',
      icon: Users,
      data: predictions.nii_subscription,
      color: '#7c3aed',
      isTotal: false,
    },
    {
      id: 'retail',
      title: 'Retail Subscription',
      category: 'Retail Individual (RII)',
      icon: UserCheck,
      data: predictions.retail_subscription,
      color: '#059669',
      isTotal: false,
    },
    {
      id: 'total',
      title: 'Total Subscription',
      category: 'Overall Offering',
      icon: TrendingUp,
      data: predictions.total_subscription,
      color: '#1e3a8a',
      isTotal: true,
    },
  ];

  return (
    <div>
      <div className="prediction-grid">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.id} className={`pred-card ${card.isTotal ? 'total' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <IconComponent size={16} color={card.color} />
                <span className="pred-category">{card.category}</span>
              </div>
              <div className="pred-value" style={{ color: card.isTotal ? '#1d4ed8' : 'var(--text-main)' }}>
                {formatMultiple(card.data.predicted_multiple)}
              </div>
              <div className="pred-subtitle">
                Model: <span className="mono">{card.data.model_name}</span> ({card.data.target_transform})
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

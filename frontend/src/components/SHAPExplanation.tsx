import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { SHAPContributor, GroupedDriverImpact } from '../api/types';
import { formatSHAP } from '../utils/formatting';

interface SHAPExplanationProps {
  topPositive: SHAPContributor[];
  topNegative: SHAPContributor[];
  groupedDrivers?: Record<string, GroupedDriverImpact>;
}

export const SHAPExplanation: React.FC<SHAPExplanationProps> = ({
  topPositive,
  topNegative,
  groupedDrivers,
}) => {
  // Combine into unified chart dataset sorted by absolute attribution
  const allDrivers = [...topPositive, ...topNegative].sort(
    (a, b) => b.shap_value - a.shap_value
  );

  const chartData = allDrivers.map((d) => ({
    name: d.feature.replace(/_/g, ' '),
    rawFeature: d.feature,
    value: d.shap_value,
    featureValue: d.feature_value,
    direction: d.direction,
    statement: d.attribution_statement,
  }));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Sparkles size={18} color="var(--brand-primary)" />
            <span>SHAP Feature Attributions (Total Model)</span>
          </h3>
          <p className="card-subtitle">
            Additive contributions relative to historical baseline demand (Observational, non-causal)
          </p>
        </div>
      </div>

      {/* Grouped Driver Summary */}
      {groupedDrivers && Object.keys(groupedDrivers).length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {Object.entries(groupedDrivers).map(([driverName, dData]) => {
            const isPos = dData.total_shap_impact >= 0;
            return (
              <div
                key={driverName}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: isPos ? 'var(--accent-positive-bg)' : 'var(--accent-negative-bg)',
                  border: `1px solid ${isPos ? '#a7f3d0' : '#fecaca'}`,
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {driverName.replace(/_/g, ' ')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  {isPos ? <TrendingUp size={14} color="var(--accent-positive)" /> : <TrendingDown size={14} color="var(--accent-negative)" />}
                  <span style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'JetBrains Mono', color: isPos ? 'var(--accent-positive)' : 'var(--accent-negative)' }}>
                    {formatSHAP(dData.total_shap_impact)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SHAP Horizontal Contribution Chart */}
      <div style={{ width: '100%', height: 260, marginTop: '0.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" tickFormatter={(val) => val.toFixed(2)} style={{ fontSize: '0.75rem' }} />
            <YAxis
              type="category"
              dataKey="name"
              width={95}
              style={{ fontSize: '0.75rem', fontWeight: 500 }}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number, _name: string, props: { payload?: { statement?: string } }) => [
                `${formatSHAP(value)} contribution`,
                props.payload?.statement || 'Attribution',
              ]}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <ReferenceLine x={0} stroke="#94a3b8" />
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value >= 0 ? '#059669' : '#dc2626'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory statements */}
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-positive)', marginBottom: '0.4rem' }}>
            Top Positive Model Contributions
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {topPositive.map((f, i) => (
              <li key={i} style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                <strong>{f.feature}</strong> ({f.feature_value}): <span className="mono" style={{ color: 'var(--accent-positive)', fontWeight: 600 }}>+{f.shap_value.toFixed(4)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-negative)', marginBottom: '0.4rem' }}>
            Top Negative Model Contributions
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {topNegative.map((f, i) => (
              <li key={i} style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                <strong>{f.feature}</strong> ({f.feature_value}): <span className="mono" style={{ color: 'var(--accent-negative)', fontWeight: 600 }}>{f.shap_value.toFixed(4)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

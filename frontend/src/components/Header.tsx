import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BarChart3 } from 'lucide-react';
import { ipoApi } from '../api/ipoApi';

export const Header: React.FC = () => {
  const location = useLocation();

  const { data: healthData, isError } = useQuery({
    queryKey: ['health'],
    queryFn: ipoApi.getHealth,
    refetchInterval: 15000, // Poll health every 15s
  });

  const isOnline = !isError && healthData?.status === 'HEALTHY';

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand-section">
          <div className="brand-icon">
            <BarChart3 size={20} />
          </div>
          <div>
            <h1 className="brand-title">IPO Subscription AI</h1>
            <p className="brand-subtitle">Pre-IPO Subscription Demand Prediction & Explainability</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/monitoring"
            className={`nav-link ${location.pathname === '/monitoring' ? 'active' : ''}`}
          >
            Monitoring & Drift
          </Link>
          <Link
            to="/about"
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            About & Methodology
          </Link>

          <div className={`api-badge ${isOnline ? 'online' : ''}`} title={healthData ? `Backend v${healthData.version} (${healthData.environment})` : 'Backend connection pending'}>
            <span className={`status-dot ${isOnline ? 'online' : ''}`} />
            <span>API: {isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

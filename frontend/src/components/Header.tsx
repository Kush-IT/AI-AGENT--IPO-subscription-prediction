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
            to="/model-prediction"
            className={`nav-link ${location.pathname === '/model-prediction' ? 'active' : ''}`}
          >
            Model &amp; Prediction
          </Link>
          <Link
            to="/diagrams"
            className={`nav-link ${location.pathname === '/diagrams' ? 'active' : ''}`}
          >
            Diagrams
          </Link>
          <Link
            to="/data-flow"
            className={`nav-link ${location.pathname === '/data-flow' ? 'active' : ''}`}
          >
            Data Flow
          </Link>
          <Link
            to="/about"
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            About &amp; Methodology
          </Link>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            title="Open Interactive FastAPI Swagger Documentation"
          >
            API Docs
          </a>

          <div className={`api-badge ${isOnline ? 'online' : ''}`} title={healthData ? `Backend v${healthData.version} (${healthData.environment})` : 'Backend connection pending'}>
            <span className={`status-dot ${isOnline ? 'online' : ''}`} />
            <span>API: {isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

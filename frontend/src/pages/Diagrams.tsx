import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Navigate, Link } from 'react-router-dom';
import { Search, Layers, Shield, FileText, CheckCircle } from 'lucide-react';
import { DIAGRAMS_DATA } from '../components/diagrams/diagramData';
import { DiagramCategory, DiagramItem } from '../components/diagrams/types';
import { DiagramModal } from '../components/diagrams/DiagramModal';
import { GovernancePanels } from '../components/diagrams/GovernancePanels';

const CATEGORIES: DiagramCategory[] = [
  'All Diagrams',
  'Architecture',
  'UML',
  'Database',
  'Security',
  'Deployment',
  'CI/CD',
  'Monitoring',
  'ML Architecture',
  'Agentic AI',
  'Governance',
];

export const Diagrams: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  // Phase 2: Redirect legacy /diagrams?category=Data%20Flow to /data-flow
  if (categoryFromUrl === 'Data Flow' || categoryFromUrl === 'Data%20Flow') {
    return <Navigate to="/data-flow" replace />;
  }

  const [selectedCategory, setSelectedCategory] = useState<DiagramCategory>(() => {
    if (categoryFromUrl && (CATEGORIES as string[]).includes(categoryFromUrl)) {
      return categoryFromUrl as DiagramCategory;
    }
    return 'All Diagrams';
  });

  useEffect(() => {
    if (categoryFromUrl && (CATEGORIES as string[]).includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl as DiagramCategory);
    }
  }, [categoryFromUrl]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalDiagram, setActiveModalDiagram] = useState<DiagramItem | null>(null);

  // Filter diagrams by category & search query
  const filteredDiagrams = useMemo(() => {
    return DIAGRAMS_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All Diagrams' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', paddingBottom: '4rem' }}>
      {/* Hero Banner */}
      <div className="diagram-hero-banner">
        <div className="diagram-hero-inner">
          <div>
            <div className="diagram-badge-group">
              <span className="diagram-badge-pill diagram-badge-emerald">
                <CheckCircle size={13} />
                Research &amp; Engineering Documentation
              </span>
              <span className="diagram-badge-pill diagram-badge-slate">
                {DIAGRAMS_DATA.length} Architecture Diagrams
              </span>
            </div>
            <h1 className="diagram-hero-title">
              System Diagrams &amp; Architecture Documentation
            </h1>
            <p className="diagram-hero-subtitle">
              Formal software engineering, architecture, UML, database, security, deployment, monitoring, and AI system documentation.
            </p>
          </div>

          <div className="diagram-hero-actions">
            <Link to="/data-flow" className="diagram-btn-primary">
              <Layers size={15} />
              Explore Data Flow &rarr;
            </Link>
            <a href="#governance-section" className="diagram-btn-secondary">
              <Shield size={15} />
              Model Governance
            </a>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="diagram-btn-secondary"
              title="Open Interactive FastAPI Swagger Documentation"
            >
              <FileText size={15} />
              API Documentation
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Filter Bar & Search */}
        <div className="diagram-control-box">
          <div className="diagram-search-row">
            {/* Search Input */}
            <div className="diagram-search-wrapper">
              <Search size={16} className="diagram-search-icon" />
              <input
                type="text"
                placeholder="Search diagrams by title, tag, or technology (e.g. UML, ER, Docker, PSI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="diagram-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              <strong style={{ color: '#0f172a' }}>{filteredDiagrams.length}</strong> of {DIAGRAMS_DATA.length} Diagrams Shown
            </div>
          </div>

          {/* Category Tabs */}
          <div className="diagram-category-tabs">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`diagram-tab-btn ${isActive ? 'active' : ''}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagram Cards Grid (3 Columns) */}
        <div className="diagram-grid-container">
          {filteredDiagrams.map((item) => {
            const DiagramComp = item.component;
            return (
              <div key={item.id} className="diagram-card">
                {/* SVG Thumbnail Preview */}
                <div
                  onClick={() => setActiveModalDiagram(item)}
                  className="diagram-card-preview"
                  title="Click to expand & zoom vector diagram"
                >
                  <DiagramComp />
                  <div className="diagram-card-overlay">
                    <span className="diagram-overlay-badge">
                      Click to Inspect &amp; Zoom
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="diagram-card-body">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="diagram-card-category-pill">
                        {item.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                        {item.id.toUpperCase()}
                      </span>
                    </div>

                    <h3
                      onClick={() => setActiveModalDiagram(item)}
                      className="diagram-card-title"
                    >
                      {item.title}
                    </h3>

                    <p className="diagram-card-desc">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="diagram-tags-list">
                      {item.tags.slice(0, 4).map((tag: string) => (
                        <span key={tag} className="diagram-tag-item">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setActiveModalDiagram(item)}
                      className="diagram-inspect-btn"
                    >
                      <FileText size={14} />
                      Inspect Vector Architecture
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Result State */}
        {filteredDiagrams.length === 0 && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '3rem', textAlign: 'center', margin: '2rem 0' }}>
            <Layers size={36} style={{ margin: '0 auto 0.75rem auto', color: '#94a3b8' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>No matching diagrams found</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
              We couldn&apos;t find any diagrams matching &quot;{searchQuery}&quot;. Try adjusting your search query or selecting &quot;All Diagrams&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Diagrams');
              }}
              style={{
                marginTop: '1rem',
                padding: '0.55rem 1.1rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: '8px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Governance & Provenance Panels */}
        <div id="governance-section">
          <GovernancePanels />
        </div>
      </div>

      {/* Interactive Modal */}
      <DiagramModal
        diagram={activeModalDiagram}
        isOpen={Boolean(activeModalDiagram)}
        onClose={() => setActiveModalDiagram(null)}
      />
    </div>
  );
};
export default Diagrams;

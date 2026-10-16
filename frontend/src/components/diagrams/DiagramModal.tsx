import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download, Maximize2, Minimize2, X } from 'lucide-react';
import { DiagramItem } from './types';

interface DiagramModalProps {
  diagram: DiagramItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DiagramModal: React.FC<DiagramModalProps> = ({ diagram, isOpen, onClose }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isFullscreen, onClose]);

  // Reset zoom & pan when diagram changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [diagram]);

  if (!isOpen || !diagram) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDownloadSVG = () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${diagram.id}_${diagram.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const DiagramComp = diagram.component;

  return (
    <div
      className="diagram-viewer-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className={`diagram-viewer-modal-dialog ${isFullscreen ? 'fullscreen' : ''}`}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: isFullscreen ? 0 : '16px',
          width: isFullscreen ? '100vw' : '100%',
          maxWidth: isFullscreen ? '100vw' : '1200px',
          height: isFullscreen ? '100vh' : '90vh',
          maxHeight: isFullscreen ? '100vh' : '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          border: isFullscreen ? 'none' : '1px solid #cbd5e1',
        }}
      >
        {/* Modal Header */}
        <div
          className="diagram-viewer-header"
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div className="diagram-viewer-title-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span
                className="diagram-viewer-category"
                style={{
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  borderRadius: '4px',
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  border: '1px solid #bae6fd',
                }}
              >
                {diagram.category}
              </span>
              <h2
                className="diagram-viewer-title"
                style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}
              >
                {diagram.title}
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>{diagram.description}</p>
          </div>

          <div
            className="diagram-viewer-toolbar"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}
          >
            {/* Zoom controls */}
            <div
              className="diagram-viewer-zoom-group"
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.15rem',
              }}
            >
              <button
                onClick={handleZoomOut}
                title="Zoom Out (-)"
                className="diagram-viewer-btn icon-only"
                style={{ padding: '0.4rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <ZoomOut size={16} />
              </button>
              <span
                style={{
                  padding: '0 0.5rem',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: '#334155',
                  minWidth: '48px',
                  textAlign: 'center',
                  userSelect: 'none',
                }}
              >
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                title="Zoom In (+)"
                className="diagram-viewer-btn icon-only"
                style={{ padding: '0.4rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={handleReset}
                title="Reset View"
                className="diagram-viewer-btn icon-only"
                style={{
                  padding: '0.4rem',
                  border: 'none',
                  borderLeft: '1px solid #e2e8f0',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* Export SVG */}
            <button
              onClick={handleDownloadSVG}
              className="diagram-viewer-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                cursor: 'pointer',
              }}
              title="Download Vector SVG"
            >
              <Download size={15} style={{ color: '#0284c7' }} />
              <span>Export SVG</span>
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="diagram-viewer-btn icon-only"
              style={{
                padding: '0.45rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                background: '#ffffff',
                cursor: 'pointer',
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="diagram-viewer-btn close-btn"
              style={{
                padding: '0.45rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: '#ffffff',
                color: '#64748b',
                cursor: 'pointer',
              }}
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Interactive SVG Viewport */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`diagram-viewer-canvas ${isDragging ? 'grabbing' : 'grab'}`}
          style={{
            flex: 1,
            backgroundColor: '#f8fafc',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            userSelect: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DiagramComp isModal={true} />
          </div>

          {/* Hint Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              color: '#ffffff',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>Drag to Pan</span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span>Use +/- or Reset for Zoom</span>
          </div>
        </div>

        {/* Modal Footer / Metadata */}
        <div
          className="diagram-viewer-footer"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: '#475569' }}>Tags:</span>
            {diagram.tags.map((tag: string) => (
              <span
                key={tag}
                style={{
                  padding: '0.15rem 0.5rem',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '4px',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  fontFamily: 'monospace',
                  fontSize: '0.72rem',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
          <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.72rem' }}>
            Vector SVG • 100% Client-Side Rendered
          </span>
        </div>
      </div>
    </div>
  );
};

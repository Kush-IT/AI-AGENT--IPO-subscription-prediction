import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { WALKTHROUGH_STEPS } from './diagramData';

export const InteractiveWalkthrough: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const step = WALKTHROUGH_STEPS[currentStepIndex];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % WALKTHROUGH_STEPS.length);
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : WALKTHROUGH_STEPS.length - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev + 1) % WALKTHROUGH_STEPS.length);
  };

  const getPhaseBadgeStyle = (phase: string) => {
    switch (phase) {
      case 'INPUT':
        return { backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' };
      case 'PROCESS':
        return { backgroundColor: '#f3e8ff', color: '#7e22ce', borderColor: '#e9d5ff' };
      case 'OUTPUT':
        return { backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' };
      default:
        return { backgroundColor: '#f1f5f9', color: '#334155', borderColor: '#cbd5e1' };
    }
  };

  return (
    <div className="walkthrough-box">
      {/* Header */}
      <div className="walkthrough-header-dark" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
              Interactive Walkthrough
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>10-Step Ex-Ante Pipeline</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>How One IPO Gets Predicted (SS Retail Example)</h3>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.25rem', maxWidth: '750px', lineHeight: 1.45 }}>
            Trace the exact journey of an IPO from prospectus registration through the 09:59:59 IST ex-ante cutoff, 45-feature vectorization, 4-model inference, TreeSHAP explanation, and audit log persistence.
          </p>
        </div>

        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: isPlaying ? '#f59e0b' : '#0284c7',
              color: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.15s ease',
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'Pause Auto-Play' : 'Auto-Play Tour'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '2px' }}>
            <button
              onClick={handlePrev}
              title="Previous Step"
              style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.35rem', display: 'flex', alignItems: 'center', borderRadius: '4px' }}
            >
              <ChevronLeft size={15} />
            </button>
            <span style={{ padding: '0 0.5rem', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
              {currentStepIndex + 1} / {WALKTHROUGH_STEPS.length}
            </span>
            <button
              onClick={handleNext}
              title="Next Step"
              style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.35rem', display: 'flex', alignItems: 'center', borderRadius: '4px' }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Step Selector */}
      <div style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.5rem 1rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: '700px' }}>
          {WALKTHROUGH_STEPS.map((s, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={s.stepNumber}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.5rem',
                  borderRadius: '8px',
                  border: isActive ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: isActive ? '#ffffff' : isCompleted ? '#f0fdf4' : '#ffffff',
                  color: isActive ? '#0284c7' : isCompleted ? '#166534' : '#64748b',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 1px 3px rgba(2, 132, 199, 0.2)' : 'none',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    backgroundColor: isActive ? '#0284c7' : isCompleted ? '#16a34a' : '#e2e8f0',
                    color: isActive || isCompleted ? '#ffffff' : '#64748b',
                    flexShrink: 0,
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={11} /> : s.stepNumber}
                </div>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.title.split(' ')[0]} {s.title.split(' ')[1] || ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Detail Body */}
      <div style={{ padding: '1.5rem' }}>
        {/* Step Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 800, borderRadius: '6px', border: '1px solid', ...getPhaseBadgeStyle(step.phase) }}>
              {step.phase} PHASE
            </span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Step {step.stepNumber}: {step.title}
            </h4>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
            Pipeline Stage {step.stepNumber} of 10
          </span>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1.5rem', maxWidth: '900px' }}>
          {step.description}
        </p>

        {/* 3 Interactive Cards: INPUT -> PROCESS -> OUTPUT */}
        <div className="walkthrough-stages-grid">
          {/* 1. INPUT */}
          <div className="walkthrough-stage-card input-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                1
              </div>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0369a1', margin: 0 }}>
                Inputs Required
              </h5>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {step.inputs.map((inp, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', backgroundColor: '#ffffff', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #bae6fd', fontSize: '0.78rem', color: '#334155' }}>
                  <span style={{ color: '#0284c7', fontWeight: 800 }}>&bull;</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. PROCESS */}
          <div className="walkthrough-stage-card process-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#7e22ce', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                2
              </div>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#6b21a8', margin: 0 }}>
                System Processing
              </h5>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e9d5ff', fontSize: '0.8rem', color: '#334155', lineHeight: 1.5, flex: 1 }}>
              {step.process}
            </div>
          </div>

          {/* 3. OUTPUT */}
          <div className="walkthrough-stage-card output-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                3
              </div>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#047857', margin: 0 }}>
                Guaranteed Outputs
              </h5>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {step.outputs.map((out, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', backgroundColor: '#ffffff', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #a7f3d0', fontSize: '0.78rem', color: '#064e3b' }}>
                  <CheckCircle2 size={13} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600 }}>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation within Walkthrough */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStepIndex === 0 ? 0.4 : 1,
              backgroundColor: '#f1f5f9',
              color: '#334155',
              border: '1px solid #e2e8f0',
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronLeft size={15} />
            Previous Step
          </button>

          <span style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' }}>
            Step {currentStepIndex + 1} of {WALKTHROUGH_STEPS.length}
          </span>

          <button
            onClick={handleNext}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            {currentStepIndex === WALKTHROUGH_STEPS.length - 1 ? 'Start Over' : 'Next Step'}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

import { describe, it, expect } from 'vitest';
import {
  DIAGRAMS_DATA,
  WALKTHROUGH_STEPS,
  PRODUCTION_MODELS_DATA,
  DATA_PROVENANCE_SOURCES,
} from '../src/components/diagrams/diagramData';
import { DiagramCategory } from '../src/components/diagrams/types';

describe('System Architecture Diagrams & Engineering Documentation Tests', () => {
  describe('1. Dedicated Vector Architecture Diagrams Integrity', () => {
    it('contains at least 18 distinct software engineering diagrams', () => {
      expect(DIAGRAMS_DATA.length).toBeGreaterThanOrEqual(18);
    });

    it('has unique identifiers for every diagram', () => {
      const ids = DIAGRAMS_DATA.map((d) => d.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(DIAGRAMS_DATA.length);
    });

    it('verifies that every diagram has a valid non-empty title and description', () => {
      DIAGRAMS_DATA.forEach((d) => {
        expect(d.title.trim().length).toBeGreaterThan(5);
        expect(d.description.trim().length).toBeGreaterThan(15);
        expect(Array.isArray(d.tags)).toBe(true);
        expect(d.tags.length).toBeGreaterThanOrEqual(3);
        expect(typeof d.component).toBe('function');
      });
    });

    it('assigns each diagram to one of the 10 software engineering categories', () => {
      const validCategories: DiagramCategory[] = [
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

      DIAGRAMS_DATA.forEach((d) => {
        expect(validCategories).toContain(d.category);
      });
    });

    it('verifies specific critical software engineering diagrams exist', () => {
      const titles = DIAGRAMS_DATA.map((d) => d.title.toLowerCase());
      expect(titles.some((t) => t.includes('high-level system architecture'))).toBe(true);
      expect(titles.some((t) => t.includes('system context') || t.includes('c4'))).toBe(true);
      expect(titles.some((t) => t.includes('uml use case'))).toBe(true);
      expect(titles.some((t) => t.includes('uml sequence'))).toBe(true);
      expect(titles.some((t) => t.includes('uml class'))).toBe(true);
      expect(titles.some((t) => t.includes('uml activity'))).toBe(true);
      expect(titles.some((t) => t.includes('uml component'))).toBe(true);
      expect(titles.some((t) => t.includes('uml state'))).toBe(true);
      expect(titles.some((t) => t.includes('database & relational') || t.includes('er'))).toBe(true);
      expect(titles.some((t) => t.includes('data model'))).toBe(true);
      expect(titles.some((t) => t.includes('deployment'))).toBe(true);
      expect(titles.some((t) => t.includes('infrastructure'))).toBe(true);
      expect(titles.some((t) => t.includes('ci/cd'))).toBe(true);
      expect(titles.some((t) => t.includes('security'))).toBe(true);
      expect(titles.some((t) => t.includes('monitoring'))).toBe(true);
      expect(titles.some((t) => t.includes('training'))).toBe(true);
      expect(titles.some((t) => t.includes('temporal') && t.includes('governance'))).toBe(true);
      expect(titles.some((t) => t.includes('11-agent'))).toBe(true);
      expect(titles.some((t) => t.includes('model selection') || t.includes('gating'))).toBe(true);
    });
  });

  describe('2. Interactive Walkthrough ("How One IPO Gets Predicted")', () => {
    it('contains exactly 10 sequential walkthrough steps', () => {
      expect(WALKTHROUGH_STEPS).toHaveLength(10);
      WALKTHROUGH_STEPS.forEach((step, idx) => {
        expect(step.stepNumber).toBe(idx + 1);
      });
    });

    it('structures every step with INPUT, PROCESS, and OUTPUT specifications', () => {
      const validPhases = ['INPUT', 'PROCESS', 'OUTPUT'];
      WALKTHROUGH_STEPS.forEach((step) => {
        expect(validPhases).toContain(step.phase);
        expect(step.inputs.length).toBeGreaterThan(0);
        expect(step.process.trim().length).toBeGreaterThan(15);
        expect(step.outputs.length).toBeGreaterThan(0);
        expect(step.badge).toContain(`Step ${step.stepNumber} of 10`);
      });
    });

    it('verifies Step 2 explicitly enforces 09:59:59 IST ex-ante cutoff', () => {
      const step2 = WALKTHROUGH_STEPS[1];
      expect(step2.title).toContain('Ex-Ante Temporal Cutoff');
      expect(step2.outputs.some((o) => o.includes('CUTOFF_CHECK: PASSED'))).toBe(true);
    });

    it('verifies Step 5 assembles the 45 canonical features vector', () => {
      const step5 = WALKTHROUGH_STEPS[4];
      expect(step5.title).toContain('45 Canonical Features');
      expect(step5.outputs.some((o) => o.includes('(1, 45)'))).toBe(true);
    });

    it('verifies Step 7 and 8 cover parallel multi-model inference and TreeSHAP', () => {
      const step7 = WALKTHROUGH_STEPS[6];
      expect(step7.title).toContain('Parallel Multi-Model Inference');
      expect(step7.inputs.some((i) => i.includes('total_xgboost_log1p'))).toBe(true);

      const step8 = WALKTHROUGH_STEPS[7];
      expect(step8.title).toContain('TreeSHAP Local Explainability');
      expect(step8.outputs.some((o) => o.includes('Shapley') || o.includes('SHAP'))).toBe(true);
    });
  });

  describe('3. Production Model Architecture & Cryptographic Checksums', () => {
    it('documents all 5 canonical production model artifacts', () => {
      expect(PRODUCTION_MODELS_DATA).toHaveLength(5);
      const names = PRODUCTION_MODELS_DATA.map((m) => m.name);
      expect(names).toContain('dev_preprocessor.joblib');
      expect(names).toContain('total_xgboost_log1p.joblib');
      expect(names).toContain('qib_random_forest_raw.joblib');
      expect(names).toContain('nii_lightgbm_log1p.joblib');
      expect(names).toContain('retail_xgboost_raw.joblib');
    });

    it('verifies 64-character SHA-256 cryptographic hashes for all production models', () => {
      PRODUCTION_MODELS_DATA.forEach((model) => {
        expect(model.sha256).toMatch(/^[0-9a-f]{64}$/);
        expect(model.status).toBe('FROZEN & VERIFIED');
      });
    });

    it('verifies expected mathematical target transformations', () => {
      const totalModel = PRODUCTION_MODELS_DATA.find((m) => m.name === 'total_xgboost_log1p.joblib');
      const niiModel = PRODUCTION_MODELS_DATA.find((m) => m.name === 'nii_lightgbm_log1p.joblib');
      const qibModel = PRODUCTION_MODELS_DATA.find((m) => m.name === 'qib_random_forest_raw.joblib');
      const retailModel = PRODUCTION_MODELS_DATA.find((m) => m.name === 'retail_xgboost_raw.joblib');

      expect(totalModel?.targetTransform).toContain('log1p');
      expect(niiModel?.targetTransform).toContain('log1p');
      expect(qibModel?.targetTransform).toContain('Raw');
      expect(retailModel?.targetTransform).toContain('Raw');
    });
  });

  describe('4. Data Provenance & Anti-Leakage Isolation Rules', () => {
    it('documents at least 6 core financial data sources', () => {
      expect(DATA_PROVENANCE_SOURCES.length).toBeGreaterThanOrEqual(6);
    });

    it('strictly isolates Live NSE Bidding and Listing Bulletin from AI Feature Store', () => {
      const liveNse = DATA_PROVENANCE_SOURCES.find((s) => s.sourceName.includes('NSE Official Live'));
      const listingBulletin = DATA_PROVENANCE_SOURCES.find((s) => s.sourceName.includes('Final Allotment'));

      expect(liveNse).toBeDefined();
      expect(liveNse?.usedInAI).toBe(false);
      expect(liveNse?.cutoffEnforced).toContain('POST-OPENING');

      expect(listingBulletin).toBeDefined();
      expect(listingBulletin?.usedInAI).toBe(false);
    });

    it('permits valid ex-ante sources (SEBI RHP, Anchor, Pre-market sentiment, GMP)', () => {
      const rhp = DATA_PROVENANCE_SOURCES.find((s) => s.sourceName.includes('SEBI Red Herring'));
      const anchor = DATA_PROVENANCE_SOURCES.find((s) => s.sourceName.includes('Anchor'));
      const gmp = DATA_PROVENANCE_SOURCES.find((s) => s.sourceName.includes('GMP'));

      expect(rhp?.usedInAI).toBe(true);
      expect(anchor?.usedInAI).toBe(true);
      expect(gmp?.usedInAI).toBe(true);
    });
  });

  describe('5. Search and Category Filtering Logic', () => {
    it('filters diagrams across the 10 software engineering categories accurately', () => {
      const archDiagrams = DIAGRAMS_DATA.filter((d) => d.category === 'Architecture');
      expect(archDiagrams.length).toBeGreaterThanOrEqual(2);

      const umlDiagrams = DIAGRAMS_DATA.filter((d) => d.category === 'UML');
      expect(umlDiagrams.length).toBeGreaterThanOrEqual(5);

      const dbDiagrams = DIAGRAMS_DATA.filter((d) => d.category === 'Database');
      expect(dbDiagrams.length).toBeGreaterThanOrEqual(2);

      const deployDiagrams = DIAGRAMS_DATA.filter((d) => d.category === 'Deployment');
      expect(deployDiagrams.length).toBeGreaterThanOrEqual(2);

      const mlDiagrams = DIAGRAMS_DATA.filter((d) => d.category === 'ML Architecture');
      expect(mlDiagrams.length).toBeGreaterThanOrEqual(2);

      const securityDiagrams = DIAGRAMS_DATA.filter((d) => d.category === 'Security');
      expect(securityDiagrams.length).toBeGreaterThanOrEqual(1);

      const agentDiagrams = DIAGRAMS_DATA.filter((d) => d.category === 'Agentic AI');
      expect(agentDiagrams.length).toBeGreaterThanOrEqual(1);

      const govDiagrams = DIAGRAMS_DATA.filter((d) => d.category === 'Governance');
      expect(govDiagrams.length).toBeGreaterThanOrEqual(1);
    });

    it('filters diagrams by search query term correctly', () => {
      const query = 'Architecture';
      const results = DIAGRAMS_DATA.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.description.toLowerCase().includes(query.toLowerCase()) ||
          d.tags.some((t: string) => t.toLowerCase().includes(query.toLowerCase()))
      );
      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it('finds Docker and deployment diagrams by DevOps tags', () => {
      const query = 'Docker';
      const results = DIAGRAMS_DATA.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.description.toLowerCase().includes(query.toLowerCase()) ||
          d.tags.some((t: string) => t.toLowerCase().includes(query.toLowerCase()))
      );
      expect(results.length).toBeGreaterThanOrEqual(1);
    });
  });
});

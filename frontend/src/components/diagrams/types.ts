import React from 'react';

export type DiagramCategory =
  | 'All Diagrams'
  | 'Architecture'
  | 'UML'
  | 'Database'
  | 'Security'
  | 'Deployment'
  | 'CI/CD'
  | 'Monitoring'
  | 'ML Architecture'
  | 'Agentic AI'
  | 'Governance';

export interface DiagramItem {
  id: string;
  title: string;
  category: DiagramCategory;
  description: string;
  tags: string[];
  component: React.FC<{ isModal?: boolean }>;
}

export interface DiagramMetadata {
  id: number;
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  category: DiagramCategory;
  tags: string[];
  detailedDescription: string;
  keyComponents: string[];
  dataFlowDirection?: string;
  governanceNote?: string;
  svgComponent: React.FC<{ isModal?: boolean }>;
}

export interface WalkthroughStep {
  stepNumber: number;
  title: string;
  phase: 'INPUT' | 'PROCESS' | 'OUTPUT';
  description: string;
  inputs: string[];
  process: string;
  outputs: string[];
  badge: string;
  color?: string;
  codeSnippet?: string;
}

export interface ModelArtifactInfo {
  name: string;
  role: string;
  algorithm: string;
  sha256: string;
  trainingTarget: string;
  targetTransform: string;
  frozenDate: string;
  status: string;
}

export interface ProductionModelDetail {
  target: string;
  model: string;
  transform: string;
  artifact: string;
  sha256: string;
  status: 'FROZEN_LOCKED' | 'QUARANTINED';
  testMAE: string;
  testR2: string;
  hyperparams: string;
}

export interface DataProvenanceSource {
  sourceName: string;
  dataType: string;
  collectionFrequency: string;
  cutoffEnforced: string;
  usedInAI: boolean;
}

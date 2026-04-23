'use client';

import { lazy, Suspense, useMemo } from 'react';

import type { GarageModel } from './data';
import styles from './garage3d.module.css';

const GarageScene = lazy(() => import('./GarageScene'));

type HeroProps = {
  models: GarageModel[];
  activeModelId: string;
  loadedCount: number;
  loadingModelId: string | null;
  onActiveModelChange: (modelId: string) => void;
  onLoadingChange: (modelId: string | null) => void;
  onModelLoaded: (modelId: string) => void;
};

export default function Hero({
  models,
  activeModelId,
  loadedCount,
  loadingModelId,
  onActiveModelChange,
  onLoadingChange,
  onModelLoaded,
}: HeroProps) {
  const activeModel = useMemo(
    () => models.find((model) => model.id === activeModelId) ?? models[0],
    [activeModelId, models]
  );

  const loadingModel = useMemo(
    () => models.find((model) => model.id === loadingModelId) ?? null,
    [loadingModelId, models]
  );

  return (
    <section className={styles.hero} id="experience">
      <div className={styles.canvasLayer}>
        <Suspense fallback={<div aria-hidden="true" className={styles.canvasShell} />}>
          <GarageScene
            activeModelId={activeModelId}
            models={models}
            onActiveModelChange={onActiveModelChange}
            onLoadingChange={onLoadingChange}
            onModelLoaded={onModelLoaded}
          />
        </Suspense>
      </div>

      <div className={styles.overlay}>
        <span className={styles.overline}>3D Garage Experience</span>
        <h1 className={styles.heroTitle}>{activeModel.name}</h1>
        <p className={styles.heroCopy}>{activeModel.description}</p>

        <div className={styles.statusRow}>
          <span className={styles.statusChip}>{loadedCount} / {models.length} models ready</span>
          <span className={styles.statusChip}>
            {loadingModel
              ? `Streaming ${loadingModel.queueLabel}`
              : 'All local garage assets loaded'}
          </span>
          <span className={styles.statusChip}>Drag, swipe, or pinch to inspect</span>
        </div>
      </div>
    </section>
  );
}

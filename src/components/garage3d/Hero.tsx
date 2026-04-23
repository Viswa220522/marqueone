'use client';

import { lazy, Suspense, useMemo, useState } from 'react';

import type { GarageModel } from './data';
import styles from './garage3d.module.css';

const GarageScene = lazy(() => import('./GarageScene'));

type HeroProps = {
  models: GarageModel[];
  activeModelId: string;
  loadedCount: number;
  loadedModelIds: string[];
  loadingModelId: string | null;
  onActiveModelChange: (modelId: string) => void;
  onLoadingChange: (modelId: string | null) => void;
  onModelLoaded: (modelId: string) => void;
};

export default function Hero({
  models,
  activeModelId,
  loadedCount,
  loadedModelIds,
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

  const [isInteract, setIsInteract] = useState(false);

  const currentIndex = models.findIndex((m) => m.id === activeModelId);
  const prevModel = currentIndex > 0 ? models[currentIndex - 1] : null;
  const nextModel = currentIndex < models.length - 1 ? models[currentIndex + 1] : null;
  const canGoPrev = prevModel !== null && loadedModelIds.includes(prevModel.id);
  const canGoNext = nextModel !== null && loadedModelIds.includes(nextModel.id);

  return (
    <section className={styles.hero} id="experience">
      <div className={styles.canvasLayer}>
        <Suspense fallback={<div aria-hidden="true" className={styles.canvasShell} />}>
          <GarageScene
            activeModelId={activeModelId}
            isInteract={isInteract}
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
          <span className={styles.statusChip}>Drag or pinch to inspect</span>
        </div>
      </div>

      <div className={styles.interactOverlay}>
        <button
          aria-pressed={isInteract}
          className={`${styles.interactBtn} ${isInteract ? styles.interactBtnActive : ''}`}
          onClick={() => setIsInteract((v) => !v)}
        >
          {isInteract ? (
            <>
              <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
              Exit Interaction
            </>
          ) : (
            <>
              <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
                <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v1" />
                <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
              </svg>
              Interact
            </>
          )}
        </button>
      </div>

      <div className={styles.modelNav} aria-label="Model navigation">
        <button
          aria-label="Previous model"
          className={`${styles.navArrow} ${!canGoPrev ? styles.navArrowDisabled : ''}`}
          disabled={!canGoPrev}
          onClick={() => prevModel && canGoPrev && onActiveModelChange(prevModel.id)}
        >
          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          aria-label="Next model"
          className={`${styles.navArrow} ${!canGoNext ? styles.navArrowDisabled : ''}`}
          disabled={!canGoNext}
          onClick={() => nextModel && canGoNext && onActiveModelChange(nextModel.id)}
        >
          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

'use client';

import { useCallback, useState } from 'react';

import Footer from './Footer';
import Hero from './Hero';
import Lineup from './Lineup';
import Navbar from './Navbar';
import { garageModels } from './data';
import styles from './garage3d.module.css';

export default function GarageExperience() {
  const [activeModelId, setActiveModelId] = useState<string>(garageModels[0].id);
  const [loadedModelIds, setLoadedModelIds] = useState<string[]>([]);
  const [loadingModelId, setLoadingModelId] = useState<string | null>(garageModels[0].id);

  const handleModelLoaded = useCallback((modelId: string) => {
    setLoadedModelIds((current) =>
      current.includes(modelId) ? current : [...current, modelId]
    );
  }, []);

  const handleModelSelect = useCallback((modelId: string) => {
    setActiveModelId(modelId);
  }, []);

  const handleLoadingChange = useCallback((modelId: string | null) => {
    setLoadingModelId(modelId);
  }, []);

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <Hero
          activeModelId={activeModelId}
          loadedCount={loadedModelIds.length}
          loadedModelIds={loadedModelIds}
          loadingModelId={loadingModelId}
          models={garageModels}
          onActiveModelChange={handleModelSelect}
          onLoadingChange={handleLoadingChange}
          onModelLoaded={handleModelLoaded}
        />
        <Lineup
          activeModelId={activeModelId}
          loadedModelIds={loadedModelIds}
          loadingModelId={loadingModelId}
          models={garageModels}
          onSelectModel={handleModelSelect}
        />
      </main>
      <Footer />
    </div>
  );
}

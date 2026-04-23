'use client';

import { motion } from 'framer-motion';

import type { GarageModel } from './data';
import styles from './garage3d.module.css';

type LineupProps = {
  models: GarageModel[];
  activeModelId: string;
  loadedModelIds: string[];
  loadingModelId: string | null;
  onSelectModel: (modelId: string) => void;
};

export default function Lineup({
  models,
  activeModelId,
  loadedModelIds,
  loadingModelId,
  onSelectModel,
}: LineupProps) {
  const loadedModelSet = new Set(loadedModelIds);

  return (
    <section className={styles.lineupSection} id="lineup">
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.overline}>Integrated From The Former Vite Build</span>
          <h2 className={styles.sectionTitle}>The Lineup</h2>
        </div>
        <p className={styles.sectionCopy}>
          The scene shell loads first, then each local GLB streams into the main Next.js application one asset at a time.
        </p>
      </div>

      <div className={styles.lineupGrid}>
        {models.map((model, index) => {
          const isReady = loadedModelSet.has(model.id);
          const isActive = isReady && activeModelId === model.id;
          const isLoading = loadingModelId === model.id;

          const cardClassName = [
            styles.modelCard,
            index === 0 ? styles.modelCardLarge : '',
            index === 1 ? styles.modelCardTall : '',
            isActive ? styles.modelCardActive : '',
          ]
            .filter(Boolean)
            .join(' ');

          const buttonClassName = [
            styles.modelButton,
            isActive ? styles.modelButtonActive : '',
            !isReady ? styles.modelButtonDisabled : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <motion.article
              className={cardClassName}
              initial={{ opacity: 0, y: 28 }}
              key={model.id}
              transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: '0px 0px -80px 0px' }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <span className={styles.cardEyebrow}>{model.queueLabel}</span>
              <h3 className={styles.modelName}>{model.name}</h3>
              <p className={styles.modelDescription}>{model.description}</p>

              <div className={styles.modelMeta}>
                <span className={styles.modelMetaItem}>{model.category}</span>
                <span className={styles.modelMetaItem}>{model.year}</span>
              </div>

              <button
                className={buttonClassName}
                disabled={!isReady}
                onClick={() => onSelectModel(model.id)}
                type="button"
              >
                {isActive
                  ? 'In View'
                  : isReady
                    ? 'Focus Model'
                    : isLoading
                      ? 'Streaming...'
                      : 'Queued'}
              </button>
            </motion.article>
          );
        })}

        <article className={styles.programCard}>
          <span className={styles.cardEyebrow}>Unified Stack</span>
          <h3 className={styles.modelName}>Next.js Garage Route</h3>
          <p className={styles.modelDescription}>
            The former Vite app now lives inside a single route, a single router, and the same React stack as the main site.
          </p>
          <a className={styles.modelButton} href="#experience">
            Return To Canvas
          </a>
        </article>
      </div>
    </section>
  );
}

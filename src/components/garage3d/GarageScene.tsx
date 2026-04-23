'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

import type { GarageModel } from './data';
import styles from './garage3d.module.css';

type GarageSceneProps = {
  models: GarageModel[];
  activeModelId: string;
  onActiveModelChange: (modelId: string) => void;
  onLoadingChange: (modelId: string | null) => void;
  onModelLoaded: (modelId: string) => void;
};

type LoadedModelMap = Record<string, THREE.Object3D>;

const TARGET_SIZE = 4.75;
const AUTO_ROTATION_SPEED = 0.18; // rad/s
const AUTO_FPS = 30;

const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

function normalizeModel(source: THREE.Object3D) {
  const scene = source.clone(true);
  scene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const largestDimension = Math.max(size.x, size.y, size.z) || 1;
  const scale = TARGET_SIZE / largestDimension;

  scene.position.sub(center);
  scene.scale.setScalar(scale);
  scene.updateMatrixWorld(true);

  const groundedBox = new THREE.Box3().setFromObject(scene);
  scene.position.y -= groundedBox.min.y;

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.castShadow = true;
    child.receiveShadow = true;
  });

  return scene;
}

function disposeMaterial(material: THREE.Material) {
  const m = material as THREE.Material & Record<string, unknown>;
  const keys = [
    'map', 'alphaMap', 'aoMap', 'bumpMap', 'displacementMap',
    'emissiveMap', 'envMap', 'lightMap', 'metalnessMap', 'normalMap', 'roughnessMap',
  ] as const;
  keys.forEach((k) => (m[k] as THREE.Texture | null | undefined)?.dispose());
  material.dispose();
}

function disposeScene(scene: THREE.Object3D) {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    if (Array.isArray(child.material)) {
      child.material.forEach(disposeMaterial);
    } else {
      disposeMaterial(child.material);
    }
  });
}

// ─── Stage (lives inside Canvas) ─────────────────────────────────────────────

function Stage({
  activeModel,
  rotationY,
  isMobile,
  isInteract,
}: {
  activeModel: THREE.Object3D | null;
  rotationY: number;
  isMobile: boolean;
  isInteract: boolean;
}) {
  const { invalidate } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const autoAngleRef = useRef(0);

  // Keep a ref so the RAF callback always reads the latest value without
  // being re-created every time isInteract changes.
  const isInteractRef = useRef(isInteract);
  useEffect(() => { isInteractRef.current = isInteract; }, [isInteract]);

  // Drive auto-rotation at ~30 fps using demand rendering.
  // In auto mode we fire invalidate() on a throttled RAF loop; the scene
  // only actually renders on those ticks — main thread is otherwise free.
  useEffect(() => {
    if (isInteract) return;

    let rafId: number;
    let lastTime = 0;
    const interval = 1000 / AUTO_FPS;

    const tick = (time: number) => {
      rafId = requestAnimationFrame(tick);
      if (!isInteractRef.current && time - lastTime >= interval) {
        lastTime = time;
        invalidate();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInteract, invalidate]);

  // Apply Y-rotation each rendered frame (only in auto mode).
  useFrame((_, delta) => {
    if (!isInteract && groupRef.current) {
      autoAngleRef.current += delta * AUTO_ROTATION_SPEED;
      groupRef.current.rotation.y = rotationY + autoAngleRef.current;
    }
  });

  // Reset angle when the displayed model changes so rotation starts cleanly.
  useEffect(() => {
    autoAngleRef.current = 0;
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModel]);

  return (
    <>
      <ambientLight intensity={1.55} />
      <hemisphereLight args={['#ffffff', '#0f0f0f', 1.15]} />
      <directionalLight
        castShadow={!isMobile}
        intensity={2.4}
        position={[6, 9, 6]}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
      <spotLight angle={0.38} intensity={46} penumbra={0.8} position={[-7, 8, 5]} />

      <mesh position={[0, -0.015, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8.5, 80]} />
        <meshStandardMaterial color="#141414" metalness={0.18} roughness={0.88} />
      </mesh>

      <gridHelper args={[22, 28, '#2a2a2a', '#171717']} position={[0, 0.002, 0]} />

      {/* Outer group carries auto-rotation; inner group triggers clean remount on model swap */}
      <group ref={groupRef}>
        {activeModel ? (
          <group key={activeModel.uuid}>
            <primitive object={activeModel} />
          </group>
        ) : null}
      </group>

      <OrbitControls
        enabled={isInteract}
        makeDefault
        enablePan={false}
        enableZoom={isInteract}
        maxDistance={isMobile ? 8.5 : 7.25}
        maxPolarAngle={Math.PI / 1.9}
        minDistance={isMobile ? 4.8 : 4.35}
        minPolarAngle={Math.PI / 3.5}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />
    </>
  );
}

// ─── GarageScene (DOM wrapper + Canvas) ──────────────────────────────────────

export default function GarageScene({
  models,
  activeModelId,
  onActiveModelChange,
  onLoadingChange,
  onModelLoaded,
}: GarageSceneProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [loadedModels, setLoadedModels] = useState<LoadedModelMap>({});
  const [isInteract, setIsInteract] = useState(false);
  const loadedScenesRef = useRef<LoadedModelMap>({});

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = (e?: MediaQueryListEvent) => setIsMobile(e ? e.matches : mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();

    const loadModelsSequentially = async () => {
      for (const model of models) {
        if (cancelled) return;
        onLoadingChange(model.id);

        try {
          const gltf = await loader.loadAsync(model.assetPath);
          if (cancelled) return;

          const normalizedModel = normalizeModel(gltf.scene);
          loadedScenesRef.current[model.id] = normalizedModel;
          setLoadedModels((curr) => ({ ...curr, [model.id]: normalizedModel }));
          onModelLoaded(model.id);
          await nextFrame();
        } catch (err) {
          console.error(`Failed to load ${model.name}`, err);
        }
      }
      if (!cancelled) onLoadingChange(null);
    };

    void loadModelsSequentially();

    return () => {
      cancelled = true;
      onLoadingChange(null);
      Object.values(loadedScenesRef.current).forEach(disposeScene);
      loadedScenesRef.current = {};
    };
  }, [models, onActiveModelChange, onLoadingChange, onModelLoaded]);

  const fallbackModel = useMemo(() => {
    const firstId = Object.keys(loadedModels)[0];
    return firstId ? loadedModels[firstId] : null;
  }, [loadedModels]);

  const activeModel = loadedModels[activeModelId] ?? fallbackModel;
  const activeRotation = models.find((m) => m.id === activeModelId)?.rotationY ?? 0;

  return (
    <div className={`${styles.sceneCanvas} ${isInteract ? styles.sceneCanvasInteract : ''}`}>
      <Canvas
        camera={{
          fov: isMobile ? 38 : 33,
          position: [0, 1.45, isMobile ? 7.4 : 6.1],
        }}
        dpr={isMobile ? [1, 1.25] : [1, 1.8]}
        frameloop="demand"
        gl={{
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'high-performance',
        }}
        shadows={!isMobile}
      >
        <color args={['#0f0f0f']} attach="background" />
        <fog args={['#0f0f0f', 10, 18]} attach="fog" />
        <Stage
          activeModel={activeModel}
          isMobile={isMobile}
          isInteract={isInteract}
          rotationY={activeRotation}
        />
      </Canvas>

      {/* Interact toggle — positioned inside scene wrapper so z-index is self-contained */}
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
    </div>
  );
}

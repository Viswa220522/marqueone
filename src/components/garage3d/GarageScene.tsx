'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { AdaptiveDpr, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
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
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;
  });

  return scene;
}

function disposeMaterial(material: THREE.Material) {
  const materialWithTextures = material as THREE.Material & Record<string, unknown>;
  const textureKeys = [
    'map',
    'alphaMap',
    'aoMap',
    'bumpMap',
    'displacementMap',
    'emissiveMap',
    'envMap',
    'lightMap',
    'metalnessMap',
    'normalMap',
    'roughnessMap',
  ] as const;

  textureKeys.forEach((key) => {
    const texture = materialWithTextures[key] as THREE.Texture | null | undefined;
    texture?.dispose();
  });

  material.dispose();
}

function disposeScene(scene: THREE.Object3D) {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    child.geometry.dispose();

    if (Array.isArray(child.material)) {
      child.material.forEach(disposeMaterial);
      return;
    }

    disposeMaterial(child.material);
  });
}

function Stage({ activeModel, rotationY, isMobile }: {
  activeModel: THREE.Object3D | null;
  rotationY: number;
  isMobile: boolean;
}) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const canvas = controls.domElement;
    if (!canvas) return;

    // Prevent default wheel zoom but allow pinch (which usually has ctrlKey on trackpads)
    // On touch devices, this won't affect pinch-to-zoom touch events.
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) {
        // If not a pinch gesture (ctrlKey is true for pinch on most trackpads)
        // we prevent the zoom to satisfy the "pinch only" requirement.
        // Note: On mobile, this code path isn't even hit for touch pinch.
        e.preventDefault();
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <>
      <AdaptiveDpr pixelated />
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

      {activeModel ? (
        <group key={activeModel.uuid} rotation={[0, rotationY, 0]}>
          <primitive object={activeModel} />
        </group>
      ) : null}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        makeDefault
        enableZoom={true}
        maxDistance={isMobile ? 8.5 : 7.25}
        maxPolarAngle={Math.PI / 1.9}
        minDistance={isMobile ? 4.8 : 4.35}
        minPolarAngle={Math.PI / 3.5}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />
    </>
  );
}

export default function GarageScene({
  models,
  activeModelId,
  onActiveModelChange,
  onLoadingChange,
  onModelLoaded,
}: GarageSceneProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [loadedModels, setLoadedModels] = useState<LoadedModelMap>({});
  const loadedScenesRef = useRef<LoadedModelMap>({});

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const updateDevice = (event?: MediaQueryListEvent) => {
      setIsMobile(event ? event.matches : mediaQuery.matches);
    };

    updateDevice();
    mediaQuery.addEventListener('change', updateDevice);

    return () => mediaQuery.removeEventListener('change', updateDevice);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();

    const loadModelsSequentially = async () => {
      for (const model of models) {
        if (cancelled) {
          return;
        }

        onLoadingChange(model.id);

        try {
          const gltf = await loader.loadAsync(model.assetPath);

          if (cancelled) {
            return;
          }

          const normalizedModel = normalizeModel(gltf.scene);

          loadedScenesRef.current[model.id] = normalizedModel;
          setLoadedModels((current) => ({
            ...current,
            [model.id]: normalizedModel,
          }));
          onModelLoaded(model.id);
          onActiveModelChange(model.id);

          await nextFrame();
        } catch (error) {
          console.error(`Failed to load ${model.name}`, error);
        }
      }

      if (!cancelled) {
        onLoadingChange(null);
      }
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
    const firstLoadedId = Object.keys(loadedModels)[0];
    return firstLoadedId ? loadedModels[firstLoadedId] : null;
  }, [loadedModels]);

  const activeModel = loadedModels[activeModelId] ?? fallbackModel;
  const activeRotation =
    models.find((model) => model.id === activeModelId)?.rotationY ?? 0;

  return (
    <div className={styles.sceneCanvas}>
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
        <Stage activeModel={activeModel} isMobile={isMobile} rotationY={activeRotation} />
      </Canvas>
    </div>
  );
}

export type GarageModel = {
  id: string;
  queueLabel: string;
  name: string;
  category: string;
  year: string;
  description: string;
  assetPath: string;
  accent: string;
  rotationY: number;
};

export const garageModels: GarageModel[] = [
  {
    id: 'ferrari-sf90-spider',
    queueLabel: 'Queue 01',
    name: '2021 Ferrari SF90 Spider',
    category: 'Hybrid Supercar',
    year: '2021',
    description:
      'The first streamed asset in the garage queue, staged as the opening hero model for the integrated showroom.',
    assetPath: '/cars_3D/2021-ferrari-sf90-spider/source/2021_ferrari_sf90_spider.glb',
    accent: '#ef4444',
    rotationY: -0.35,
  },
  {
    id: 'corvette-z06',
    queueLabel: 'Queue 02',
    name: '2013 Chevrolet Corvette Z06',
    category: 'Track Coupe',
    year: '2013',
    description:
      'Loaded after the lead car so the canvas stays responsive while the local model queue advances one file at a time.',
    assetPath: '/cars_3D/2013-chevrolet-corvette-z06/source/2013_chevrolet_corvette_z06.glb',
    accent: '#f97316',
    rotationY: 0.18,
  },
  {
    id: 'mazda-vision-gran-turismo',
    queueLabel: 'Queue 03',
    name: 'Mazda Vision Gran Turismo',
    category: 'Concept Prototype',
    year: 'Concept',
    description:
      'The final progressive load completes the full lineup without front-loading every 3D asset on initial navigation.',
    assetPath: '/cars_3D/mazda-vision-rx-wwwvecarzcom/source/mazdaVisionGranTorismo.glb',
    accent: '#38bdf8',
    rotationY: -0.5,
  },
];

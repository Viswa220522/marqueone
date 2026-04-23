import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';

import GarageExperience from '@/components/garage3d/GarageExperience';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-garage-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Marque One Garage | 3D Experience',
  description: 'Explore the Marque One 3D garage inside the main Next.js experience.',
};

export default function GaragePage() {
  return (
    <div className={spaceGrotesk.variable}>
      <GarageExperience />
    </div>
  );
}

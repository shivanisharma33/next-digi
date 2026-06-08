import type { Metadata } from 'next';
import MissionVision from '../../components/MissionVision';

export const metadata: Metadata = {
  title: 'Mission & Vision | DigiPowerX - Megawatts to Silicon',
  description: 'Our purpose is to power the AI factory — delivering the sustainable power, cooling, compute, and connectivity for American supercomputing and superintelligence.',
  openGraph: {
    title: 'Mission & Vision | DigiPowerX - Megawatts to Silicon',
    description: 'Our purpose is to power the AI factory — delivering the sustainable power, cooling, compute, and connectivity for American supercomputing and superintelligence.',
  },
};

export default function Page() {
  return <MissionVision />;
}

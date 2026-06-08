import type { Metadata } from 'next';
import NeoCloudz from '../../components/NeoCloudz';

export const metadata: Metadata = {
  title: 'NeoCloudz | DigiPowerX - Bare-Metal GPU Compute Platform',
  description: 'Deploy dedicated bare-metal NVIDIA GPU capacity. Target high-density AI training, inference, and HPC workloads with real-time utilization telemetry.',
  openGraph: {
    title: 'NeoCloudz | DigiPowerX - Bare-Metal GPU Compute Platform',
    description: 'Deploy dedicated bare-metal NVIDIA GPU capacity. Target high-density AI training, inference, and HPC workloads with real-time utilization telemetry.',
  },
};

export default function Page() {
  return <NeoCloudz />;
}

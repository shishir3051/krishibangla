import { notFound } from 'next/navigation';
import { cropsData } from '@/data/cropsData';
import CropPageClient from './CropPageClient';

// Prerender every known crop (for each locale from the layout); anything else is a 404
// instead of an invented crop profile.
export function generateStaticParams() {
  return Object.keys(cropsData).map((id) => ({ id }));
}

export default async function CropPage({ params }: PageProps<'/[locale]/crops/[id]'>) {
  const { id } = await params;
  if (!Object.hasOwn(cropsData, id)) notFound();
  return <CropPageClient id={id} />;
}

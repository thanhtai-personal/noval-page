// src/seeder/sources.seed.ts

import { Source } from '@/schemas/source.schema';
import { Model } from 'mongoose';

export async function seedSources(sourceModel: Model<Source>) {
  const sources = [
    {
      name: 'Tangthuvien',
      baseUrl: 'https://truyen.tangthuvien.vn',
    },
    {
      name: 'Vtruyen',
      baseUrl: 'https://vtruyen.com',
    },
  ];

  for (const s of sources) {
    const exists = await sourceModel.findOne({ name: s.name });
    if (!exists) {
      await sourceModel.create(s);
    }
  }

  console.log('✅ Sources seeded');
}

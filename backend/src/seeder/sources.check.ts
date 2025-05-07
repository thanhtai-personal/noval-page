// src/seeder/sources.check.ts

import { Source } from '@/schemas/source.schema';
import { Model } from 'mongoose';

const expectedSources = ['Tangthuvien', 'Vtruyen'];

export async function checkSources(sourceModel: Model<Source>) {
  console.log('🔎 Checking sources...');
  let valid = true;

  for (const name of expectedSources) {
    const count = await sourceModel.countDocuments({ name });
    if (count === 1) {
      console.log(`✅ Source "${name}" exists exactly once`);
    } else {
      console.warn(`❌ Source "${name}" count: ${count}`);
      valid = false;
    }
  }

  if (valid) {
    console.log('✅ All sources are correctly seeded.');
  } else {
    console.warn('⚠️ Some sources are missing or duplicated.');
  }
}

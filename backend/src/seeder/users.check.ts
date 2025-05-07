// users.check.ts

import { User } from '@/schemas/user.schema';
import { Model } from 'mongoose';

const expectedUsers = [
  'superadmin@development.com',
  'admin@development.com',
  'reader@development.com',
];

export async function checkUsers(userModel: Model<User>) {
  console.log('🔎 Checking users...');
  let valid = true;

  for (const email of expectedUsers) {
    const count = await userModel.countDocuments({ email });
    if (count === 1) {
      console.log(`✅ User "${email}" exists exactly once`);
    } else {
      console.warn(`❌ User "${email}" count: ${count}`);
      valid = false;
    }
  }

  if (valid) {
    console.log('✅ All users are correctly seeded.');
  } else {
    console.warn('⚠️ Some users are missing or duplicated.');
  }
}

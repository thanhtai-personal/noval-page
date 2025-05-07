//roles.check.ts
import { Role } from '@/schemas/role.schema';
import { RoleSlug } from '@/constants/role.enum';
import { Model } from 'mongoose';

export async function checkRoles(roleModel: Model<Role>) {
  console.log('🔎 Checking roles...');
  let valid = true;

  for (const slug of Object.values(RoleSlug)) {
    const count = await roleModel.countDocuments({ slug });
    if (count === 1) {
      console.log(`✅ Role "${slug}" exists exactly once`);
    } else {
      console.warn(`❌ Role "${slug}" count: ${count}`);
      valid = false;
    }
  }

  if (valid) {
    console.log('✅ All roles are correctly seeded.');
  } else {
    console.warn('⚠️ Some roles are missing or duplicated.');
  }
}

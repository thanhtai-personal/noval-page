//roles.seed.ts

import { Role } from '@/schemas/role.schema';
import { RoleSlug } from '@/constants/role.enum';
import { Model } from 'mongoose';

export async function seedRoles(roleModel: Model<Role>) {
  const roles = [
    { slug: RoleSlug.SUPER_ADMIN, name: 'Super Admin' },
    { slug: RoleSlug.ADMIN, name: 'Admin' },
    { slug: RoleSlug.READER, name: 'Reader' },
  ];

  for (const r of roles) {
    const exists = await roleModel.findOne({ slug: r.slug });
    if (!exists) {
      await roleModel.create(r);
    }
  }

  console.log('✅ Roles seeded');
}

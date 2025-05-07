// users.seed.ts

import { User } from '@/schemas/user.schema';
import { Role } from '@/schemas/role.schema';
import { RoleSlug } from '@/constants/role.enum';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

export async function seedUsers(userModel: Model<User>, roleModel: Model<Role>) {
  const passwordMap = {
    [RoleSlug.SUPER_ADMIN]: process.env.SEED_SUPERADMIN_PASSWORD || '123456',
    [RoleSlug.ADMIN]: process.env.SEED_ADMIN_PASSWORD || '123456',
    [RoleSlug.READER]: process.env.SEED_READER_PASSWORD || '123456',
  };

  // Optional: Xoá bản ghi lỗi
  await userModel.deleteMany({ username: null });

  const users = [
    {
      email: 'superadmin@development.com',
      name: 'Super Admin',
      roleSlug: RoleSlug.SUPER_ADMIN,
    },
    {
      email: 'admin@development.com',
      name: 'Admin',
      roleSlug: RoleSlug.ADMIN,
    },
    {
      email: 'reader@development.com',
      name: 'Reader',
      roleSlug: RoleSlug.READER,
    },
  ];

  for (const u of users) {
    const exists = await userModel.findOne({ email: u.email });
    if (exists) continue;

    const role: any = await roleModel.findOne({ slug: u.roleSlug });
    const hashed = await bcrypt.hash(passwordMap[u.roleSlug], 10);

    await userModel.create({
      email: u.email,
      name: u.name,
      username: u.email.split('@')[0], // ✅ Add username here
      password: hashed,
      role: role._id,
    });
  }

  console.log('✅ Users seeded');
}

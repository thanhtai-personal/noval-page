import { User } from '@/schemas/user.schema';
import { HydratedDocument } from 'mongoose';

export class UserDataAndUserResponseMapper {
  constructor() {}
  async map(userData: HydratedDocument<User>) {
    const role = userData.role as any;
    return {
      email: userData.email,
      name: userData.name,
      exp: userData.exp,
      banned: userData.banned,
      coin: userData.coin,
      level: userData.levelNumber || 1,
      username: userData.username,
      role: {
        _id: role?._id,
        name: role?.name,
        slug: role?.slug,
      },
    };
  }
}

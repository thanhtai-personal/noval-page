import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '@/schemas/role.schema';
import { Model } from 'mongoose';
import { DBNames } from "@/utils/database";

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name, DBNames.ums) private roleModel: Model<Role>,
  ) {}

  async getRoles() {
    return this.roleModel.find().select('-__v');
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/schemas/user.schema';
import { Role } from '@/schemas/role.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async getUsers() {
    return this.userModel.find().populate('role', 'name slug').select('-__v');
  }

  async createUser(dto: CreateUserDto) {
    const role = dto.role ? await this.roleModel.findById(dto.role) : null;

    return this.userModel.create({
      name: dto.name,
      email: dto.email,
      role: role?._id,
    });
  }
}

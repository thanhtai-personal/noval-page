import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/schemas/user.schema';
import { Role } from '@/schemas/role.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

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

  async findAll({ search, role, page, limit }: any) {
    const query: any = {};

    if (search) {
      query.$or = [
        { email: new RegExp(search, 'i') },
        { name: new RegExp(search, 'i') },
      ];
    }

    if (role) {
      query.role = role;
    }

    const total = await this.userModel.countDocuments(query);
    const items = await this.userModel
      .find(query)
      .populate('role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      items,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(dto: any) {
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.userModel.create({
      email: dto.email,
      name: dto.name,
      password: hashed,
      role: dto.role,
      username: dto.email.split('@')[0],
    });
  }

  async update(id: string, dto: any) {
    return this.userModel.findByIdAndUpdate(id, {
      email: dto.email,
      name: dto.name,
      role: dto.role,
    }, { new: true });
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async ban(id: string) {
    return this.userModel.findByIdAndUpdate(id, { banned: true });
  }
}

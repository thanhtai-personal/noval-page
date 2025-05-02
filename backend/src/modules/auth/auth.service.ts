import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { User } from '@/schemas/user.schema';
import { Role } from '@/schemas/role.schema';

const googleClient = new OAuth2Client();

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    private readonly jwtService: JwtService,
  ) {}

  // 🟢 LOGIN THƯỜNG
  async login(email: string, name: string) {
    const user = await this.validateOrCreateUser(email, name);
    return this.issueTokensAndStore(user);
  }

  // 🔵 GOOGLE LOGIN
  async loginWithGoogle(idToken: string) {
    const ticket = await googleClient.verifyIdToken({ idToken });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new UnauthorizedException('Token Google không hợp lệ');
    }

    const email = payload.email;
    const name = payload.name || 'Người dùng Google';

    let user = await this.userModel.findOne({ email }).populate('role');
    if (!user) {
      const readerRole = await this.roleModel.findOne({ slug: 'reader' });
      user = await this.userModel.create({
        email,
        name,
        role: readerRole?._id,
      });
    }

    return this.issueTokensAndStore(user);
  }

  // 🔁 REFRESH TOKEN
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecret123',
      });

      const user = await this.userModel.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException();
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      const newAccessToken = this.jwtService.sign(
        {
          sub: user._id,
          email: user.email,
          role: payload.role,
        },
      );

      return { access_token: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  // 🔚 ĐĂNG XUẤT
  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Đã đăng xuất' };
  }

  // 📦 HÀM PHỤ TRỢ – Tạo user nếu chưa có
  async validateOrCreateUser(email: string, name: string) {
    let user = await this.userModel.findOne({ email }).populate('role');
    if (!user) {
      const readerRole = await this.roleModel.findOne({ slug: 'reader' });
      user = await this.userModel.create({
        email,
        name,
        role: readerRole?._id,
      });
    }
    return user;
  }

  // 🎁 Sinh token & lưu refreshToken hash vào DB
  async issueTokensAndStore(user: any) {
    const jwtPayload = {
      sub: user._id,
      email: user.email,
      role: typeof user.role === 'object' ? user.role?.slug : 'reader',
    };

    const access_token = this.jwtService.sign(jwtPayload);
    const refresh_token = this.jwtService.sign(jwtPayload, {
      expiresIn: '14d',
      secret: process.env.JWT_REFRESH_SECRET || 'refreshSecret123',
    });

    const hashedRt = await bcrypt.hash(refresh_token, 10);
    await this.userModel.findByIdAndUpdate(user._id, { refreshToken: hashedRt });

    return {
      access_token,
      refresh_token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: jwtPayload.role,
      },
    };
  }

  async register(email: string, name: string, password: string) {
    const exists = await this.userModel.findOne({ email });
    if (exists) throw new UnauthorizedException('Email đã tồn tại');
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const readerRole = await this.roleModel.findOne({ slug: 'reader' });
  
    const user = await this.userModel.create({
      email,
      name,
      password: hashedPassword,
      role: readerRole?._id,
    });
  
    return this.issueTokensAndStore(user);
  }
  
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) return { message: 'Nếu email tồn tại, liên kết đã được gửi' };
  
    const payload = {
      sub: user._id,
      email: user.email,
      type: 'password_reset',
    };
  
    const token = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_PASSWORD_SECRET || 'pwResetSecret',
    });
  
    // 🔧 Bạn có thể gửi mail ở đây - hiện tại mock lại bằng console
    console.log(`🔐 Link reset: https://your-domain/reset-password?token=${token}`);
  
    return { message: 'Liên kết đặt lại mật khẩu đã được gửi (mock)' };
  }
  
  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_PASSWORD_SECRET || 'pwResetSecret',
      });
  
      if (payload.type !== 'password_reset') {
        throw new UnauthorizedException('Token không hợp lệ');
      }
  
      const hashed = await bcrypt.hash(newPassword, 10);
      await this.userModel.findByIdAndUpdate(payload.sub, {
        password: hashed,
        refreshToken: null, // hủy session cũ
      });
  
      return { message: 'Đặt lại mật khẩu thành công' };
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}

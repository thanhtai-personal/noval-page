import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  async login(email: string, password: string) {
    if (password === 'google_user') {
      throw new UnauthorizedException('Vui lòng sử dụng Google để đăng nhập');
    }
    let user = await this.userModel.findOne({ email }).populate('role');
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }
    return this.issueTokensAndStore(user);
  }

  // 🔵 GOOGLE LOGIN
  private async handleGoogleUser(googleInfo: {
    email: string;
    name?: string;
    picture?: string;
  }) {
    const { email, name, picture } = googleInfo;
    let user: any = await this.userModel.findOne({ email }).populate('role');

    // Nếu chưa có thì tạo mới với role reader
    if (!user) {
      const readerRole = await this.roleModel.findOne({ slug: 'reader' });
      user = await this.userModel.create({
        email,
        name,
        password: await bcrypt.hash('google_user', 10),
        role: readerRole?._id,
      });
    }

    // update nếu thiếu thông tin
    if (!user.name && name) {
      user.name = name;
      await user.save();
    }

    return this.issueTokensAndStore(user);
  }

  //🔵 GOOGLE LOGIN
  async googleLogin(user: any) {
    return this.handleGoogleUser({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      picture: user.picture,
    });
  }

  //🔵 GOOGLE LOGIN with id token
  async loginWithGoogle(idToken: string) {
    const ticket = await googleClient.verifyIdToken({ idToken });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new UnauthorizedException('Token Google không hợp lệ');
    }

    return this.handleGoogleUser({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });
  }

  // 🔁 REFRESH TOKEN
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userModel.findById(payload.sub).populate('role');
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const newAccessToken = this.jwtService.sign(
        {
          sub: user._id,
          email: user.email,
          role: user.role,
        },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // 🔚 ĐĂNG XUẤT
  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Đã đăng xuất' };
  }

  // 📦 HÀM PHỤ TRỢ – Tạo user nếu chưa có
  async validateOrCreateUser(email: string, password: string) {
    let user = await this.userModel.findOne({ email }).populate('role');
    if (!user) {
      const readerRole = await this.roleModel.findOne({ slug: 'reader' });
      user = await this.userModel.create({
        email,
        password: await bcrypt.hash(password, 10),
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
      role: typeof user.role === 'object' ? user.role?.slug : 'Reader',
    };

    const access_token = this.jwtService.sign(jwtPayload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
    });
    const refresh_token = this.jwtService.sign(jwtPayload, {
      expiresIn: '14d',
      secret: process.env.JWT_SECRET,
    });

    const hashedRt = await bcrypt.hash(refresh_token, 10);
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: hashedRt,
    });

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
    console.log(
      `🔐 Link reset: https://your-domain/reset-password?token=${token}`,
    );

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

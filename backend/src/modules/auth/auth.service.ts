import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
// import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { User } from '@/schemas/user.schema';
import { Role } from '@/schemas/role.schema';
import axios from "axios";

// const googleClient = new OAuth2Client();

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    private readonly jwtService: JwtService,
  ) { }

  async login(email: string, password: string) {
    if (password === 'google_user') {
      throw new UnauthorizedException('Vui lòng sử dụng Google để đăng nhập');
    }

    const user = await this.userModel.findOne({ email }).populate('role');
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Mật khẩu không đúng');

    return this.issueTokensAndStore(user);
  }

  async googleLogin(user: any) {
    return this.handleGoogleUser({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      picture: user.picture,
    });
  }

  async loginWithGoogle(code: string) {
    try {
      const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'postmessage',
        grant_type: 'authorization_code',
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { id_token, access_token } = tokenRes.data;

      if (!id_token || !access_token) {
        throw new UnauthorizedException('Không nhận được token từ Google');
      }

      // Step 2: Get user info from Google
      const profileRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const profile = profileRes.data;

      if (!profile?.email) {
        throw new UnauthorizedException('Không lấy được email từ Google');
      }

      return this.handleGoogleUser({
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      });
    } catch (err) {
      //invalid_client error
      console.error('Google login error', err?.response?.data || err.message);
      throw new UnauthorizedException('Đăng nhập Google thất bại');
    }
  }

  private async handleGoogleUser(googleInfo: {
    email: string;
    name?: string;
    picture?: string;
  }) {
    const { email, name } = googleInfo;
    let user: any = await this.userModel.findOne({ email }).populate('role');

    if (!user) {
      const readerRole = await this.roleModel.findOne({ slug: 'reader' });
      user = await this.userModel.create({
        email,
        name,
        password: await bcrypt.hash('google_user', 10),
        role: readerRole?._id,
      });
    }

    if (!user.name && name) {
      user.name = name;
      await user.save();
    }

    return this.issueTokensAndStore(user);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userModel.findById(payload.sub).populate('role');
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('User không tồn tại hoặc chưa lưu refresh token');
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      return {
        accessToken: this.jwtService.sign(this.buildPayload(user), {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m',
        }),
        refreshToken: this.jwtService.sign(this.buildPayload(user), {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '14d',
        }),
      };
    } catch {
      throw new UnauthorizedException('Token hết hạn hoặc không hợp lệ');
    }
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Đã đăng xuất' };
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
        refreshToken: null,
      });

      return { message: 'Đặt lại mật khẩu thành công' };
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  private buildPayload(user: any) {
    return {
      sub: user._id.toString(),
      email: user.email,
      role: typeof user.role === 'object' ? user.role?.slug : user.role || 'Reader',
    };
  }

  private async issueTokensAndStore(user: any) {
    const payload = this.buildPayload(user);

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '14d',
      secret: process.env.JWT_REFRESH_SECRET,
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
        role: payload.role,
      },
    };
  }
}

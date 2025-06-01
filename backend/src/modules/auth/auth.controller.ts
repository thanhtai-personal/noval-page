import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Throttle } from '@nestjs/throttler';
import { Roles } from './decorators/roles.decorator';
import { RoleSlug } from '@/constants/role.enum';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard) //But only do this if you haven't already applied JwtAuthGuard globally in main.ts.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔗 Đăng nhập bằng Google
  @Public()
  @Post('google')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.loginWithGoogle(dto.idToken);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Google login successful', user };
  }

  //--
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() _req) {
    // Guard sẽ xử lý chuyển hướng
  }

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const token = await this.authService.googleLogin(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }

  // 🔐 Đăng nhập bằng email + mật khẩu
  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } = await this.authService.login(
      dto.email,
      dto.password,
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 ngày
    });

    return { message: 'Login successful', user };
  }

  // 🚪 Logout
  @Public()
  @Post('logout')
  async logout(
    @CurrentUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return await this.authService.logout(userId);
  }

  // 👤 Lấy thông tin người dùng hiện tại
  @Get('me')
  @Roles(RoleSlug.READER, RoleSlug.ADMIN, RoleSlug.SUPER_ADMIN)
  me(@CurrentUser() user: any) {
    return user;
  }

  // 📝 Đăng ký tài khoản
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto.email, dto.name, dto.password);
  }

  // 📩 Gửi email khôi phục mật khẩu
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto.email);
  }

  // 🔑 Đặt lại mật khẩu
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rt = req.cookies?.refresh_token;
    if (!rt) throw new UnauthorizedException('Thiếu refresh_token');

    const newTokens = await this.authService.refreshToken(rt);

    res.cookie('access_token', newTokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Token refreshed' };
  }
}

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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔗 Đăng nhập bằng Google
  @Public()
  @Post('google')
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(dto.idToken);
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
    const { access_token: token } = await this.authService.login(
      dto.email,
      dto.password,
    );
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { message: 'Login successful' };
  }

  // 🚪 Logout
  @Post('logout')
  @Roles(RoleSlug.READER, RoleSlug.ADMIN, RoleSlug.SUPER_ADMIN)
  logout(
    @CurrentUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('access_token');
    return this.authService.logout(userId);
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
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.name, dto.password);
  }

  // 📩 Gửi email khôi phục mật khẩu
  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  // 🔑 Đặt lại mật khẩu
  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rt = req.cookies?.refresh_token;
    if (!rt) throw new UnauthorizedException('Thiếu refresh_token');

    const newTokens = await this.authService.refreshToken(rt);

    res.cookie('access_token', newTokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return { message: 'Token refreshed' };
  }
}

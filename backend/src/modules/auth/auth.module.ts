import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Role, RoleSchema } from '@/schemas/role.schema';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { DBNames } from '@/utils/database';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret123',
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Role.name, schema: RoleSchema },
      ],
      DBNames.ums,
    ),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GoogleOAuthGuard],
})
export class AuthModule {}

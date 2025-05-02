import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string; // chỉ tạm dùng, sau có thể thay bằng mật khẩu
}

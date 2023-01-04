import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string
}

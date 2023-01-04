import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dtos/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('authenticate')
  public async authenticate(@Body() authDto: AuthDto) {
    return await this.authService.authenticate(authDto)
  }

  @HttpCode(HttpStatus.OK)
  @Get('confirm-email')
  public async confirmEmail(@Query('accessToken') accessToken: string) {
    return await this.authService.confirmEmail(accessToken)
  }
}

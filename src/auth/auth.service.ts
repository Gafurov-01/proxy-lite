import { MailerService } from '@nestjs-modules/mailer'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dtos/auth.dto'
import { AuthResponse } from './interfaces/auth.response'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async authenticate(authDto: AuthDto): Promise<AuthResponse> {
    const user = await this.userService.getByEmail(authDto.email)
    let accessToken

    if (!user) {
      const newUser = await this.userService.createUser(authDto)
      accessToken = await this.generateToken(newUser)

      await this.sendEmailConfirmation(
        newUser.email,
        this.getTextEmailConfirmation(accessToken),
      )

      return {
        ...newUser,
        accessToken: accessToken,
      }
    }

    accessToken = await this.generateToken(user)
    user.isEmailConfirmed === false &&
      (await this.sendEmailConfirmation(
        user.email,
        this.getTextEmailConfirmation(accessToken),
      ))

    return {
      ...user,
      accessToken: accessToken,
    }
  }

  public async confirmEmail(accessToken: string) {
    try {
      const { sub } = await this.jwtService.verifyAsync(accessToken)
      return await this.userService.markEmailAsConfirmed(sub)
    } catch (error) {
      throw new ForbiddenException('Jwt is not valid')
    }
  }

  private async generateToken(user: UserEntity) {
    return await this.jwtService.signAsync({
      sub: user.id,
    })
  }

  private getTextEmailConfirmation(accessToken: string) {
    return `Нажмите сюда: ${this.configService.get(
      'HOST',
    )}/auth/confirm-email?accessToken=${accessToken}, чтобы подтвердить свою почту`
  }

  private async sendEmailConfirmation(to: string, text: string) {
    await this.mailService.sendMail({
      to: to,
      from: this.configService.get('USER_EMAIL'),
      subject: 'ПОДТВЕРДИТЕ СВОЮ ПОЧТУ!',
      text: text,
    })
  }
}

import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export const getEmailConfig = (
  configService: ConfigService,
): MailerOptions => ({
  transport: {
    host: 'smtp.mail.ru',
    auth: {
      user: configService.get('USER_EMAIL'),
      pass: configService.get('PASSWORD_EMAIL'),
    },
  },
})

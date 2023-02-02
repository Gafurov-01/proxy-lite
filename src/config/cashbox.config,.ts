import { HttpModuleOptions } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'

export const getCashboxHttpConfig = (
  configService: ConfigService,
): HttpModuleOptions => ({
  baseURL: configService.get('CASHBOX_API_URL'),
})

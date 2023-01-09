import { HttpModuleOptions } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'

export const getHttpConfig = (
  configService: ConfigService,
): HttpModuleOptions => ({})

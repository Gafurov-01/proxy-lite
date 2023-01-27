import { HttpModuleOptions } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { base64decode } from 'nodejs-base64'

const getHeader = (configService: ConfigService) => {
  return base64decode(
    configService.get('PSYHO_SHARK_API_LOGIN') +
      ':' +
      configService.get('PSYHO_SHARK_API_PASSWORD'),
  )
}

export const getPsychoSharkHttpConfig = (
  configService: ConfigService,
): HttpModuleOptions => ({
  baseURL: configService.get('PSYHO_SHARK_API_URL'),
  headers: {
    Authorization: `Basic ${getHeader(configService)}`,
  },
})

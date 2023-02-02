import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getCashboxHttpConfig } from 'src/config/cashbox.config,'
import { CashboxService } from './cashbox.service'

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getCashboxHttpConfig,
    }),
    ConfigModule,
  ],
  providers: [CashboxService],
})
export class CashboxModule {}

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigService } from '@nestjs/config/dist'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { getDbConfig } from './config/db.config'
import { CurrencyModule } from './currency/currency.module'
import { OrderModule } from './order/order.module'
import { PaymentModule } from './payment/payment.module'
import { TariffModule } from './tariff/tariff.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDbConfig,
    }),
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PaymentModule,
    TariffModule,
    OrderModule,
    CurrencyModule,
  ],
})
export class AppModule {}

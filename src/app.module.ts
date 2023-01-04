import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigService } from '@nestjs/config/dist'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { getDbConfig } from './config/db.config'
import { UserModule } from './user/user.module'
import { PaymentModule } from './payment/payment.module';

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
  ],
})
export class AppModule {}

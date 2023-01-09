import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getHttpConfig } from 'src/config/http-module.config'
import { PaymentController } from './payment.controller'
import { PaymentEntity } from './payment.entity'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getHttpConfig,
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

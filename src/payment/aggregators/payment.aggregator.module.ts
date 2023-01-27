import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { forwardRef } from '@nestjs/common/utils'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getPsychoSharkHttpConfig } from 'src/config/psycho-shark.http-options'
import { PaymentModule } from '../payment.module'
import { PaymentAggregatorController } from './payment-aggregator.controller'
import { PaymentAggregatorEntity } from './payment-aggregator.entity'
import { PaymentAggregatorService } from './payment-aggregator.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentAggregatorEntity]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getPsychoSharkHttpConfig,
    }),
    forwardRef(() => PaymentModule),
  ],
  controllers: [PaymentAggregatorController],
  providers: [PaymentAggregatorService],
  exports: [PaymentAggregatorService],
})
export class PaymentAggregatorModule {}

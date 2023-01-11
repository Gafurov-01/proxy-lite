import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentAggregator } from './aggregators/payment-aggregator.entity'
import { PaymentController } from './payment.controller'
import { PaymentEntity } from './payment.entity'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity, PaymentAggregator]),
    HttpModule.registerAsync({}),
    ConfigModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

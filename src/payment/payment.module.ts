import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderModule } from 'src/order/order.module'
import { PaymentAggregatorModule } from './aggregators/payment.aggregator.module'
import { PaymentController } from './payment.controller'
import { PaymentEntity } from './payment.entity'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    HttpModule.registerAsync({}),
    ConfigModule,
    OrderModule,
    PaymentAggregatorModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

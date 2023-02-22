import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { forwardRef } from '@nestjs/common/utils'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderModule } from 'src/order/order.module'
import { UserModule } from 'src/user/user.module'
import { PaymentAggregatorModule } from './aggregators/payment.aggregator.module'
import { PaymentController } from './payment.controller'
import { PaymentEntity } from './payment.entity'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    HttpModule,
    ConfigModule,
    OrderModule,
    forwardRef(() => PaymentAggregatorModule),
    UserModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}

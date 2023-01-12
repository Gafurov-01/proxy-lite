import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentAggregator } from './payment-aggregator.entity'
import { PaymentAggregatorService } from './payment-aggregator.service'

@Module({
  imports: [TypeOrmModule.forFeature([PaymentAggregator])],
  controllers: [],
  providers: [PaymentAggregatorService],
  exports: [PaymentAggregatorService],
})
export class PaymentAggregatorModule {}

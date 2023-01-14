import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CurrencyModule } from 'src/currency/currency.module'
import { OrderController } from './order.controller'
import { OrderEntity } from './order.entity'
import { OrderService } from './order.service'

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), CurrencyModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

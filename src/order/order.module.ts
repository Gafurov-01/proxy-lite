import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { OrderController } from './order.controller'
import { OrderEntity } from './order.entity'
import { OrderService } from './order.service'

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), UserModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

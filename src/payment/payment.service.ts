import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { OrderService } from 'src/order/order.service'
import { UserEntity } from 'src/user/user.entity'
import { Repository } from 'typeorm'
import { PaymentAggregatorService } from './aggregators/payment-aggregator.service'
import { CreatePaymentDto } from './dtos/create-payment.dto'
import { MethodType } from './methods/payment-method.entity'
import { PaymentEntity } from './payment.entity'

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly orderService: OrderService,
    private readonly paymentAggregatorService: PaymentAggregatorService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async createPayment(
    createPaymentDto: CreatePaymentDto,
    user: UserEntity,
  ) {
    const order = await this.orderService.getById(createPaymentDto.orderId)

    const newPayment = await this.paymentRepository.create({
      method: createPaymentDto.method,
      user: user,
      order: order,
      description: `${user.email}, хотите купить тариф ${order.nameProxy} на сайте https://proxy-lite.com`,
    })
    await this.paymentRepository.save(newPayment)

    const aggregator = await this.getAggregator(createPaymentDto.method)

    return await aggregator.createPayment(
      this.httpService,
      this.configService,
      newPayment,
    )
  }

  private async getAggregator(method: MethodType) {
    return await this.paymentAggregatorService.getByMethod(method)
  }
}

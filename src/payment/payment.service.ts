import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { forwardRef } from '@nestjs/common/utils'
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
    @Inject(forwardRef(() => PaymentAggregatorService))
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
      description: `Ваша почта:${user.email}. Ваш тариф:${order.nameProxy} за ${order.amount}. На сайте https://proxy-lite.com`,
    })
    await this.paymentRepository.save(newPayment)

    const aggregator = await this.getAggregator(createPaymentDto.method)

    return await aggregator.createPayment(
      this.httpService,
      this.configService,
      newPayment,
    )
  }

  public async getById(id: string) {
    return await this.paymentRepository.findOneBy({ id })
  }

  public async save(payment: PaymentEntity) {
    await this.paymentRepository.save(payment)
  }

  private async getAggregator(method: MethodType) {
    return await this.paymentAggregatorService.getByMethod(method)
  }
}

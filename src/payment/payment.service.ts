import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { ForbiddenException } from '@nestjs/common/exceptions'
import { forwardRef } from '@nestjs/common/utils'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { OrderService } from 'src/order/order.service'
import { PsychoSharkService } from 'src/psycho-shark/psycho-shark.service'
import { UserEntity } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { PaymentAggregatorService } from './aggregators/payment-aggregator.service'
import { CreatePaymentDto } from './dtos/create-payment.dto'
import { ReplenishBalanceDto } from './dtos/replenish-balance.dto'
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
    private readonly psychoSharkService: PsychoSharkService,
    private readonly userService: UserService,
  ) {}

  public async buyOrder(createPaymentDto: CreatePaymentDto, user: UserEntity) {
    const orders = await this.orderService.getByIds(createPaymentDto.orderIds)

    const newPayment = await this.paymentRepository.create({
      method: createPaymentDto.method,
      user: user,
      orders: orders,
    })
    await this.paymentRepository.save(newPayment)

    if (createPaymentDto.method !== MethodType.MY_BALANCE) {
      const aggregator = await this.getAggregator(createPaymentDto.method)

      return await aggregator.createPayment(
        this.httpService,
        this.configService,
        newPayment,
      )
    } else {
      if (user.balance >= this.orderService.getOrdersSum(orders)) {
        try {
          await this.psychoSharkService.usePsychoSharkApi(newPayment)
          user.balance -= this.orderService.getOrdersSum(orders)
          await this.userService.save(user)
        } catch (error) {
          return error
        }
      } else {
        throw new ForbiddenException('Insufficient funds!')
      }
    }
  }

  public async replenishBalance(
    replenishBalanceDto: ReplenishBalanceDto,
    user: UserEntity,
  ) {
    const newOrder = await this.orderService.createOrder(
      {
        amount: replenishBalanceDto.amount,
      },
      user,
    )
    const newPayment = await this.paymentRepository.create({
      method: replenishBalanceDto.method,
      user: user,
      orders: [newOrder],
      isReplenishment: true,
    })
    await this.paymentRepository.save(newPayment)

    const aggregator = await this.getAggregator(replenishBalanceDto.method)

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

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MethodType } from '../methods/payment-method.entity'
import { PaymentAggregator } from './payment-aggregator.entity'

@Injectable()
export class PaymentAggregatorService {
  constructor(
    @InjectRepository(PaymentAggregator)
    private readonly paymentAggregatorRepository: Repository<PaymentAggregator>,
  ) {}

  public async getByMethod(method: MethodType) {
    return await this.paymentAggregatorRepository.findOne({
      where: {
        paymentMethods: {
          type: method,
        },
      },
    })
  }
}

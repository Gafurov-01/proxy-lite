import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BuyKeyDto } from './dtos/buy-key.dto'
import { PaymentEntity } from './payment.entity'

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  public async createKeyDto(buyKeyDto: BuyKeyDto) {}
}

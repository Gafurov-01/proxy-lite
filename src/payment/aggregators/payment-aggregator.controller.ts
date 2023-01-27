import { Controller } from '@nestjs/common'
import { PaymentAggregatorService } from './payment-aggregator.service'

@Controller()
export class PaymentAggregatorController {
  constructor(
    private readonly paymentAggregatorService: PaymentAggregatorService,
  ) {}
}

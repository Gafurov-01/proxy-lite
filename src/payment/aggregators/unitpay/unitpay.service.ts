import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common'
import { PaymentStatus } from 'src/payment/payment.entity'
import { PaymentService } from 'src/payment/payment.service'
import { PsychoSharkService } from 'src/psycho-shark/psycho-shark.service'
import { QueryUnitPay } from './query-params.unit-pay'

@Injectable()
export class UnitPayService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly psychoSharkService: PsychoSharkService,
  ) {}

  public async handleNotification(notificationParams: QueryUnitPay) {
    const payment = await this.paymentService.getById(
      notificationParams.account,
    )

    if (!payment.isReplenishment) {
      if (notificationParams.method === 'pay') {
        await this.psychoSharkService.usePsychoSharkApi(
          payment,
          notificationParams.unitpayId,
        )
      } else if (notificationParams.method === 'error') {
        payment.status = PaymentStatus.CANCELED
        payment.aggregatorOperationId = notificationParams.unitpayId
        await this.paymentService.save(payment)

        throw new HttpException(
          'Payment has been failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }
    } else {
      payment.user.balance = notificationParams.orderSum
      payment.status = PaymentStatus.SUCCEEDED
      payment.orders[0].isBought = true
      payment.aggregatorOperationId = notificationParams.unitpayId
      await this.paymentService.save(payment)
    }
  }
}

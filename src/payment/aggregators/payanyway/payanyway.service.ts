import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { MethodType } from 'src/payment/methods/payment-method.entity'
import { PaymentStatus } from 'src/payment/payment.entity'
import { PaymentService } from 'src/payment/payment.service'
import { PsychoSharkService } from 'src/psycho-shark/psycho-shark.service'
import { QueryPayAnyWay } from './query-params.pay-any-way'

@Injectable()
export class PayAnyWayService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly psychoSharkService: PsychoSharkService,
  ) {}

  public async handleNotification(notificationParams: QueryPayAnyWay) {
    const payment = await this.paymentService.getById(
      notificationParams.MNT_TRANSACTION_ID,
    )

    if (payment.method !== MethodType.MY_BALANCE) {
      await this.psychoSharkService.usePsychoSharkApi(
        payment,
        notificationParams.MNT_OPERATION_ID,
      )
    } else {
      payment.user.balance = notificationParams.MNT_AMOUNT
      payment.status = PaymentStatus.SUCCEEDED
      payment.order.isBought = true
      payment.aggregatorOperationId = notificationParams.MNT_OPERATION_ID
      await this.paymentService.save(payment)
    }
  }
}

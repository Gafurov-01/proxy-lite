import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { MethodType } from 'src/payment/methods/payment-method.entity'
import { PaymentStatus } from 'src/payment/payment.entity'
import { PaymentService } from 'src/payment/payment.service'
import { PsychoSharkService } from 'src/psycho-shark/psycho-shark.service'
import { CryptomusNotificationParams } from './notification-params.cryptomus'

@Injectable()
export class CryptomusService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly psychoSharkService: PsychoSharkService,
  ) {}

  public async handleNotification(
    notificationParams: CryptomusNotificationParams,
  ) {
    const payment = await this.paymentService.getById(
      notificationParams.order_id,
    )

    if (payment.method !== MethodType.MY_BALANCE) {
      await this.psychoSharkService.usePsychoSharkApi(payment)
    } else {
      payment.user.balance = +notificationParams.payment_amount_usd
      payment.status = PaymentStatus.SUCCEEDED
      payment.order.isBought = true
      await this.paymentService.save(payment)
    }
  }
}

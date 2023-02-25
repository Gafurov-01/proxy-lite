import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CashboxService } from 'src/payment/cashbox/cashbox.service'
import { PaymentService } from 'src/payment/payment.service'
import { PsychoSharkService } from 'src/psycho-shark/psycho-shark.service'
import { CryptomusNotificationParams } from './notification-params.cryptomus'

@Injectable()
export class CryptomusService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly psychoSharkService: PsychoSharkService,
    private readonly cashboxService: CashboxService,
  ) {}

  public async handleNotification(
    notificationParams: CryptomusNotificationParams,
  ) {
    const payment = await this.paymentService.getById(
      notificationParams.order_id,
    )

    if (!payment.isReplenishment) {
      await this.psychoSharkService.createKey(payment)
      await this.cashboxService.printCheck(payment)
    }
  }
}

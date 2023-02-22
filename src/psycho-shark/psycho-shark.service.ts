import { HttpService } from '@nestjs/axios'
import { forwardRef, HttpException, HttpStatus, Inject } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { firstValueFrom } from 'rxjs'
import { CashboxService } from 'src/payment/cashbox/cashbox.service'
import { PaymentEntity, PaymentStatus } from 'src/payment/payment.entity'
import { PaymentService } from 'src/payment/payment.service'

@Injectable()
export class PsychoSharkService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly httpService: HttpService,
    private readonly cashboxService: CashboxService,
  ) {}

  public async usePsychoSharkApi(
    payment: PaymentEntity,
    aggregatorOperationId?: number,
  ) {
    try {
      for (let order of payment.orders) {
        const { data } = await firstValueFrom(
          this.httpService.post(
            '/key',
            {},
            {
              params: {
                serverTag: order.country,
                rotatePeriodSec: order.rotatePeriodSec,
                allowedDestinations: [
                  '*recaptcha.ne',
                  'google.*',
                  'www.google.*',
                  '*gstatic.*',
                  'monitor.capmonster.app',
                ],
                disabledDestinations: [],
                threadLimit: order.threadLimit,
                ttlSec: order.ttlSec,
                description: payment.description,
              },
            },
          ),
        )
        await firstValueFrom(
          this.httpService.put(
            '/key/registerKey',
            {},
            {
              params: {
                key: data.key,
                userId: payment.user.id,
              },
            },
          ),
        )

        payment.status = PaymentStatus.SUCCEEDED
        payment.psychoSharkKey = data.key
        payment.aggregatorOperationId =
          aggregatorOperationId && aggregatorOperationId
        payment.orders.find(
          (paymentOrder) => paymentOrder.id === order.id,
        ).isBought = true

        await this.paymentService.save(payment)
        await this.cashboxService.printCheck(payment)
      }
    } catch (error) {
      payment.status = PaymentStatus.CANCELED
      payment.aggregatorOperationId =
        aggregatorOperationId && aggregatorOperationId
      await this.paymentService.save(payment)
      throw new HttpException(
        'PsychoShark API behaved wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}

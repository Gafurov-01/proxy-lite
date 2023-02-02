import { HttpService } from '@nestjs/axios'
import { forwardRef, HttpException, HttpStatus, Inject } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { firstValueFrom } from 'rxjs'
import { PaymentEntity, PaymentStatus } from 'src/payment/payment.entity'
import { PaymentService } from 'src/payment/payment.service'

@Injectable()
export class PsychoSharkService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly httpService: HttpService,
  ) {}

  public async usePsychoSharkApi(
    payment: PaymentEntity,
    aggregatorOperationId?: number,
  ) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          '/key',
          {},
          {
            params: {
              serverTag: payment.order.country,
              rotatePeriodSec: payment.order.rotatePeriodSec,
              allowedDestinations: [
                '*recaptcha.ne',
                'google.*',
                'www.google.*',
                '*gstatic.*',
                'monitor.capmonster.app',
              ],
              disabledDestinations: [],
              threadLimit: payment.order.threadLimit,
              ttlSec: payment.order.ttlSec,
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
      payment.order.isBought = true
      await this.paymentService.save(payment)
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

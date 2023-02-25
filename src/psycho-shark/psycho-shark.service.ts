import { HttpService } from '@nestjs/axios'
import { forwardRef, HttpException, HttpStatus, Inject } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { firstValueFrom } from 'rxjs'
import { Country } from 'src/order/order.entity'
import { PaymentEntity, PaymentStatus } from 'src/payment/payment.entity'
import { PaymentService } from 'src/payment/payment.service'

@Injectable()
export class PsychoSharkService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly httpService: HttpService,
  ) {}

  public async createKey(
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
                serverTag:
                  order.country === Country.BRAZIL
                    ? 'NL-BRAZIL-1'
                    : order.country === Country.FRANCE
                    ? 'NL-FRANCE-1'
                    : order.country === Country.INDIA
                    ? 'NL-INDIA-1'
                    : order.country === Country.NETHERLAND
                    ? 'NL-AMS-1'
                    : order.country === Country.RUSSIA
                    ? 'RU-MSK-1'
                    : order.country === Country.USA
                    ? 'NL-USA-1'
                    : '',
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

        order.psychoSharkKey = data.key
        order.isBought = true
      }
      payment.status = PaymentStatus.SUCCEEDED
      payment.aggregatorOperationId =
        aggregatorOperationId && aggregatorOperationId
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

  public async removeKey(payment: PaymentEntity) {
    for (let order of payment.orders) {
      await firstValueFrom(
        this.httpService.delete('/key', {
          params: {
            key: order.psychoSharkKey,
          },
        }),
      )
    }
  }
}

import { HttpService } from '@nestjs/axios'
import { HttpException, Inject, Injectable } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums'
import { forwardRef } from '@nestjs/common/utils'
import { InjectRepository } from '@nestjs/typeorm'
import { firstValueFrom } from 'rxjs'
import { Repository } from 'typeorm'
import { MethodType } from '../methods/payment-method.entity'
import { PaymentEntity, PaymentStatus } from '../payment.entity'
import { PaymentService } from '../payment.service'
import { PaymentAggregatorEntity } from './payment-aggregator.entity'
import { QueryPayAnyWay } from './query-params/query-params.pay-any-way'
import { QueryUnitPay } from './query-params/query-params.unit-pay'

@Injectable()
export class PaymentAggregatorService {
  constructor(
    @InjectRepository(PaymentAggregatorEntity)
    private readonly paymentAggregatorRepository: Repository<PaymentAggregatorEntity>,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly httpService: HttpService,
  ) {}

  public async handleNotificationPayAnyWay(queryParams: QueryPayAnyWay) {
    const payment = await this.paymentService.getById(
      queryParams.MNT_TRANSACTION_ID,
    )

    await this.usePsychoSharkApi(payment, queryParams.MNT_OPERATION_ID)
  }

  public async handleNotificationUnitPay(queryParams: QueryUnitPay) {
    const payment = await this.paymentService.getById(queryParams.account)

    if (queryParams.method === 'pay') {
      await this.usePsychoSharkApi(payment, queryParams.unitpayId)
    } else if (queryParams.method === 'error') {
      payment.status = PaymentStatus.CANCELED
      payment.aggregatorOperationId = queryParams.unitpayId
      await this.paymentService.save(payment)

      throw new HttpException(
        'Payment has been failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  public async getByMethod(method: MethodType) {
    return await this.paymentAggregatorRepository.findOne({
      where: {
        paymentMethods: {
          type: method,
        },
      },
    })
  }

  private async usePsychoSharkApi(
    payment: PaymentEntity,
    aggregatorOperationId: number,
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
      payment.aggregatorOperationId = aggregatorOperationId
      payment.order.isBought = true
      await this.paymentService.save(payment)
    } catch (error) {
      throw new HttpException(
        'PsychoShark API behaved wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}

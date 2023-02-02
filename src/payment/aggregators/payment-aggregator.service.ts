import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MethodType } from '../methods/payment-method.entity'
import { CryptomusService } from './cryptomus/cryptomus.service'
import { CryptomusNotificationParams } from './cryptomus/notification-params.cryptomus'
import { PayAnyWayService } from './payanyway/payanyway.service'
import { QueryPayAnyWay } from './payanyway/query-params.pay-any-way'
import { PaymentAggregatorEntity } from './payment-aggregator.entity'
import { QueryUnitPay } from './unitpay/query-params.unit-pay'
import { UnitPayService } from './unitpay/unitpay.service'

@Injectable()
export class PaymentAggregatorService {
  constructor(
    @InjectRepository(PaymentAggregatorEntity)
    private readonly paymentAggregatorRepository: Repository<PaymentAggregatorEntity>,
    private readonly payAnyWayService: PayAnyWayService,
    private readonly unitPayService: UnitPayService,
    private readonly cryptomusService: CryptomusService,
  ) {}

  public async handleNotificationPayAnyWay(notificationParams: QueryPayAnyWay) {
    await this.payAnyWayService.handleNotification(notificationParams)
  }

  public async handleNotificationUnitPay(notificationParams: QueryUnitPay) {
    await this.unitPayService.handleNotification(notificationParams)
  }

  public async handleNotificationCryptomus(
    notificationParams: CryptomusNotificationParams,
  ) {
    await this.cryptomusService.handleNotification(notificationParams)
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
}

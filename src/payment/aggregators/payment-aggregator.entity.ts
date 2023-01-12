import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity, OneToMany } from 'typeorm'
import { PaymentMethod } from '../methods/payment-method.entity'
import { PaymentEntity } from '../payment.entity'

export enum AggregatorName {
  PAY_ANY_WAY = 'PayAnyWay',
  UNIT_PAY = 'UnitPay',
  CRYPTOMUS = 'Cryptomus',
}

@Entity('payment_aggregators')
export class PaymentAggregator extends BaseEntity {
  @Column({ type: 'enum', enum: AggregatorName })
  name: AggregatorName

  @OneToMany(
    () => PaymentMethod,
    (paymentMethod) => paymentMethod.paymentAggregator,
  )
  paymentMethods: PaymentMethod[]

  public async createPayment(
    httpService: HttpService,
    configService: ConfigService,
    payment: PaymentEntity,
  ) {
    if (this.name === AggregatorName.PAY_ANY_WAY) {
      const { data } = await firstValueFrom(
        httpService.get(
          `${configService.get('PAYANYWAY_API_URL')}?paymentSystem.unitId=${
            payment.method
          }&paymentSystem.limitIds=${payment.method}`,
          {
            params: {
              MNT_ID: configService.get('MNT_ID'),
              MNT_AMOUNT: Number(payment.order.amount.toFixed()),
              MNT_TRANSACTION_ID: payment.id,
              MNT_CURRENCY_CODE: payment.order.currency,
              MNT_DESCRIPTION: payment.description,
              MNT_SUBSCRIBER_ID: payment.user.email,
              MNT_SUCCESS_URL: 'Ссылка на страницу фронта',
            },
          },
        ),
      )
      return data
    } else if (this.name === AggregatorName.UNIT_PAY) {
      const { data } = await firstValueFrom(
        httpService.get(configService.get('UNITPAY_API_URL'), {
          params: {
            paymentType: payment.method,
            account: payment.id,
            sum: Number(payment.order.amount.toFixed()),
            projectId: configService.get('PROJECT_ID'),
            resultUrl: 'Ссылка на страницу фронта',
            desc: payment.description,
            secretKey: configService.get('SECRET_KEY'),
          },
        }),
      )
      return data
    }
  }
}

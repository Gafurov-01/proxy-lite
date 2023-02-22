import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { md5 } from 'md5'
import { base64encode } from 'nodejs-base64'
import { firstValueFrom } from 'rxjs'
import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity, OneToMany } from 'typeorm'
import { PaymentMethodEntity } from '../methods/payment-method.entity'
import { PaymentEntity } from '../payment.entity'

export enum AggregatorName {
  PAY_ANY_WAY = 'PayAnyWay',
  UNIT_PAY = 'UnitPay',
  CRYPTOMUS = 'Cryptomus',
}

@Entity('payment_aggregators')
export class PaymentAggregatorEntity extends BaseEntity {
  @Column({ type: 'enum', enum: AggregatorName })
  name: AggregatorName

  @OneToMany(
    () => PaymentMethodEntity,
    (paymentMethod) => paymentMethod.paymentAggregator,
  )
  paymentMethods: PaymentMethodEntity[]

  public async createPayment(
    httpService: HttpService,
    configService: ConfigService,
    payment: PaymentEntity,
  ) {
    if (this.name === AggregatorName.PAY_ANY_WAY) {
      const MNT_SIGNATURE = md5(
        `${configService.get('MNT_ID')} ${payment.id} ${payment.orders.reduce(
          (accumulator, order) => accumulator + order.amount,
          0,
        )} ${payment.orders[0].currency} ${
          payment.user.email
        } 0 ${configService.get('MNT_INTEGRITY_CODE')}`,
      )

      return {
        redirectUrl: `${configService.get(
          'PAYANYWAY_API_URL',
        )}?MNT_ID=${configService.get('MNT_ID')}&MNT_AMOUNT=${payment.orders
          .reduce((accumulator, order) => accumulator + order.amount, 0)
          .toFixed()}&MNT_TRANSACTION_ID=${payment.id}&MNT_CURRENCY_CODE=${
          payment.orders[0].currency
        }&MNT_TEST_MODE=0&MNT_DESCRIPTION=Покупка на сайте https://proxy-lite.com
         &MNT_SUBSCRIBER_ID=${
           payment.user.email
         }&MNT_SUCCESS_URL=${configService.get(
          'SUCCESS_URL_AFTER_PAYMENT',
        )}&paymentSystem.unitId=${payment.method}&paymentSystem.limitIds=${
          payment.method
        }&MNT_SIGNATURE=${MNT_SIGNATURE}`,
      }
    } else if (this.name === AggregatorName.UNIT_PAY) {
      const { data } = await firstValueFrom(
        httpService.get(configService.get('UNITPAY_API_URL'), {
          params: {
            paymentType: payment.method,
            account: payment.id,
            sum: payment.orders
              .reduce((accumulator, order) => accumulator + order.amount, 0)
              .toFixed(),
            projectId: configService.get('PROJECT_ID'),
            resultUrl: configService.get('SUCCESS_URL_AFTER_PAYMENT'),
            desc: 'Покупка на сайте https://proxy-lite.com',
            secretKey: configService.get('SECRET_KEY'),
            currency: payment.orders[0].currency,
          },
        }),
      )

      return {
        redirectUrl: data.result.redirectUrl,
      }
    } else if (this.name === AggregatorName.CRYPTOMUS) {
      const { data } = await firstValueFrom(
        httpService.post(
          configService.get('CRYPTOMUS_API_URL'),
          {
            amount: payment.orders
              .reduce((accumulator, order) => accumulator + order.amount, 0)
              .toFixed(),
            currency: payment.orders[0].currency,
            order_id: payment.id,
            url_callback:
              'https://proxy-lite.com/api/payment-aggregator/cryptomus',
            url_return: configService.get('SUCCESS_URL_AFTER_PAYMENT'),
            is_payment_multiple: false,
            currencies: [
              {
                currency: 'USDT',
                network: 'tron_trc20',
              },
              {
                currency: 'USDT',
                network: 'eth_erc20',
              },
              {
                currency: 'BTC',
              },
              {
                currency: 'BCH',
              },
            ],
          },
          {
            headers: {
              sign: this.signHeader(payment, configService),
              merchant: configService.get('CRYPTOMUS_MERCHANT_ID'),
            },
          },
        ),
      )

      return {
        redirectUrl: data.result.url,
      }
    }
  }

  private signHeader(payment: PaymentEntity, configService: ConfigService) {
    return md5(
      base64encode(
        JSON.stringify({
          amount: payment.orders.reduce(
            (accumulator, order) => accumulator + order.amount,
            0,
          ),
          currency: payment.orders[0].currency,
          order_id: payment.id,
          url_callback:
            'https://proxy-lite.com/api/payment-aggregator/cryptomus',
          url_return: configService.get('SUCCESS_URL_AFTER_PAYMENT'),
          is_payment_multiple: false,
          currencies: [
            {
              currency: 'USDT',
              network: 'tron_trc20',
            },
            {
              currency: 'USDT',
              network: 'eth_erc20',
            },
            {
              currency: 'BTC',
            },
            {
              currency: 'BCH',
            },
          ],
        }),
      ),
      +configService.get('CRYPTOMUS_API_PAYMENT_KEY'),
    )
  }
}

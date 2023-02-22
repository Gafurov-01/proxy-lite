import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'crypto'
import * as ksort from 'ksort'
import { md5 } from 'md5'
import { firstValueFrom } from 'rxjs'
import { PaymentEntity } from '../payment.entity'

@Injectable()
export class CashboxService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async printCheck(payment: PaymentEntity) {
    try {
      const bodyData = ksort({
        app_id: this.configService.get('CASHBOX_BUSINESS_API_APP_ID'),
        command: {
          c_num: randomUUID(),
          author: 'Аксенов Артем Иванович',
          smsEmail54FZ: payment.user.email,
          goods: payment.orders.map((order) => ({
            name: order.nameProxy ? order.nameProxy : 'Пополнение баланса',
            price: order.amount,
            count: 1,
            sum: order.amount,
            payment_mode: 4,
            item_type: 10,
            nds_value: 0,
            nds_not_apply: true,
          })),
          payed_cashless: payment.orders.reduce(
            (accumulator, order) => accumulator + order.amount,
            0,
          ),
        },
        nonce: randomUUID(),
        token: await this.getNewToken(),
        type: 'printCheck',
      })

      const { data } = await firstValueFrom(
        this.httpService.post('Command', bodyData, {
          headers: {
            sign: this.getSign(bodyData),
          },
        }),
      )
    } catch (error) {
      throw new HttpException('Cashbox error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  private async getNewToken() {
    try {
      const params = ksort({
        app_id: this.configService.get('CASHBOX_BUSINESS_API_APP_ID'),
        nonce: randomUUID(),
      })

      const { data } = await firstValueFrom(
        this.httpService.get('Token', {
          params: params,
          headers: {
            sign: this.getSign(params),
          },
        }),
      )

      return data.token
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  private getSign(params) {
    return md5(
      JSON.stringify(params) +
        this.configService.get('CASHBOX_BUSINESS_API_SECRET_KEY'),
    )
  }
}

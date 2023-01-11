import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { PaymentAggregator } from '../aggregators/payment-aggregator.entity'

export enum MethodType {
  BANK_CARD = 'Банковские карты',
  E_WALLET = 'Электронные кошельки',
  CRYPTO = 'Криптовалюты',
  MY_BALANCE = 'Мой баланс',
}

@Entity('payment_methods')
export class PaymentMethod extends BaseEntity {
  @Column()
  name: string

  @Column({ type: 'enum', enum: MethodType })
  type: MethodType

  @ManyToOne(
    () => PaymentAggregator,
    (paymentAggregator) => paymentAggregator.paymentMethods,
  )
  @JoinColumn({ name: 'payment_aggregator_id' })
  paymentAggregator: PaymentAggregator
}

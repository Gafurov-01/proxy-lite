import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity, OneToMany } from 'typeorm'
import { PaymentMethod } from '../methods/payment-method.entity'

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
}

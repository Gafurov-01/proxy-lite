import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity, OneToMany } from 'typeorm'
import { PaymentMethod } from '../methods/payment-method.entity'

@Entity('payment_aggregators')
export class PaymentAggregator extends BaseEntity {
  @Column()
  name: string

  @Column()
  apiUrl: string

  @Column()
  successUrl: string

  @Column({ nullable: true })
  notificationUrl?: string

  @Column({ type: 'int64' })
  shopId: number

  @OneToMany(
    () => PaymentMethod,
    (paymentMethod) => paymentMethod.paymentAggregator,
  )
  paymentMethods: PaymentMethod[]
}

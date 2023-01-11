import { OrderEntity } from 'src/order/order.entity'
import { UserEntity } from 'src/user/user.entity'
import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { MethodType } from './methods/payment-method.entity'

export enum PaymentType {
  PURCHASE = 'purchase',
  REFUND = 'refund',
}

export enum PaymentStatus {
  SUCCEEDED = 'succeeded',
  PENDING = 'pending',
  CANCELED = 'canceled',
}

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.PURCHASE,
    name: 'payment_type',
  })
  paymentType: PaymentType

  @Column()
  method: MethodType

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    name: 'payment_status',
  })
  status: PaymentStatus

  @Column({ nullable: true })
  description?: string

  @ManyToOne(() => UserEntity, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @OneToOne(() => OrderEntity, (order) => order.payment)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity
}

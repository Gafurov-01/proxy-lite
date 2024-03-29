import { OrderEntity } from 'src/order/order.entity'
import { UserEntity } from 'src/user/user.entity'
import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
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

  @Column({ name: 'aggregator_operation_id', nullable: true })
  aggregatorOperationId?: number

  @Column({ type: 'boolean', default: false })
  isReplenishment: boolean

  @ManyToOne(() => UserEntity, (user) => user.payments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @OneToMany(() => OrderEntity, (order) => order.payment, {
    eager: true,
    cascade: true,
  })
  orders: OrderEntity[]
}

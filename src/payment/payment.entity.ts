import { UserEntity } from 'src/user/user.entity'
import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

export enum PaymentType {
  ADDITION = 'addition',
  DEBIT = 'debit',
  REFUND = 'refund',
}

export enum PaymentStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
  ERROR = 'error',
}

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @Column({ type: 'enum', enum: PaymentType, name: 'payment_type' })
  paymentType: PaymentType

  @Column({ type: 'int64' })
  count: number

  @Column()
  method: string

  @Column()
  tariff: string

  @Column({ type: 'enum', enum: PaymentStatus, name: 'payment_status' })
  status: PaymentStatus

  @Column({ nullable: true })
  description?: string

  @ManyToOne(() => UserEntity, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity
}

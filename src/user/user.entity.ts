import { OrderEntity } from 'src/order/order.entity'
import { PaymentEntity } from 'src/payment/payment.entity'
import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity, OneToMany } from 'typeorm'

export enum Roles {
  ADMIN = 'admin',
  PARTNER = 'partner',
  USER = 'user',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  email: string

  @Column({ type: 'int64', default: 0 })
  balance: number

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles

  @Column({ type: 'boolean', default: false })
  isBlocked: boolean

  @Column({ type: 'boolean', default: false })
  isEmailConfirmed: boolean

  @OneToMany(() => PaymentEntity, (payment) => payment.user)
  payments: PaymentEntity[]

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[]
}

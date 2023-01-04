import { PaymentEntity } from 'src/payment/payment.entity'
import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity, OneToMany } from 'typeorm'

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  email: string

  @Column({ type: 'int64', default: 0 })
  balance: number

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean

  @Column({ type: 'boolean', default: false })
  isEmailConfirmed: boolean

  @OneToMany(() => PaymentEntity, (payment) => payment.user)
  payments: PaymentEntity[]
}

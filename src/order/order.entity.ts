import { PaymentEntity } from 'src/payment/payment.entity'
import { Subnet } from 'src/tariff/tariff.entity'
import { UserEntity } from 'src/user/user.entity'
import { BaseEntity } from 'src/utilities/base.entity'
import { Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm'

export class OrderEntity extends BaseEntity {
  @Column()
  typeProxy: string

  @Column()
  nameProxy: string

  @Column({ type: 'int64' })
  threadLimit: number

  @Column({ type: 'int64' })
  rotatePeriodSec: number

  @Column({ type: 'enum', enum: Subnet })
  subnet: Subnet

  @Column()
  country: string

  @Column({ type: 'int64' })
  ttlSec: number

  @Column({ type: 'int64' })
  price: number

  @Column({ default: 'RUB' })
  currency: string

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @OneToOne(() => PaymentEntity, (payment) => payment.order, { nullable: true })
  payment?: PaymentEntity
}

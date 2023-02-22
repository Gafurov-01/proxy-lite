import { PaymentEntity } from 'src/payment/payment.entity'
import { Subnet } from 'src/tariff/tariff.entity'
import { UserEntity } from 'src/user/user.entity'
import { BaseEntity } from 'src/utilities/base.entity'
import { Column, JoinColumn, ManyToOne } from 'typeorm'

export class OrderEntity extends BaseEntity {
  @Column({ nullable: true })
  typeProxy?: string

  @Column({ nullable: true })
  nameProxy?: string

  @Column({ type: 'int64', nullable: true })
  threadLimit?: number

  @Column({ type: 'int64', nullable: true })
  rotatePeriodSec?: number

  @Column({ type: 'enum', enum: Subnet, nullable: true })
  subnet?: Subnet

  @Column({ nullable: true })
  country?: string

  @Column({ type: 'int64', nullable: true })
  ttlSec?: number

  @Column({ type: 'int64' })
  amount: number

  @Column({ default: 'RUB' })
  currency: string

  @Column({ type: 'boolean', default: false })
  isBought: boolean

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToOne(() => PaymentEntity, (payment) => payment.orders, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'payment_id' })
  payment?: PaymentEntity
}

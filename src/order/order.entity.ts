import { Subnet } from 'src/tariff/tariff.entity'
import { UserEntity } from 'src/user/user.entity'
import { BaseEntity } from 'src/utilities/base.entity'
import { Column, JoinColumn, ManyToOne } from 'typeorm'

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
  amount: number

  @Column({ default: 'RUB' })
  currency: string

  @Column({ type: 'boolean', default: false })
  isBought: boolean

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity
}

import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity } from 'typeorm'

export enum Subnet {
  TwentyNine = 29,
  ThirtyTwo = 32,
  FortyEight = 48,
}

@Entity('tariff')
export class TariffEntity extends BaseEntity {
  @Column()
  typeProxy: string

  @Column()
  name: string

  @Column({ type: 'int64' })
  threadLimit: number

  @Column({ type: 'int64' })
  rotatePeriodSec: number

  @Column({ type: 'enum', enum: Subnet })
  subnet: Subnet

  @Column({ type: 'int64' })
  price: number
}
